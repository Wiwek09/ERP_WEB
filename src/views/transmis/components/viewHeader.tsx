import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAppSelector } from "../../../app/hooks";
import { selectCompany } from "../../../features/companySlice";
interface IProps {
  name: string;
}

const ViewHeader = ({ name }: IProps) => {
  const company = useAppSelector(selectCompany);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          alt="DCUBE Logo"
          src={
            company?.PhotoIdentity
              ? "data:image/png;base64," + company.PhotoIdentity
              : "/Assets/logo.png"
          }
          sx={{ width: 60, height: 60 }}
        />
      </div>
      {company && company.PrinterType === "POS" ? (
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#000",
        fontFamily:company?.BillHeaderFront,
      }}
    >
      {company && company.BillHeaderFront == null ? (
        <p
          style={{
            fontWeight: "bold",
            fontSize: +company?.BillFrontWeightHeader,
            textAlign: "center",
          }}
        >
          {company.NameEnglish}
        </p>
      ) : (
        <p
          style={{
            fontWeight: "bold",
            fontSize: +company?.BillFrontWeightHeader,
            textAlign: "center",
          }}
        >
          {company.NameEnglish}
        </p>
      )}
      <p style={{ fontSize: 14 }}>
        {company.Address}, {company.Phone}
      </p>
      {company.VATRate === 0 ? (
        <p style={{ fontSize: 14 }}>PAN No: {company.Pan_Vat}</p>
      ) : (
        <p style={{ fontSize: 14 }}>VAT No: {company.Pan_Vat}</p>
      )}
      <p style={{ fontSize: 14 }}>
      Sales Return
      </p>
    </div>

      ) : (    
        <div>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h5">{company.NameEnglish}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        
        {
          company.VATRate === 0
            ?
            <Typography variant="body2">
              {company.Address}, {company.Phone}, PAN No: {company.Pan_Vat}
            </Typography>
            :
            <Typography variant="body2">
              {company.Address}, {company.Phone}, VAT No: {company.Pan_Vat}
            </Typography>
        }
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          p: 1,
        }}
      >
        <Typography variant="body1"> {name}</Typography>
      </Box>          
        </div>
      )}      
    </>
  );
};

export default ViewHeader;
