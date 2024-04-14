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
import { IParams } from "../../../../interfaces/params";
import { ISelectType } from "../../../../interfaces/autoComplete";
import {
  getAllAccountHolder,
  getAllPurchase,
  getPurchaseOrder,
} from "../../../../services/purchaseOrderApi";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import { LinearProgress } from "@mui/material";
import ViewHeader from "../../components/viewHeader";

const PrintPurchaseOrder = () => {
  const [allData, setAllData] = useState<any>({});
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
  const { id }: IParams = useParams();
  const history = useHistory();
  const loadData = async () => {
    try {
      const res = await getPurchaseOrder(id);
      setAllData(res);
    } catch (error) {
      history.push("/purchase-order");
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

    getAccountHolderData();
    getProducts();
    loadData();
    setISAllDataLoaded(true);
  }, [id]);

  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
  };

  const total = allData?.PurchaseOrderDetails?.reduce((a: any, b: any) => {
    return a + b.TotalAmount;
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
          p: 1,
          width: "85%",
        }}
      >
        <ViewHeader name="Purchase Order" />
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
                Purchase Order No. :
              </Typography>
              <Typography variant="body2">
                &nbsp;{allData?.PurchaseOrderNumber}
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
                Purchase order date :
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
          }}
        >
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow component="th">
                  <TableCell align="left">S.N</TableCell>
                  <TableCell colSpan={2} align="center">
                    Product/Service
                  </TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Unit Price(Rs.)</TableCell>
                  <TableCell align="right">Total(Rs.)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allData?.PurchaseOrderDetails?.map((elm: any, i: number) => {
                  const productValue = products?.find(
                    (obj) => obj.value === elm.ItemId
                  );
                  return (
                    <>
                      <TableRow component="th">
                        <TableCell align="left">{i + 1}</TableCell>
                        <TableCell colSpan={2} align="center">
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
                    colSpan={5}
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    Total
                  </TableCell>
                  <TableCell align="right">{total?.toFixed(2)}</TableCell>
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

export default PrintPurchaseOrder;
