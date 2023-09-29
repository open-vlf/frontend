<script setup lang='ts'>
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { add, format, isBefore } from 'date-fns'
import { useDemoStore } from '@/store'
import type { File } from '@/store/demo'
import { noZoneDate } from '@/utils'

// Logic
const demo = useDemoStore()

// Date
const selectedDate: Ref<Date | null> = ref(null)
const selectedDateRecords: Ref<number> = ref(0)
function onSelectDate(date: Date, records: number) {
  selectedDate.value = date
  selectedDateRecords.value = records
}

// Data provider
const selectedProvider: Ref<{ name: string; code: string } | null> = ref({ name: 'SAVNET', code: 'savnet' })
const providers: Ref<Array<{ name: string; code: string }>> = ref([
  { name: 'SAVNET', code: 'savnet' },
  { name: 'AWESOME', code: 'awesome' },
])

// Year
const selectedYear: Ref<{ name: number; code: number } | null> = ref(null)
const years: Ref<Array<{ name: number; code: number }>> = ref([])

// Receiving
const selectedReceivingStation: Ref<{ name: string; code: string } | null> = ref(null)
const receivingStations: Ref<Array<{ name: string; code: string }>> = ref([])

// Type
const selectedNarrowband: Ref<boolean> = ref(false)
const selectedType: Ref<{ name: string; code: string } | null> = ref({ name: 'Narrowband', code: 'narrowband' })
const types: Ref<Array<{ name: string; code: string }>> = ref([
  { name: 'Narrowband', code: 'narrowband' },
  { name: 'Broadband', code: 'broadband' },
])

// Transmitter
const selectedTransmitterStation: Ref<{ name: string; code: string } | null> = ref(null)
const transmitterStations: Ref<Array<{ name: string; code: string }>> = ref([])

// File
const selectedFile: Ref<File | null> = ref(null)

// Search
const initialLoading: Ref<boolean> = ref(true)
const searchLoading: Ref<boolean> = ref(false)
const transmitterLoading: Ref<boolean> = ref(false)
const filesLoading: Ref<boolean> = ref(false)
const plotLoading: Ref<boolean> = ref(false)

async function onInitial(): Promise<void> {
  searchLoading.value = true
  initialLoading.value = true

  years.value = []
  receivingStations.value = []
  selectedYear.value = null

  await demo.searchYearsAndStations(selectedProvider.value!.code)
  await demo.searchMap()

  demo.getYears.forEach((value: number) => {
    years.value.push({ name: value, code: value })
  })

  const currentYear = years.value[0].name

  demo.getReceivers.get(currentYear)?.forEach((value) => {
    receivingStations.value.push({ name: value, code: value })
  })

  selectedYear.value = years.value[0]
  selectedReceivingStation.value = receivingStations.value[0]
  console.log(selectedReceivingStation.value)

  searchLoading.value = false
  initialLoading.value = false
}

async function onSearch(): Promise<void> {
  if (!selectedYear.value
      || !selectedReceivingStation.value
      || !selectedType.value || !selectedType.value || !selectedProvider.value)
    return alert('Please fill all the filters before search again!')

  searchLoading.value = true

  demo.clearFiles()
  demo.clearPlot()
  filesLoading.value = false

  await demo.searchMap(
    selectedYear.value.code,
    selectedType.value.code as 'narrowband' | 'broadband',
    selectedReceivingStation.value.code,
    selectedProvider.value.code,
  )

  searchLoading.value = false
}

async function onTransmitter(): Promise<void> {
  if (selectedDate.value == null
      || !selectedYear.value
      || !selectedReceivingStation.value
      || !selectedType.value)
    return alert('Please fill all the filters before search again!')

  transmitterLoading.value = true
  transmitterStations.value = []

  await demo.searchTransmitters(
    selectedYear.value.code,
    selectedReceivingStation.value.code,
    selectedDate.value,
  )

  demo.getTransmitters.forEach((station) => {
    transmitterStations.value.push({ name: station, code: station })
  })

  transmitterLoading.value = false
}

async function onFiles(): Promise<void> {
  if (!selectedDate.value || !selectedDateRecords.value)
    return alert('Please a file before generating the plot!')

  filesLoading.value = true

  await demo.searchFiles(
    selectedDate.value!.getFullYear(),
    selectedType.value!.name.toLowerCase() as 'narrowband' | 'broadband',
    selectedReceivingStation.value!.name,
    selectedDate.value!,
    selectedProvider.value!.code,
  )

  filesLoading.value = false
}

