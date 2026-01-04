export const navigationMenu = [
  {
    label: "Very Low Frequency (VLF)",
    items: [
      { label: "Explore data", icon: "pi pi-fw pi-search", to: "/" },
      {
        label: "What is",
        icon: "pi pi-fw pi-info-circle",
        to: "/markdown/what-is",
      },
      { label: "VLF", icon: "pi pi-fw pi-sun", to: "/markdown/vlf" },
    ],
  },
  {
    label: "About us",
    items: [
      {
        label: "The Project",
        icon: "pi pi-fw pi-users",
        to: "/markdown/the-project",
      },
      {
        label: "Open Science",
        icon: "pi pi-fw pi-globe",
        to: "/markdown/open-science",
      },
      {
        label: "Publications",
        icon: "pi pi-fw pi-file",
        to: "/markdown/publications",
      },
    ],
  },
];
