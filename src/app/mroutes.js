import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import WhizLayout from "./components/WhizLayoutM/WhizLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";

// SESSION PAGES

const MHome = Loadable(lazy(() => import("app/views/mobile/Home")));

const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
const ActionItems = Loadable(lazy(() => import("app/views/Action/ActionItems")));
const CompletedInitiativesList = Loadable(
  lazy(() => import("app/views/CompletedInitiativesList/CompletedInitiatives"))
);
const LoadingPage = Loadable(lazy(() => import("app/views/LoadingPage")));
const EditPage = Loadable(lazy(() => import("app/views/InitiativeManagement/Edit/EditPage")));
const ConvertedInitiatives = Loadable(
  lazy(() => import("app/views/ConvertedInitiatives/ConvertedInitiatives"))
);
const ProfilePage = Loadable(lazy(() => import("app/views/Profile/Profile")));
const InitiativeStatusManagement = Loadable(
  lazy(() => import("app/views/InitiativeStatusManagement/index"))
);
const UnderConstruction = Loadable(lazy(() => import("app/views/UnderConstruction")));

const Warehouse = Loadable(lazy(() => import("app/views/Warehouse/Warehouse")));
// const ExternalAudit = Loadable(lazy(() => import("app/views/ExternalAudit")));
const WithdrawnInitiatives = Loadable(
  lazy(() => import("app/views/WithdrawnInitiatives/WithdrawnInitiatives"))
);
const Reallocation = Loadable(lazy(() => import("app/views/Reallocation")));
const Currency = Loadable(lazy(() => import("app/views/Currency")));
const Skills = Loadable(lazy(() => import("app/views/Skills/SkillsInfo")));
const Country = Loadable(lazy(() => import("app/views/Country/CountryInformation")));
const AuditTypeDefinition = Loadable(
  lazy(() => import("app/views/AuditTypeDefinition/AuditTypeDefiInfo"))
);
const WatchList = Loadable(
  lazy(() => import("app/views/WatchListConfiguration/WatchListConfiguration"))
);
const DocumentsCategory = Loadable(lazy(() => import("app/views/DocumentsCategory/DocCategory")));
const DepartmentMaster = Loadable(
  lazy(() => import("app/views/DepartmentMaster/DepartmentMaster"))
);

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/utils/Analytics")));
const InitiativePrioritization = Loadable(lazy(() => import("app/views/InitiativePrioritization")));
const InitiativeManagement = Loadable(
  lazy(() => import("app/views/InitiativeManagement/InitiativeManagement"))
);
const InitiativeConversion = Loadable(lazy(() => import("app/views/InitiativeConversion")));
const InitiativeProgress = Loadable(lazy(() => import("app/views/InitiativeProgress")));
const ManComPrioritization = Loadable(lazy(() => import("app/views/ManComPrioritization")));
const InitiativeLinking = Loadable(lazy(() => import("app/views/InitiativeLinking")));
const Program = Loadable(lazy(() => import("app/views/Program")));
const ProjectMain = Loadable(lazy(() => import("app/views/ProjectMain")));
const LandingPage = Loadable(lazy(() => import("app/views/LandingPage")));
const ProgramList = Loadable(lazy(() => import("app/views/Programs/ProgramList/index")));
const ProjectList = Loadable(lazy(() => import("app/views/Programs/ProjectList/index")));
const MilestoneProgress = Loadable(lazy(() => import("app/views/Programs/MilestoneProgress")));
const InitiativeReport = Loadable(lazy(() => import("app/views/Reports/InitiativeReport")));
const ActionItemsReport = Loadable(lazy(() => import("app/views/Reports/ActionItemsReport")));
const ChangeNOIReport = Loadable(lazy(() => import("app/views/Reports/ChangeNOIReport")));
const ProgramTrackingReport = Loadable(
  lazy(() => import("app/views/Reports/ProgramTrackingReport/ProgramTrackingReport"))
);
const DelayedInitiativeReport = Loadable(
  lazy(() => import("app/views/Reports/DelayedInitiativeReport"))
);
const DeliveryCalendarReport = Loadable(
  lazy(() => import("app/views/Reports/DeliveryCalendarReport"))
);
const AgeingReport = Loadable(lazy(() => import("app/views/Reports/AgeingReport")));
const ExternalAudit = Loadable(lazy(() => import("app/views/ExternalAudits")));
const Snooze = Loadable(lazy(() => import("app/views/Snooze")));
const mroutes = [
  {
    element: (
      <AuthGuard>
        <WhizLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,

      {
        path: "/under-construction",
        element: <UnderConstruction />
      },
      { path: "/", element: <MHome /> },

      { path: "/landingPage", element: <MHome /> }
    ]
  },

  // session pages route
  { path: "/LoadingPage", element: <LoadingPage /> },
  { path: "/session/404", element: <NotFound /> },
  { path: "/signin", element: <JwtLogin /> },
  { path: "/signup", element: <JwtRegister /> },

  { path: "*", element: <NotFound /> }
];

export default mroutes;