async function onPlot(): Promise<void> {
  if (selectedFile.value == null)
    return alert('Please a file before generating the plot!')

  plotLoading.value = true

  await demo.searchPlot(selectedFile.value)

  plotLoading.value = false
}

async function onDownload(): Promise<void> {
  if (selectedFile.value == null)
    return alert('Please select a file before download it!')

  window.open(selectedFile.value!.url, '_blank')
}

function isoDayOfWeek(dt: any) {
  let wd = dt.getDay() // 0..6, from sunday
  wd = (wd + 6) % 7 + 1 // 1..7 from monday
  return `${wd}` // string so it gets parsed
}

function getData(): Array<object> {
  if (selectedYear.value) {
    const year = selectedYear.value.name
    const data = []

    const startDate = noZoneDate(`${year}/01/01`)
    const endDate = noZoneDate(`${Number(year) + 1}/01/01`)

    let currentDate = startDate

    while (isBefore(currentDate, endDate)) {
      const iso = currentDate.toISOString().substr(0, 10)

      data.push({
        x: iso,
        y: isoDayOfWeek(currentDate),
        d: iso,
        v: demo.search.get(iso) ?? 0,
        fullDate: currentDate,
      })

      currentDate = add(currentDate, { days: 1 })
    }

    return data
  }

  return []
}

watch(selectedProvider, (newValue) => {
  if (newValue?.code === 'awesome')
    selectedType.value = { name: 'Broadband', code: 'broadband' }

  onInitial()
})

watch(selectedYear, (newValue, oldValue) => {
  if (oldValue == null)
    return

  selectedDate.value = null
  selectedReceivingStation.value = null

  if (newValue) {
    receivingStations.value = []

    demo.getReceivers.get(newValue.name)?.forEach((value) => {
      receivingStations.value.push({ name: value, code: value })
    })
  }
})

watch(selectedType, (newValue) => {
  selectedNarrowband.value = !!(newValue && newValue.code === 'narrowband')
})

watch(selectedDate, () => {
  demo.clearTransmitters()
  demo.clearFiles()
  demo.clearPlot()
  plotLoading.value = false
  filesLoading.value = false
  selectedTransmitterStation.value = null
})

watch(selectedTransmitterStation, (newValue) => {
  if (newValue)
    demo.filterTransmitterFiles(newValue.code)
  else
    demo.filterTransmitterFiles(undefined)
})

watch(selectedFile, () => {
  demo.clearPlot()
})

onBeforeMount(onInitial)
</script>

