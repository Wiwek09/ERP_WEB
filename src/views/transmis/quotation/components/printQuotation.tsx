import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ISelectType } from "../../../../interfaces/autoComplete";
import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";

import { LinearProgress } from "@mui/material";
import ViewHeader from "../../components/viewHeader";
import { getQuotation } from "../../../../services/quotationApi";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
interface IParams {
  viewid: string;
}

const PrintQuotation = () => {
  const [allData, setAllData] = useState<any>({});
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
  const { viewid }: IParams = useParams();
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const history = useHistory();
  const loadData = async () => {
    try {
      const res = await getQuotation(
        FinancialYear.StartDate,
        FinancialYear.EndDate,
        viewid
      );

      setAllData(res);
    } catch (error) {
      // history.push("/quotation");
      alert("hello");
    }
  };

  useEffect(() => {
    const getAccountHolderData = async () => {
      const res: IAccountHolder[] = await getAllAccountHolder();
      setAccountHolder(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };
    const getProducts = async () => {
      const res: IPurchaseMenu[] = await getAllPurchase();
      setProducts(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };

    loadData();
    getAccountHolderData();
    getProducts();
    setISAllDataLoaded(true);
  }, [viewid]);

  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
  };

  const total = allData?.QuotationDetails?.reduce((a: any, b: any) => {
    return a + b.TotalAmount;
  }, 0);
  const discount = allData?.QuotationDetails?.reduce((a: any, b: any) => {
    return a + b.Discount;
  }, 0);

  if (!isAllDataLoaded) {
    return <LinearProgress />;
  }

  return (
    <>
      <Box
        sx={{
          mx: "auto",
          mt: 1,
          width: "90%",
        }}
        id="pdfDownload"
      >
        <ViewHeader name="Quotation" />
        <Box
          sx={{
            mt: 3,
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            width: "85%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Account holder :
              </Typography>
              <Typography variant="body2">
                &nbsp;{getAccountName(allData.AccountId)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Quotation No. :
              </Typography>
              <Typography variant="body2">
                &nbsp;{allData?.QuotationNumber}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Order date :
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {allData.NepaliDate && allData.NepaliDate.substring(0, 10)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Expire date :
              </Typography>
              <Typography variant="body2">
                &nbsp;
                {allData.ExpiredNepaliDate &&
                  allData.ExpiredNepaliDate.substring(0, 10)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mx: "auto",
            mt: 3,
            px: 5,
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow component="th">
                  <TableCell align="left">S.N</TableCell>
                  <TableCell align="center">Product/Service</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Unit Price(Rs.)</TableCell>
                  <TableCell align="right">Total(Rs.)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allData?.QuotationDetails?.map((elm: any, i: number) => {
                  const productValue = products?.find(
                    (obj) => obj.value === elm.ItemId
                  );
                  return (
                    <>
                      <TableRow component="th">
                        <TableCell align="left">{i + 1}</TableCell>
                        <TableCell align="center">
                          {productValue?.label}
                        </TableCell>
                        <TableCell align="center">{elm.Qty}</TableCell>
                        <TableCell align="right">
                          {elm.UnitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {elm.TotalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}

                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    Total
                  </TableCell>
                  <TableCell align="right">{total?.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    Discount
                  </TableCell>
                  <TableCell align="right">{discount?.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    Grand Total
                  </TableCell>
                  <TableCell align="right">{(total - discount)?.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            mt: 3,
            mx: "auto",
            width: "85%",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Message :
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {allData?.MessageStatement}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default PrintQuotation;
