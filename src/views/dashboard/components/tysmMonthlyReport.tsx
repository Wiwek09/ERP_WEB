import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getLasMonNepaliDate,
  getNepaliDateOne,
} from "../../../utils/nepaliDate";
import { getAllDayAmount } from "../../../services/accountApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailySalesReport = () => {
  const [datas, setDatas] = useState<any[]>([]);

  let DayName: any = [];
  datas.forEach((elm) => {
    DayName.push(elm.NDate);
  });
  let amountData: any = [];
  datas.forEach((elm) => {
    if (elm.Amount !== 0) {
      amountData.push(elm.Amount);
    }
  });

  useEffect(() => {
    const load = async () => {
      let today = getNepaliDateOne();
      let monDay = getLasMonNepaliDate();
      const res: any = await getAllDayAmount(monDay, today);
      setDatas(res);
    };
    load();
  }, []);

  const data = {
    labels: DayName,
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
        <Typography textAlign="center">Daily Sales Report</Typography>
        <Line data={data} />
      </Paper>
    </>
  );
};

export default DailySalesReport;
