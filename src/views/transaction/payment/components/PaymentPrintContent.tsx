import {
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IParams } from "../../../../interfaces/params";
import { IAccountHolder } from "../../../../interfaces/purchaseOrder";
import { getAllMasterLedger } from "../../../../services/masterLedgerAPI";
import { getPayment } from "../../../../services/payment";
import ViewHeader from "../../../transmis/components/viewHeader";

const PaymentPrintContent = () => {
  const { id }: IParams = useParams();
  const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [voucherData, setVoucherData] = useState<any>({});
  const getVoucherData = async () => {
    const response = await getPayment(parseInt(id));
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

  useEffect(() => {
    getAccountHolderData();
    getVoucherData();
    setISAllDataLoaded(true);
  }, [id]);

  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
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

  if (!isAllDataLoaded) {
    return <LinearProgress />;
  }
  return (
    <>
      <Box
        sx={{
          mt: 1,
          p: 1,
          width: "93%",
        }}
      >
        <ViewHeader name="Payment Voucher" />
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
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Payment Voucher
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
                Ref No. :
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
          <Grid md={12} xs={12} mt={2}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3} width="100%">
                      <Typography>
                        Amount : &nbsp; {voucherData.drTotal}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} width="100%" align="center">
                      <Typography>
                        Method of Payment : &nbsp;{" "}
                        {getAccountName(voucherData.SourceAccountTypeId)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} width="100%">
                      <Typography>
                        Cash/Bank/Cheque : &nbsp;
                        {getAccountName(voucherData.SourceAccountTypeId)}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={3} width="100%">
                      <Typography display="inline">
                        To Whom:&nbsp;
                        {voucherData.AccountTransactionValues &&
                          voucherData.AccountTransactionValues.map(
                            (value: any, index: number) => {
                              return (
                                <>
                                  <Typography display="inline">
                                    {getAccountName(value.AccountId)}
                                  </Typography>
                                  <Typography display="inline">
                                    {index !==
                                      voucherData.AccountTransactionValues
                                        .length -
                                        1 && ","}
                                  </Typography>
                                </>
                              );
                            }
                          )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography>Being : &nbsp;</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography display="inline">
                        Payee : &nbsp;
                        {voucherData.AccountTransactionValues &&
                          voucherData.AccountTransactionValues.map(
                            (value: any, index: number) => {
                              return (
                                <>
                                  <Typography display="inline">
                                    {getAccountName(value.AccountId)}
                                  </Typography>
                                  <Typography display="inline">
                                    {index !==
                                      voucherData.AccountTransactionValues
                                        .length -
                                        1 && ","}
                                  </Typography>
                                </>
                              );
                            }
                          )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Approved By : &nbsp;</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>Paid By : &nbsp;</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>Signature : &nbsp;</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PaymentPrintContent;
