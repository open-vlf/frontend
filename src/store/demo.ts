import axios from "axios";
import { defineStore } from "pinia";
import { getAuthHeaders } from "../modules/firebase";

export type typeABCDF = "A" | "B" | "C" | "D" | "F";

const providerToExtension: Map<string, string> = new Map([
  ["awesome", "mat"],
  ["savnet", "fits"],
]);

const mapABCDF: Map<typeABCDF, Array<string>> = new Map([
  ["A", ["low", "amplitude"]],
  ["B", ["low", "phase"]],
  ["C", ["high", "amplitude"]],
  ["D", ["high", "phase"]],
  ["F", ["high", "group delay"]],
]);

export interface File {
  CC?: string;
  dateTime: number;
  endpointType: string;
  fileName: string;
  path: string;
  stationId: string;
  timestamp: number;
  transmitter?: string;
  typeABCDF?: "A" | "B" | "C" | "D" | "F";
  url: string;
}

export const useDemoStore = defineStore("demo", {
  state: () => ({
    search: new Map<string, number>(),
    years: new Set<number>(),
    receivers: new Map<number, Set<string>>(),
    transmitters: [] as string[],
    files: [] as File[],
    transmitterFiles: [] as File[],
    plot: String,
  }),
  getters: {
    getSearch: (state): Map<string, number> => {
      return state.search;
    },
    getYears: (state): Set<number> => {
      return state.years;
    },
    getReceivers: (state): Map<number, Set<string>> => {
      return state.receivers;
    },
    getTransmitters: (state): Array<string> => {
      return state.transmitters;
    },
    getFiles: (state) => {
      return state.files;
    },
    getPlot: (state) => {
      return state.plot;
    },
  },
  actions: {
    clearTransmitters(): void {
      this.transmitters = [];
      this.transmitterFiles = [];
    },
    clearPlot(): void {
      // @ts-expect-error
      this.plot = null;
    },
    clearFiles(): void {
      this.files = [];
    },
    async searchYearsAndStations(provider?: string): Promise<void> {
      try {
        const fileEndsWith = provider
          ? providerToExtension.get(provider)
          : providerToExtension.get("SAVNET");

        const response = await axios.get<
          Array<{
            year: number;
            stations: Array<string>;
          }>
        >(
          `https://get-years-stations-sm6mx5mo3a-uc.a.run.app/?fileEndsWith=${
            fileEndsWith ?? "mat"
          }`,
          {
            headers: await getAuthHeaders(),
          },
        );

        this.years = new Set<number>();
        this.receivers = new Map<number, Set<string>>();

        response.data.forEach(
          (value: { year: number; stations: Array<string> }) => {
            this.years.add(value.year);
            this.receivers.set(value.year, new Set<string>());

            value.stations.forEach((station: string) => {
              this.receivers.get(value.year)?.add(station);
            });
          },
        );
      } catch (_e) {
        alert(
          "Couldn't fetch the years and stations information, please try again later",
        );
      }
    },
    async searchMap(
      provider: string,
      year?: number,
      type?: "narrowband" | "broadband",
      station?: string,
    ): Promise<void> {
      try {
        const fileEndsWith = providerToExtension.get(provider);

        let url = "https://get-matrix-sm6mx5mo3a-uc.a.run.app/";

        if (year && type && station) {
          url = `${url}?year=${year}&station=${station}&type=${type.toLowerCase()}&fileEndsWith=${
            fileEndsWith ?? "mat"
          }`;
        } else {
          url = `${url}?fileEndsWith=${fileEndsWith ?? "mat"}`;
        }

        const response = await axios.get(url, {
          headers: await getAuthHeaders(),
        });

        this.search = new Map<string, number>();

        response.data.forEach(
          (value: { count: number; date: string; stations: Array<string> }) => {
            this.search.set(value.date, value.count);
          },
        );
      } catch (_e) {
        this.search = new Map<string, number>();
      }
    },
    async searchPlot(file: File): Promise<void> {
      try {
        const response = await axios.post(
          "https://graph-generator-sm6mx5mo3a-uc.a.run.app",
          { path: file.path },
          {
            headers: await getAuthHeaders(),
          },
        );

        this.plot = response.data;
      } catch (_e) {
        alert(
          "Could not generate the plot for this file, please try again later.",
        );
      }
    },
    async searchTransmitters(
      year: number,
      station: string,
      date: Date,
      provider?: string,
    ): Promise<Array<string>> {
      const files = await this.searchFiles(
        year,
        "narrowband",
        station,
        date,
        provider,
      );
      const origins = files.map(
        (file) => file.transmitter ?? file.fileName.slice(14, 17),
      );
      const result = [...new Set(origins)];

      this.transmitters = result;
      this.transmitterFiles = files;

      return result;
    },
    filterTransmitterFiles(transmitterStation?: string): void {
      this.files = transmitterStation
        ? this.transmitterFiles.filter((file) => {
            return file.transmitter === transmitterStation;
          })
        : this.transmitterFiles;
    },
    async searchFiles(
      year: number,
      type: "narrowband" | "broadband",
      station: string,
      date: Date,
      provider?: string,
    ): Promise<Array<File>> {
      const fileEndsWith = provider
        ? providerToExtension.get(provider)
        : providerToExtension.get("SAVNET");

      try {
        const response = await axios.get<Array<File>>(
          `https://get-available-files-sm6mx5mo3a-uc.a.run.app/?year=${year}&month=${
            date.getMonth() + 1
          }&day=${date.getDate()}&station=${station}&type=${type.toLowerCase()}&fileEndsWith=${
            fileEndsWith ?? "mat"
          }`,
          {
            headers: await getAuthHeaders(),
          },
        );

        this.files = response.data.map((file) => {
          if (fileEndsWith?.includes("fits")) {
            return file;
          }

          const typeABCDF = file.typeABCDF;

          return {
            ...file,
            resolution: typeABCDF ? mapABCDF.get(typeABCDF)?.[0] : undefined,
            phase: typeABCDF ? mapABCDF.get(typeABCDF)?.[0] : undefined,
          };
        });

        return this.files;
      } catch (_e) {
        alert("No records found");
      }

      return [];
    },
  },
});
