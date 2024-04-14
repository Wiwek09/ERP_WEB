import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
} from "@mui/material";
import { IDate, ICommonObj } from "../../../transaction/invoice/interfaces";
import { IItemsDateWise } from "../../../../interfaces/salesDateWise";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useAppSelector } from "../../../../app/hooks";

interface IProps {
    itemsDateWiseData: IItemsDateWise[];
    productData: ICommonObj[];
    ledgerData: ICommonObj[];
    date: IDate;
}

const getFormatedNumber = (num: any): string => {
    let formatedNum = parseFloat(num).toFixed(2);
    return formatedNum;
};

let customerId:number | null = null;

const getLedgerName = (id: number, ledgerData: ICommonObj[]): string => {
    for (let index = 0; index < ledgerData.length; index++) {
      const element = ledgerData[index];
      if (element.id === id) {
        customerId=id;
        return element.name;
      }
    }
    return "Undefined";
};

const getProductName = (id: number, productData: ICommonObj[]): string => {
    for (let index = 0; index < productData.length; index++) {
      const element = productData[index];
      if (element.id === id) {
        return element.name;
      }
    }
    return "";
  };

const tableHeader: string[] = [
"Customer name",
"Item Name",
"Price",
"Qty",
"Total Amount",
];

const SalesDateWiseTable = ({
    itemsDateWiseData,
    productData,
    ledgerData,
    date,
}:IProps) => {
    const companyName = useAppSelector((state) => state.company.data.NameEnglish);

    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
      customerId=null;
      let total=0;
    
      itemsDateWiseData.map((data) => {
        total += (data.Qty*data.Price);
      })

      setGrandTotal(total);
    }, [itemsDateWiseData]);
    

    return (
        <>
        <Paper sx={{ marginTop: 2, backgroundColor:'primary.mainTableHeader' }}>
        <TableContainer>
          <Box sx={{ paddingY: 2 }}>
            <Typography
              sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              {companyName}
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 18 }}>
              Item Wise Sales Report
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 15 }}>
              {`${date.StartDate} - ${date.EndDate}`}
            </Typography>
          </Box>
          <Table sx={{ minWidth: 800 }} stickyHeader>
            <TableHead>
              <TableRow>
                {tableHeader.map((data, index) => (
                  <TableCell
                    sx={{ backgroundColor:'primary.mainTableHeader' }}
                    key={index}
                  >
                    {data}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {itemsDateWiseData.map((data, index) => {
                return (
                  <>
                    <TableRow sx={{ backgroundColor:'primary.mainTableContent' }} key={index}>
                      <TableCell>
                        {
                          (data.CustomerId===customerId)
                          ?''
                          :getLedgerName(data.CustomerId, ledgerData)
                        }
                      </TableCell>
                      <TableCell>
                        {getProductName(data.ItemId, productData)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(data.Price)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>{data.Qty}</TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(data.Qty * data.Price)}
                      </TableCell> 
                    </TableRow>
                  </>
                );
              })}
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ textAlign: "end", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {grandTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      </>
    );
};

export default SalesDateWiseTable;
