import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
interface IProps {
  name: string;
  copy: number | undefined;
}

const ViewHeaderInvoice = ({ name, copy }: IProps) => {
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
        fontFamily:
          "'Lucida Console', 'Lucida Sans Typewriter', monaco, 'Bitstream Vera Sans Mono', monospace",
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

      {copy === 0 ? (
        <p style={{ fontSize: 14, fontWeight: "bold" }}>{name}</p>
      ) : copy === 1 ? (
        <p style={{ fontSize: 14, fontWeight: "bold" }}>Tax {name}</p>
      ) : (
        <p style={{ fontSize: 14, fontWeight: "bold" }}>{name}</p>
      )}
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
{company && company.BillFrontSizeHeader == 0 ? (
  <Typography sx={{ fontWeight: "bold", fontSize: 32}}>{company.NameEnglish}</Typography>
      ) : (
        <Typography  sx={{ fontWeight: "bold", fontSize: company.BillFrontSizeHeader}}>{company.NameEnglish}</Typography>
      )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h6">
          {company.Address}, Phone:  {company.Phone}
        </Typography>
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
            <Typography variant="h6">
              PAN No: {company.Pan_Vat}
            </Typography>
            :
            <Typography variant="h6">
              VAT No: {company.Pan_Vat}
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
        {copy === 0
          ?
          <Typography variant="h6">{name}</Typography>
          :
          copy === 1
            ?
            <Typography variant="h6">Tax {name}</Typography>
            :
            <Typography variant="h6">{name}</Typography>
        }
      </Box>
</div>
)}

    </>
  );
};

export default ViewHeaderInvoice;
