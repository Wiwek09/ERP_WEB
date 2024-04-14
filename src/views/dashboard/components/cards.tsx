import { Avatar, Card, CardContent, Typography } from "@mui/material";

interface IProps {
  name: string;
  value: any;
  src?: string;
  bgcolor: string;
}

const DashboardCards = ({ name, value, src, bgcolor }: IProps) => {
  return (
    <>
      <Card
        variant="elevation"
        sx={{
          width: "96%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          m: 1,
          bgcolor: "primary.dashboard",
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Avatar
            sx={{
              bgcolor: "transparent",
              width: "65px",
              height: "auto",
            }}
            variant="square"
            src={src}
          />
        </CardContent>
        <CardContent>
          <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {name === "Customers" ? value : `Rs. ${Math.abs(value)}`}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardCards;
