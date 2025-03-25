import React, { useEffect, useRef, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { Col, Row } from 'react-bootstrap';
import Legends1, { Legends2, Legends3, Legends4 } from './Legends';
import { Bar } from 'react-chartjs-2';
// import BarClickDrawer from './BarClickDrawer';

const InitiativeChart = ({ Graph1, Graph2, Graph3, Graph4 }) => {
  console.log("InitiativeChartsWWW", Graph1, Graph2, Graph3, Graph4);

  const [selectedData, setSelectedData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleDrawerOpen = (data) => {
    setSelectedData(data);
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }

  const handleBarClick = (id) => {
    console.log('Bar clicked with ID:', id);
    setSelectedId(id);
  };

  // Register all necessary components, including BarController
  Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

  const convertedBarData = {
    // labels: Graph1?.lstiniPlannedConverted?.map((item) => item.initiative),
    labels: ["Converted", "Forecast"],
    datasets: [
      {
        label: "Forecast Count",
        data: Graph1?.lstiniPlannedConverted?.map((item) => item.initiative_Count),
        backgroundColor: ["#ff9488", "#97f792"]
      }
    ]
  };

  const convertedOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow custom height

    plugins: {
      title: {
        display: true,
        text: 'Initiatives Planned Vs Converted',
      },
      legend: {
        display: false, // Hide legends
      },
    }
  };

  const adhocBarData = {
    // labels: Graph2?.lstiniPlannedAdhov?.map((item) => item.initiative),
    labels: ["Forecast", "Ad hoc"],
    datasets: [
      {
        // label: "Forecast Count",
        data: Graph2?.lstiniPlannedAdhov?.map((item) => item.initiative_Count),
        // backgroundColor: "#c0e9e9"
        backgroundColor: ["#ff9488", "#97f792"]
      }
    ]
  };
  
  const adhocOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow custom height

    plugins: {
      title: {
        display: true,
        text: 'Initiatives Planned Vs Adhoc',
      },
      legend: {
        display: false, // Hide legends
      },
    }
  };

  const iniCategoryData = {
    labels: Graph3?.lstiniInitiCategory?.map((item) => item.initiativeType),
    datasets: [
      {
        label: "Count",
        data: Graph3?.lstiniInitiCategory?.map((item) => item.initiativeType_ForCount),
        backgroundColor: "#8fadf3"
      }
    ]
  };
  
  const iniCategoryOptions = {
    indexAxis: "y", // This makes the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow custom height

    plugins: {
      title: {
        display: true,
        text: 'Initiative Count By Initiative Category',
      },
      legend: {
        position: "bottom", 
      },
    }
  };

  const NOI_Data = {
    labels: Graph4?.lstiniNatureOfIniVM?.map((item) => item.natureofDemand),
    datasets: [
      {
        label: "Count",
        data: Graph4?.lstiniNatureOfIniVM?.map((item) => item.natureofDemandCount),
        backgroundColor: "#97f792"
      }
    ]
  };

  const NOI_Options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow custom height

    plugins: {
      title: {
        display: true,
        text: 'Initiative Count By Nature of Initiative',
      },
      legend: {
        position: "bottom", 
      },
    }
  };

  // Legends data for each chart
  const legendsData1 = [
    { label: "Converted To", color: "#ff9488" }, // Green
    { label: "Forecast Count", color: "#97f792" }, // Yellow
  ];
  const legendsData2 = [
    { label: "Forecast Count", color: "#ff9488" }, // Green
    { label: "Adhoc Initiative", color: "#97f792" }, // Yellow
  ];

  return (
    <>
      <Row className='mt-5'>
        {/* Chart 1 */}
        <Col sm={6} className='mb-3 px-2'>
          <div className='project-bar'>
            <Bar data={convertedBarData} options={convertedOptions} />
            <Legends1 legends={legendsData1} />

            {/* { drawerOpen &&
              <BarClickDrawer open={handleDrawerOpen} onClose={handleDrawerClose} data={selectedData} selectedId={selectedId} />
            } */}
          </div>
        </Col>

        {/* Chart 2 */}
        <Col sm={6} className='mb-3 px-2'>
          <div className='project-bar'>
            <Bar data={adhocBarData} options={adhocOptions} />
            <Legends2 legends={legendsData2} />
          </div>
        </Col>
        
        {/* Chart 3 */}
        <Col sm={6} className='mb-3 px-2'>
          <div className='project-bar'>
            <Bar data={iniCategoryData} options={iniCategoryOptions} />
            <div className='mt-2 mb-2'>
              {/* <Legends3 legends={legendsData3} /> */}
            </div>
          </div>
        </Col>

        {/* Chart 4 */}
        <Col sm={6} className='mb-3 px-2'>
          <div className='project-bar'>
            <Bar data={NOI_Data} options={NOI_Options} />
            {/* <Legends4 legends={legendsData4} /> */}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InitiativeChart;