<template>
  <div class="mb-32">
    <div class="card pl-10 pr-10">
      <div>
        <p class="text-2xl font-bold">
          <i class="pi pi-globe mr-1" style="font-size: 1.2rem" />
          Data provider
        </p>

        <Dropdown
          v-model="selectedProvider"
          :options="providers"
          filter
          class="w-full md:w-20rem"
          option-label="name"
          placeholder="Select the data provider"
        />
      </div>
    </div>

    <div class="card pl-10 pr-10">
      <p class="text-2xl font-bold">
        <i class="pi pi-filter mr-1" style="font-size: 1.2rem" />
        Search filters
      </p>

      <div class="flex justify-between">
        <div>
          <div class="mb-6">
            <p class="mb-2">
              Year
            </p>

            <Dropdown
              v-model="selectedYear"
              :options="years"
              :loading="initialLoading"
              filter
              class="w-full md:w-20rem"
              option-label="name"
              placeholder="Select year"
            />
          </div>

          <p class="mb-2">
            Frequency band
          </p>

          <Dropdown
            v-if="selectedProvider?.code === 'awesome'"
            v-model="selectedType"
            :options="types"
            :loading="initialLoading"
            disabled
            class="w-full md:w-20rem"
            option-label="name"
          />

          <Dropdown
            v-else
            v-model="selectedType"
            :options="types"
            :loading="initialLoading"
            filter
            class="w-full md:w-20rem"
            option-label="name"
            placeholder="Select type"
          />
        </div>

        <div>
          <div class="mb-6">
            <p class="mb-2">
              Receiving station
            </p>

            <Dropdown
              v-model="selectedReceivingStation"
              :options="receivingStations"
              :loading="initialLoading"
              filter
              class="w-full md:w-20rem"
              option-label="name"
              placeholder="Select station"
            />
          </div>
        </div>
      </div>

      <div class="mt-12 flex justify-between text-right">
        <Button
          class="h-10"
          icon="pi pi-search"
          label="Search"
          :loading="searchLoading"
          @click="onSearch"
        />

        <div v-if="selectedDate" class="flex">
          <div>
            <p class="text-sm m-0 text-right">
              Selected date
            </p>

            <p class="text-lg font-bold m-0">
              {{ format(selectedDate, 'MMMM dd, yyyy') }}
            </p>

            <Button
              class="mt-2"
              size="small"
              icon="pi pi-trash"
              severity="danger"
              rounded
              outlined
              aria-label="Cancel"
              label="Clear selection"
              @click="() => selectedDate = null"
            />
          </div>
        </div>

        <div v-else>
          <p class="text-md text-white m-0 text-right">
            No date selected.
          </p>
        </div>
      </div>
    </div>

    <heatmap
      v-if="!initialLoading && !searchLoading"
      :data="getData()"
      @on-select-date="onSelectDate"
    />

    <ProgressBar
      v-show="initialLoading || searchLoading"
      mode="indeterminate"
      style="height: 6px"
    />

    <div
      v-if="selectedDate && selectedNarrowband && selectedDateRecords > 0"
      class="card mt-6 pl-10 pr-10"
    >
      <div class="flex justify-between">
        <p class="text-2xl font-bold m-0">
          <i class="pi pi-wifi mr-1" style="font-size: 1.2rem" />
          Transmitter station
        </p>

        <Button
          icon="pi pi-search-plus"
          label="Get transmitter stations"
          :loading="transmitterLoading"
          @click="onTransmitter"
        />
      </div>

      <div v-if="demo.getTransmitters.length > 0">
        <Dropdown
          v-model="selectedTransmitterStation"
          :options="transmitterStations"
          filter
          class="w-full md:w-20rem"
          option-label="name"
          placeholder="Select transmitter"
        />
      </div>
    </div>

    <div
      v-if="selectedNarrowband
        ? (selectedNarrowband && selectedTransmitterStation) && selectedDate && selectedDateRecords > 0
        : selectedDate && selectedDateRecords > 0"
      class="card mt-6 pl-10 pr-10"
    >
      <div class="flex justify-between">
        <p class="text-2xl font-bold m-0">
          <i class="pi pi-file mr-1" style="font-size: 1.2rem" />
          Files
        </p>

        <Button
          v-if="!selectedNarrowband"
          icon="pi pi-search-plus"
          label="Find files"
          :loading="filesLoading"
          @click="onFiles"
        />
      </div>

      <div v-if="demo.getFiles.length > 0">
        <DataTable
          v-model:selection="selectedFile"
          class="mt-8"
          paginator
          :value="demo.getFiles"
          :rows="5"
          :rows-per-page-options="[5, 10, 20, 50]"
          table-style="width: 100%"
          paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          current-page-report-template="{first} to {last} of {totalRecords}"
        >
          <template #paginatorstart>
            <Button
              rounded
              outlined
              severity="danger"
              icon="pi pi-chart-bar"
              label="View plot"
              :loading="plotLoading"
              :disabled="!selectedFile"
              @click="onPlot"
            />
          </template>
          <template #paginatorend>
            <Button
              rounded
              outlined
              severity="danger"
              icon="pi pi-download"
              label="Download"
              :disabled="!selectedFile"
              @click="onDownload"
            />
          </template>
          <Column selection-mode="single" header-style="width: 3rem" />
          <Column field="fileName" header="File name" style="width: 50%" />
          <Column field="resolution" header="Resolution" style="width: 25%" />
          <Column field="phase" header="A/Phase" style="width: 25%" />
        </DataTable>

        <div v-if="!plotLoading && demo.getPlot" class="mt-12">
          <p class="text-xl font-bold mb-4">
            <i class="pi pi-chart-bar mr-1" />
            Plot
          </p>

          <img
            class="flex q-mt-md "
            alt="Plot view"
            :src="demo.getPlot"
          >
        </div>
      </div>
    </div>

    <div
      v-if="selectedDate && selectedDateRecords === 0"
      class="card mt-6 pl-10 pr-10"
    >
      <div class="flex justify-between mb-1">
        <p class="text-2xl font-bold m-0">
          <i class="pi pi-file-excel mr-1" style="font-size: 1.2rem" />
          No records encountered for this date.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
