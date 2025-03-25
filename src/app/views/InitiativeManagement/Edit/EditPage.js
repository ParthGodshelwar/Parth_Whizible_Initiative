import React, { useState, useEffect } from "react";
import { Nav, Table } from "react-bootstrap";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField, Dropdown, DatePicker } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import "bootstrap/dist/css/bootstrap.min.css";
import currentstage from "../../../../assets/img/currentstage.svg";
import { tabData, formData, buttonData } from "./EditDumy";
import ResourceEdit from "./ResourceEdit";
import BasicDetailEdit from "./BasicDetailEdit";
import CostTabContent from "./CostTabContent";
import FundingTab from "./Funding";
import WorkOrderTab from "./WorkOrder";
import ROIComponent from "./ROIComponent";
import StageComponent from "./StageComponent";
import TimelinesComponent from "./TimelinesComponent";
import DocumentsComponent from "./DocumentsComponent";
import WorkflowTabs from "./WorkFlow";
import Discussion from "./Discussion";
import InitiativeHistoryTab from "./InitiativeHistoryTab";
import MoreActions from "./MoreActions";

import GetInitiativeDetail from "../../../hooks/Editpage/GetInitiativeDetail";
import GetInitiativeROIList from "../../../hooks/Editpage/GetInitiativeROIList";
import GetInitiativeStageList from "../../../hooks/Editpage/GetInitiativeStageList";
import GetInitiativeDocumentList from "../../../hooks/Editpage/GetInitiativeDocumentList";
import GetInitiativeTimeline from "../../../hooks/Editpage/GetInitiativeTimeline";
import GetInitiativeResourceList from "../../../hooks/Editpage/GetInitiativeResourceList";
import GetInitiativeCostList from "../../../hooks/Editpage/GetInitiativeCostList";
import GetInitiativeWorkOrderList from "../../../hooks/Editpage/GetInitiativeWorkOrderList";
import GetInitiativeFundList from "../../../hooks/Editpage/GetInitiativeFundList";
import GetInitiativeDiscussion from "../../../hooks/Editpage/GetInitiativeDiscussion";
import GetInitiativeHistory from "../../../hooks/Editpage/GetInitiativeHistory";
import GetInitiativeLinkAccess from "../../../hooks/Editpage/GetInitiativeLinkAccess";
import GetInitiativeWorkFlow from "../../../hooks/Editpage/GetInitiativeWorkFlow";
import GetInitiativeRisks from "../../../hooks/Editpage/GetInitiativeRisks";
import GetInitiativeRisksHeat from "app/hooks/Editpage/GetInitiativeRisksHeat";
import GetInitiativeActioItems from "../../../hooks/Editpage/GetInitiativeActioItems";
import GetPrioritizationCheckList from "app/hooks/Editpage/GetPrioritizationCheckList";
import { ref } from "yup";

