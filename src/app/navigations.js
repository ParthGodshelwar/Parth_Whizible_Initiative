export const navigations = [
  {
    name: "e-Dashboard",
    path: "/dashboard/default",
    icon: "dashboard",
    children: [
      { name: "Initiative Dashboard", path: "/initiative/initiatives", iconText: "I" },
      { name: "Business User Tracking", path: "/initiative/converted-initiatives", iconText: "CI" },
      { name: "Initiative Progress", path: "/initiative/completed-initiatives", iconText: "CI" }
    ]
  },

  {
    name: "Initiative Management",

    icon: "dashboard",
    children: [
      { name: "Initiatives", path: "/initiative/initiatives", iconText: "I" },
      { name: "Converted Initiatives", path: "/initiative/converted-initiatives", iconText: "CI" },
      { name: "Completed Initiatives", path: "/initiative/completed-initiatives", iconText: "CI" },
      { name: "Withdrawn Initiatives", path: "/initiative/withdrawn-initiatives", iconText: "WI" },
      { name: "Warehouse", path: "/initiative/warehouse", iconText: "W" },
      { name: "Action Items", path: "/initiative/action-items", iconText: "AI" },
      {
        name: "Watch List Configuration",
        path: "/initiative/watch-list-configuration",
        iconText: "WLC"
      },
      { name: "External Audit", path: "/initiative/external-audit", iconText: "EA" },
      {
        name: "Initiative Reallocations",
        path: "/initiative/initiative-reallocations",
        iconText: "IR"
      },
      {
        name: "Initiative Activate Snooze",
        path: "/initiative/initiative-activate-snooze",
        iconText: "IAS"
      },
      {
        name: "Initiative Status Management",
        path: "/initiative/initiative-status-management",
        iconText: "ISM"
      }
    ]
  },
  {
    name: "Program",
    icon: "dashboard",
    children: [
      { name: "Program List", path: "/program/program-list", iconText: "PL" },
      { name: "Project List", path: "/program/project-list", iconText: "PJ" },
      { name: "Milestone Progress", path: "/program/milestone-progress", iconText: "MP" }
    ]
  },
  {
    name: "Project",
    icon: "dashboard",
    children: [
      { name: "Project List", path: "/project/project-list", iconText: "PL" },
      { name: "Create Project", path: "/project/create-project", iconText: "CP" },
      { name: "Update Project Health", path: "/project/update-project-health", iconText: "UPH" },
      {
        name: "Project Health Sheet Approval",
        path: "/project/project-health-sheet-approval",
        iconText: "PHSA"
      },
      { name: "Update Actual Cost", path: "/project/update-actual-cost", iconText: "UAC" }
    ]
  },
  {
    name: "Initiative Tracking",
    icon: "dashboard",
    children: [
      { name: "Initiative Progress", path: "/tracking/initiative-progress", iconText: "IP" },
      { name: "Initiative Conversion", path: "/tracking/initiative-conversion", iconText: "IC" },
      {
        name: "Initiative Prioritization",
        path: "/tracking/initiative-prioritization",
        iconText: "IP"
      },
      { name: "Initiative Linking", path: "/tracking/initiative-linking", iconText: "IL" },
      { name: "Man-Com Prioritization", path: "/tracking/man-com-prioritization", iconText: "MCP" }
    ]
  },
  {
    name: "Reports",
    icon: "reports",
    children: [
      { name: "Initiative Report", path: "/reports/initiative-report", iconText: "IR" },
      { name: "Action Items Report", path: "/reports/action-items-report", iconText: "AIR" },
      {
        name: "Change Nature Of Initiative Report",
        path: "/reports/change-nature-of-initiative-report",
        iconText: "CNOIR"
      },
      {
        name: "Program Tracking Report",
        path: "/reports/program-tracking-report",
        iconText: "PTR"
      },
      { name: "Delayed Initiatives", path: "/reports/delayed-initiatives", iconText: "DI" },
      { name: "Delivery Calendar", path: "/reports/delivery-calendar", iconText: "DC" },
      { name: "Ageing Report", path: "/reports/ageing-report", iconText: "AR" }
    ]
  },
  {
    name: "Favorite",
    icon: "favorite",
    children: [
      { name: "Favorite page one", path: "/favorite/favorite-page-one", iconText: "FP1" },
      { name: "Favorite page Two", path: "/favorite/favorite-page-two", iconText: "FP2" },
      { name: "Favorite page Three", path: "/favorite/favorite-page-three", iconText: "FP3" }
    ]
  }
];
