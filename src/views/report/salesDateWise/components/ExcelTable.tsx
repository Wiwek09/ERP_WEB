import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
import { IDate, ICommonObj } from "../../../transaction/invoice/interfaces";
import { IItemsDateWise } from "../../../../interfaces/salesDateWise";
import { useEffect, useState } from "react";
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

const getLedgerName = (id: number, ledgerData: ICommonObj[]): string => {
    for (let index = 0; index < ledgerData.length; index++) {
      const element = ledgerData[index];
      if (element.id === id) {
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

const ExcelTable = ({
    itemsDateWiseData,
    productData,
    ledgerData,
    date,
}:IProps) => {
    const companyName = useAppSelector((state) => state.company.data.NameEnglish);

    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
      let total=0;
    
      itemsDateWiseData.map((data) => {
        total += (data.Qty*data.Price);
      })

      setGrandTotal(total);
    }, [itemsDateWiseData]);
    

    return (
        <>
        <Paper sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer>
          <Table sx={{ minWidth: 800 }} stickyHeader id="downloadExcel">
            <TableHead>
                <TableRow>
                    <TableCell
                        colSpan={5}
                        sx={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        }}
                        className={"bold, text-center"}
                    >
                        {companyName}
                    </TableCell>
                </TableRow>

              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Item Wise Sales
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {`${date.StartDate} - ${date.EndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                {tableHeader.map((data, index) => (
                  <TableCell key={index}>{data}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {itemsDateWiseData.map((data, index) => {
                return (
                  <>
                    <TableRow key={index}>
                      <TableCell>
                        {getLedgerName(data.CustomerId, ledgerData)}
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

export default ExcelTable;
