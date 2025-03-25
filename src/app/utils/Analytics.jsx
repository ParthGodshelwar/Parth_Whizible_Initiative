import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "../views/dashboard/shared/RowCards";
import StatCards from "../views/dashboard/shared/StatCards";
import Campaigns from "../views/dashboard/shared/Campaigns";
import StatCards2 from "../views/dashboard/shared/StatCards2";
import DoughnutChart from "../views/dashboard/shared/Doughnut";
import UpgradeCard from "../views/dashboard/shared/UpgradeCard";
import TopSellingTable from "../views/dashboard/shared/TopSellingTable";
import InitiativeManagement from "../views/InitiativeManagement/InitiativeManagement";
// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize"
}));
console.log("loading1");
const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

export default function Analytics() {
  const { palette } = useTheme();

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <InitiativeManagement /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
