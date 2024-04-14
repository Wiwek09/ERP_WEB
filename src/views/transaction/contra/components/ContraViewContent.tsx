import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IParams } from "../../../../interfaces/params";
import { IAccountHolder } from "../../../../interfaces/purchaseOrder";
import { getContra } from "../../../../services/contra";
import { getAllMasterLedger } from "../../../../services/masterLedgerAPI";
import ViewHeader from "../../../transmis/components/viewHeader";
import { InitialContraData } from "./initialContraData";

const ContraViewContent = () => {
  const { id }: IParams = useParams();
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [voucherData, setVoucherData] = useState(InitialContraData);
  const getVoucherData = async () => {
    const response = await getContra(parseInt(id));
    if (response) {
      setVoucherData(response);
    }
  };
  const getAccountHolderData = async () => {
    const res: IAccountHolder[] = await getAllMasterLedger();
    setAccountHolder(
      res.map((item) => {
        return { label: item.Name, value: item.Id };
      })
    );
  };

  const getBillNo = (bill: string): string => {
    let billNo = "";

    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  };

  useEffect(() => {
    getVoucherData();
    getAccountHolderData();
  }, [id]);

  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
  };
  return (
    <>
      <Box
        sx={{
          mt: 1,
          p: 1,
          width: "92%",
        }}
      >
        <ViewHeader name="Contra Voucher" />
        <Box
          sx={{
            mt: 3,
            px: 5,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Voucher No:
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {voucherData.Name && getBillNo(voucherData.Name)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Account:
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {getAccountName(voucherData.SourceAccountTypeId)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Date :
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {voucherData.AccountTransactionValues &&
                  voucherData.AccountTransactionValues[0].NVDate}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1,
            p: 3,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">S.N</TableCell>
                  <TableCell align="left">Accounts</TableCell>
                  <TableCell align="right">Debit(Rs.)</TableCell>

                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voucherData &&
                  voucherData.AccountTransactionValues.map((value, index) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell align="left">
                            {getAccountName(value.AccountId)}
                          </TableCell>
                          <TableCell align="right">
                            {value.Debit && value.Debit.toFixed(2)}
                          </TableCell>

                          <TableCell>{value.Description}</TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                <TableRow>
                  <TableCell colSpan={2}>Total:</TableCell>
                  <TableCell align="right">
                    {voucherData.DebitAmount &&
                      voucherData.DebitAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    {" "}
                    <Typography
                      display="inline"
                      variant="body2"
                      sx={{ fontWeight: "bold" }}
                    >
                      Voucher description:
                    </Typography>
                    <Typography display="inline" variant="body2">
                      &nbsp;
                      {voucherData && voucherData.Description}
                    </Typography>{" "}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ContraViewContent;
