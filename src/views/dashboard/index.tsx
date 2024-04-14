import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import server from "../../server/server";
import DashboardCards from "./components/cards";
import MonthlySalesReport from "./components/monthlySalesReport";
import DailySalesReport from "./components/tysmMonthlyReport";
import SalesReportTable from "./components/tysmSalesReport";
import YearlySalesReport from "./components/yearlySalesReport";
const Dashboard = () => {
  const [allData, setAllData] = useState<any>({});
  const financialYear = useAppSelector((state) => state.financialYear.Name);
  useEffect(() => {
    
    server.get(`/api/DashBoardAPI/?FinancialYear=`+financialYear).then((res) => {
      setAllData(res.data);
    });
  }, []);

  const getLocalItem = () => {
    window.onbeforeunload = function () {
      var msg = "Are you sure?";
      return msg;
    }

    let data = localStorage.getItem('myPageDataArr');
    if (data === server+"/purchase") {
      window.close();
    }
  }
  useEffect(() => {
    window.opener = null;
    window.open('', '_self');
    window.onunload = function() {
      localStorage.myPageDataArr = undefined;
    };
    getLocalItem();
  })

  return (
    <>
      <Box sx={{ width: "100%", height: "80%" }}>
        <Box sx={{ marginBottom: "2px" }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "start", paddingLeft: 2, opacity: "0.8" }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "right", paddingRight: 2, opacity: "0.8", marginTop: -3 }}
          >
            Company Overview
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid md={12} xs={12} sx={{ textAlign: "start", paddingLeft: 2, mb: 1 }}>
            <SalesReportTable/>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid xs={12} sm={5} md={3}>
            <DashboardCards
              value={allData.Customer}
              name="Customers"
              src="/Assets/userss.png"
              bgcolor="#007bff"
            />
          </Grid>
          <Grid xs={12} sm={5} md={3}>
            <DashboardCards
              value={allData.SaleMonth}
              name="Monthly Sales"
              src="/Assets/salesss.png"
              bgcolor="#66bb6a"
            />
          </Grid>
          <Grid xs={12} sm={5} md={3}>
            <DashboardCards
              value={allData.SaleYear}
              name="Yearly Sales"
              src="/Assets/salesYear.png"
              bgcolor=" #ef5350"
            />
          </Grid>
          <Grid xs={12} sm={5} md={3}>
            <DashboardCards
              value={allData.PurchaseYear}
              name="Year Purchase"
              src="/Assets/purchases.png"
              bgcolor=" #26c6da"
            />
          </Grid>
        </Grid>
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: 5,
          }}
        >
          <MonthlySalesReport />
          <YearlySalesReport />
        </Box> */}
        <Box sx={{ marginBottom: "2px", mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ textAlign: "start", paddingLeft: 2, mb: 1, opacity: "0.8" }}
          >
            Sales Reports
          </Typography>
        </Box>
        <Grid container>
          <Grid md={12} xs={12} sx={{marginBottom: 2}}>
            <DailySalesReport/>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid md={8} xs={12}>
            <MonthlySalesReport />
          </Grid>
          <Grid md={4} xs={12} sx={{ mt: { xs: 2, md: 0 } }}>
            <YearlySalesReport />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Dashboard;