{/* Passed initiatives by Gauri for manage workflow stages on 24 Mar 2025 */}
const EditPage = ({ initiatives, initiativesID, setIsEditing, image, setRefresh12, refresh12, show }) => {
  const [activeTab, setActiveTab] = useState("basic-details");
  const [activeTab1, setActiveTab1] = useState("");
  const [tabsData, setTabsData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [tabsToShow, setTabsToShow] = useState(4);
  const [formDataState, setFormDataState] = useState({
    natureOfInitiative: "",
    initiativeCode: "",
    businessGroup: null,
    organizationUnit: null,
    plannedStart: null,
    plannedEnd: null
  });
  const [userID, setUserID] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [initiativeDetail, setInitiativeDetail] = useState(null);
  const [initiativeROI, setInitiativeROI] = useState(null);
  const [initiativeStage, setInitiativeStage] = useState(null);
  const [initiativeDocument, setInitiativeDocument] = useState(null);
  const [initiativeTimeline, setInitiativeTimeline] = useState(null);
  const [initiativeResource, setInitiativeResource] = useState(null);
  const [initiativeCost, setInitiativeCost] = useState(null);
  const [initiativeWorkOrder, setInitiativeWorkOrder] = useState(null);
  const [initiativeFund, setInitiativeFund] = useState(null);
  const [initiativeDiscussion, setInitiativeDiscussion] = useState(null);
  const [initiativeHistory, setInitiativeHistory] = useState(null);
  const [initiativeLinkAccess, setInitiativeLinkAccess] = useState(null);
  const [initiativeWorkFlow, setInitiativeWorkFlow] = useState(null);
  {/* Passed initiativesData by Gauri for manage workflow stages on 24 Mar 2025 */}
  const [initiativesData, setInitiativesData] = useState(null);
  const [initiativeRisks, setInitiativeRisks] = useState(null);
  const [acc, setAcc] = useState([]);
  const [initiativeRisksHeat, setInitiativeRisksHeat] = useState(null);
  const [initiativeActioItems, setInitiativeActioItems] = useState(null);
  const [prioritizationCheckList, setPrioritizationCheckList] = useState(null);
  const [refresh, setRefresh] = useState(false);
  console.log("initiativesIDxx", initiativesID);
  const handleGoBack = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    setRefresh12(!refresh12);
  }, [refresh]);

  useEffect(() => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    setUserID(userdata?.employeeId);

    const fetchData = async () => {
      try {
        const detail = await GetInitiativeDetail(initiativesID, userdata?.employeeId);

        // Set tabs data from the API response
        const tabs = detail.data.listInitiativeDetailSubtagEntity.map((tab) => ({
          id: tab.subTagName.toLowerCase().replace(" ", "-"), // Generating an ID from subTagName
          title: tab.subTagName,
          api: tab.api,
          applicable: tab.applicable,
          subTagID: tab.subTagID
        }));

        // Always include basic details
        tabs.unshift({
          id: "basic-details",
          title: "Basic Details",
          api: null, // No API for Basic Details
          applicable: 1 // Always applicable
        });

        setTabsData(tabs.filter((tab) => tab.applicable)); // Only include applicable tabs
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [initiativesID]);

  const updateTabsToShow = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setTabsToShow(10);
    } else if (width >= 992) {
      setTabsToShow(8);
    } else {
      setTabsToShow(4);
    }
  };

  useEffect(() => {
    updateTabsToShow();
    window.addEventListener("resize", updateTabsToShow);
    return () => {
      window.removeEventListener("resize", updateTabsToShow);
    };
  }, []);

  useEffect(() => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    setUserID(userdata?.employeeId);
  }, []);

  useEffect(() => {
    if (userID) {
      const fetchData = async () => {
        console.log("GetInitiativeDocumentList", activeTab);
        try {
          if (activeTab == "basic-details") {
            setInitiativeDetail(null);
            const detail = await GetInitiativeDetail(initiativesID, userID);
            setInitiativeDetail(detail);
            {/* Set initiativesData by Gauri for manage workflow stages on 24 Mar 2025 */}
            setInitiativesData(initiatives)
          }
          if (activeTab == "roi") {
            const roi = await GetInitiativeROIList(initiativesID);
            setInitiativeROI(roi);
          }
          if (activeTab == "stage") {
            const stage = await GetInitiativeStageList(initiativesID);
            setInitiativeStage(stage);
          }
          if (activeTab == "document-upload") {
            console.log("GetInitiativeDocumentList");
            const document = await GetInitiativeDocumentList(initiativesID, userID);
            setInitiativeDocument(document);
          }
          if (activeTab == "timelines") {
            const timeline = await GetInitiativeTimeline(initiativesID, userID);
            setInitiativeTimeline(timeline);
          }
          if (activeTab == "resources") {
            const resource = await GetInitiativeResourceList(initiativesID);
            setInitiativeResource(resource);
          }
          if (activeTab == "costs") {
            const cost = await GetInitiativeCostList(initiativesID);
            setInitiativeCost(cost);
          }
          if (activeTab == "work-order details") {
            const workOrder = await GetInitiativeWorkOrderList(initiativesID);
            setInitiativeWorkOrder(workOrder);
          }
          if (activeTab == "funding") {
            const fund = await GetInitiativeFundList(initiativesID);
            setInitiativeFund(fund);
          }
          if (activeTab == "discussion-thread") {
            const discussion = await GetInitiativeDiscussion(initiativesID);
            setInitiativeDiscussion(discussion);
          }
          if (activeTab == "initiative-history") {
            const history = await GetInitiativeHistory(initiativesID, 1);
            setInitiativeHistory(history);
          }
          if (activeTab == "basic-details") {
            const linkAccess = await GetInitiativeLinkAccess(initiativesID, userID);
            setInitiativeLinkAccess(linkAccess);
          }
          if (activeTab == "workflows") {
            const workFlow = await GetInitiativeWorkFlow(initiativesID);
            setInitiativeWorkFlow(workFlow);
          }
          if (activeTab == "risks") {
            const risks = await GetInitiativeRisks(initiativesID, userID);
            setInitiativeRisks(risks);
          }
          if (activeTab == "risks") {
            const risksheat = await GetInitiativeRisksHeat(initiativesID, userID);
            setInitiativeRisksHeat(risksheat);
          }
          if (activeTab == "risks") {
            const actioItems = await GetInitiativeActioItems(initiativesID, userID);
            setInitiativeActioItems(actioItems);
          }
          if (activeTab == "basic-details") {
            const PrioritizationCheckList = await GetPrioritizationCheckList(initiativesID, userID);
            setPrioritizationCheckList(PrioritizationCheckList);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [userID, initiativesID, activeTab, refresh]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleTabClick = (tabId, subTagID) => {
    setActiveTab1(subTagID);
    setActiveTab(tabId);
  };
  useEffect(() => {
    if (userID && activeTab1) {
      const fetchSubTabLinkAccess = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetSubTabLinkAccess?IdeaID=${initiativesID}&UserID=${userID}&SubTagId=${activeTab1}`,
            {
              method: "GET",
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
              }
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("SubTabLinkAccess Data:", data.data.initiativeSubTagLinkAccess);
          setAcc(data.data.initiativeSubTagLinkAccess);
          // You can set the data to state if needed
          // setSomeState(data);
        } catch (error) {
          console.error("Error fetching SubTabLinkAccess data:", error);
        }
      };

      fetchSubTabLinkAccess();
    }
  }, [activeTab1, initiativesID, userID]);

  const renderTabs = () => {
    return (
      <>
        {tabsData.map((tab) => (
          <Nav.Item key={tab.id}>
            <Nav.Link href={`#${tab.id}`} onClick={() => handleTabClick(tab.id, tab.subTagID)}>
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        ))}
        <Nav.Item>
          <Nav.Link onClick={handleGoBack} className="download-file-button">
            Go Back
          </Nav.Link>
        </Nav.Item>
      </>
    );
  };

  const handleFieldChange = (value, stateKey) => {
    console.log("Selected Date22:", value, stateKey);
    setFormDataState({ ...formDataState, [stateKey]: value });
  };
  console.log("initiativeLinkAccess", initiativeLinkAccess);
  const renderContent = () => {
    console.log("Risks", activeTab);
    switch (activeTab) {
      case "basic-details":
        return (
          <div className="container-fluid mt-3">
            {/* Passed initiativesData by Gauri for manage workflow stages on 24 Mar 2025 */}
            <BasicDetailEdit
              initiativesID={initiativesID}
              initiativeLinkAccess={initiativeLinkAccess}
              initiativeDetail={initiativeDetail}
              formData={formData}
              buttonData={buttonData}
              handleFieldChange={handleFieldChange}
              handleGoBack={handleGoBack}
              image={image}
              setRefresh1={setRefresh}
              refresh={refresh}
              prioritizationCheckList={prioritizationCheckList}
              initiativeActioItems={initiativeActioItems}
              initiativesData={initiativesData}
            />
          </div>
        );
      case "resources":
        return (
          <div className="container-fluid mt-3">
            <ResourceEdit
              initiativeResource={initiativeResource}
              initiativesID={initiativesID}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "work-order details":
        return (
          <div className="container-fluid mt-3">
            <WorkOrderTab
              initiativeWorkOrder={initiativeWorkOrder}
              initiativesID={initiativesID}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "costs":
        return (
          <div className="container-fluid mt-3">
            <CostTabContent
              costData={initiativeCost}
              initiativesID={initiativesID}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "funding":
        return (
          <div className="container-fluid mt-3">
            <FundingTab
              fundData={initiativeFund}
              initiativesID={initiativesID}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "roi":
        return (
          <div className="container-fluid mt-3">
            <ROIComponent
              initiativeROI={initiativeROI}
              initiativesID={initiativesID}
              // Added by Gauri to pass Initiative details to ROI on 07 Mar 2025
              initiativeDetail={initiativeDetail}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "stage":
        return (
          <div className="container-fluid mt-3">
            <StageComponent
              stageData={initiativeStage}
              setRefresh1={setRefresh}
              refresh={refresh}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "timelines":
        return (
          <div className="container-fluid mt-3">
            <TimelinesComponent
              initiativeTimeline={initiativeTimeline}
              initiativesID={initiativesID}
              setRefresh1={setRefresh}
              refresh={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "document-upload":
        return (
          <div className="container-fluid mt-3">
            <DocumentsComponent
              initiativeDocument={initiativeDocument}
              initiativesID={initiativesID}
              setRefresh={setRefresh}
              show={show}
              refresh={refresh}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "workflows":
        return (
          <div className="container-fluid mt-3">
            <WorkflowTabs initiativeWorkFlow={initiativeWorkFlow} acc={acc} />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "discussion-thread":
        return (
          <div className="container-fluid mt-3">
            <Discussion initiativeId={initiativesID} acc={acc} />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "initiative-history":
        return (
          <div className="container-fluid mt-3">
            <InitiativeHistoryTab initiativeId={initiativesID} acc={acc} />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      case "risks":
        return (
          <div className="container-fluid mt-3">
            <MoreActions
              initiativesID={initiativesID}
              initiativeActioItems={initiativeActioItems}
              initiativeRisks={initiativeRisks}
              initiativeRisksHeat={initiativeRisksHeat}
              // Passed initiativeDetail to get requestStageId by Gauri on 12 Mar 2025
              initiativeDetail={initiativeDetail}
              setRefetch={setRefresh}
              refetch={refresh}
              show={show}
              acc={acc}
            />
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}></Stack>
          </div>
        );
      default:
        return (
          <div>
            <h3>{tabData.find((tab) => tab.id === activeTab)?.title}</h3>
            <p>
              Content related to {tabData.find((tab) => tab.id === activeTab)?.title.toLowerCase()}{" "}
              goes here.
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <div id="IMInfopgtabs" className="IM_tabs bglightblue">
        <Nav variant="tabs" defaultActiveKey={`#${tabData[0]?.id}`}>
          {renderTabs()}
        </Nav>
      </div>
      {renderContent()}
    </div>
  );
};

export default EditPage;
