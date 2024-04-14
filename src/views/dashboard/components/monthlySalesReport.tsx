import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import server from "../../../server/server";
import { useAppSelector } from "../../../app/hooks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesReport = () => {
  const [month, setMonth] = useState<any[]>([]);
  let monthData: any = [];
  const financialYear = useAppSelector((state) => state.financialYear.Name);

  month.forEach((elm) => {
    if (elm.Month !== "0") {
      monthData.push(elm.Month);
    }
  });
  let amountData: any = [];
  month.forEach((elm) => {
    if (elm.Month !== "0") {
      amountData.push(elm.Amount);
    }
  });

  useEffect(() => {
    server.get(`/api/DashBoardAPI/?FinancialYear=`+financialYear).then((res) => {
      setMonth(res.data.MonthSales);
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Monthly Sales Report",
      },
    },
  };

  const labels = monthData;
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: amountData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        color: "#000",
      },
    ],
  };

  return (
    <>
      <Paper
        sx={{
          width: "90%",
          height: "99%",
          p: 1,
          m: 1,
          bgcolor: "primary.dashboard",
          mx: "auto",
        }}
      >
        <Typography textAlign="center">Monthly Sales Report</Typography>
        {/* <Doughnut
          data={state}
          width={400}
          height={50}
          options={{
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Monthly Sales Report (%)",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        /> */}

        <Line options={options} data={data} />
      </Paper>
    </>
  );
};

export default MonthlySalesReport;
