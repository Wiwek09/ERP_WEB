import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import server from "../../../server/server";
import { useAppSelector } from "../../../app/hooks";

const YearlySalesReport = () => {
  const [month, setMonth] = useState<any[]>([]);
  const financialYear = useAppSelector((state) => state.financialYear.Name);
  
  let yearData: any = [];

  month.forEach((elm) => {
    if (elm.Year !== "") {
      yearData.push(elm.Year);
    }
  });
  let amountData: any = [];
  month.forEach((elm) => {
    if (elm.Year !== "") {
      amountData.push(elm.Amount);
    }
  });

  useEffect(() => {
    server.get(`/api/DashBoardAPI/?FinancialYear=`+financialYear).then((res) => {
      setMonth(res.data.YearSales);
    });
  }, []);
  let LastValue: any = [];
  let LastValue2: any = [];

  const allSUm = amountData?.reduce((a: number, b: number) => a + b, 0);

  amountData.forEach((elm: any) => {
    LastValue.push((elm / allSUm) * 100);
  });

  LastValue.forEach((elm: any) => {
    LastValue2.push(Math.abs(elm.toFixed(2)));
  });

  const state: any = {
    labels: yearData,
    datasets: [
      {
        label: "Monthly Sales Report",
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(90, 90, 90)",
          "rgb(226,135,67)",
          "rgb(51, 255, 87)",
          "rgb(255, 87, 51)",
        ],
        hoverBorderWidth: 5,
        borderWidth: 3,
        data: LastValue2,
      },
    ],
  };

  return (
    <>
      <Paper
        sx={{
          height: "99%",
          width: { md: "80%", xs: "85%" },
          p: 1,
          m: 1,
          bgcolor: "primary.dashboard",
          mx: "auto",
        }}
      >
        <Typography textAlign="center" sx={{ mb: 2 }}>
          Yearly Sales Report (%)
        </Typography>
        <Doughnut
          data={state}
          options={{
            plugins: {
              title: {
                display: false,
                text: "Yearly Sales Report (%)",
              },
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      </Paper>
    </>
  );
};

export default YearlySalesReport;
