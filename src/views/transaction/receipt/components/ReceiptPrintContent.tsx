import {
  Grid,
  Paper,
  Table,
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
import { getReceipt, getTotalDueAmount } from "../../../../services/receipt";
import ViewHeader from "../../../transmis/components/viewHeader";
import { LinearProgress } from "@mui/material";
import { getAllMasterLedger } from "../../../../services/masterLedgerAPI";
import { getDecimalInWord } from "../../../../services/decimalToWordApi";


const ReceiptPrintContent = () => {
  const { id }: IParams = useParams();
  const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [voucherData, setVoucherData] = useState<any>({});
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [decimalInWords,setDecimalInWords] = useState<string | any>('');

  const getVoucherData = async () => {
    const response = await getReceipt(parseInt(id));
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
  
  const getTotalDueAmountData = async () => {
    const response = await getTotalDueAmount(voucherData.AccountTransactionValues && voucherData.AccountTransactionValues[0].AccountId, parseInt(id));
    setTotalDueAmount(response);
  }

  useEffect(() => {
    getAccountHolderData();
    getVoucherData();
    getTotalDueAmountData();
    
  }, [id,voucherData]);

  const decimalToWord = async(value:number) => {
    const valueInWord=await getDecimalInWord(value);
    setDecimalInWords(valueInWord);
    setISAllDataLoaded(true);
  }

  useEffect(() => {
    decimalToWord(voucherData.crTotal);
  },[decimalInWords,voucherData])

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
          width: "100%",
        }}
      >
        <ViewHeader name="Receipt Voucher" />
        <Box
          sx={{
            mt: 3,
            px: 5,
            display: "flex",
            justifyContent: "space-between",
            width: "95%",
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
                Receipt :
              </Typography>
              <Typography variant="body2">
                &nbsp; {voucherData.Name && getBillNo(voucherData.Name)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Received From:
              </Typography>

              {voucherData.AccountTransactionValues &&
                voucherData.AccountTransactionValues.map(
                  (value: any, index: number) => {
                    return (
                      <Box sx={{display:'flex', flexWrap:'wrap'}}>
                        <Typography variant="body2">
                          &nbsp;{getAccountName(value.AccountId)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        &nbsp;of Rs.&nbsp;{voucherData.crTotal}
                        </Typography>
                      </Box>                 
                    );
                  }
                )}
              
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Amount In Word:&nbsp;
              </Typography>
              <Typography variant="body2">
                 {decimalInWords}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Notes :
              </Typography>
              <Typography variant="body2">
                &nbsp;{voucherData.Description}
              </Typography>
            </Box>
          </Box>

        
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", width:'3rem' }}>
                Date :
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {voucherData.AccountTransactionValues &&
                  voucherData.AccountTransactionValues[0].NVDate}
              </Typography>
            </Box>
         
        </Box>
        <Box
          sx={{
            mt: 1,
            p: 3,
            width: "95%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid md={12} xs={12} mt={2}>
            <TableContainer component={Paper}>
              <Table sx={{bgcolor:'primary.tableContent'}}>
                <TableHead>
                  <TableRow>
                    <TableCell width="65%">Total Due amount</TableCell>
                    <TableCell width="35%" align="right">{Math.abs(totalDueAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width="65%"> Amount Received</TableCell>
                    <TableCell width="35%" align="right">{voucherData.crTotal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell width="65%">Balance Due</TableCell>
                    <TableCell width="35%" align="right">{totalDueAmount && (Math.abs(totalDueAmount)-voucherData.crTotal)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Box>

        <Box width="95%" display="flex" flexDirection="column" mt={5}>
          <Typography textAlign="center" display="block">
            ______________________________________
          </Typography>
          <Typography display="block" textAlign="center">
            Signed By
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ReceiptPrintContent;
