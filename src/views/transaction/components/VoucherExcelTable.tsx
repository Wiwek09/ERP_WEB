import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { IAllVoucher } from "../../../interfaces/voucher";
import { IDate } from "../invoice/interfaces";
interface IProps {
  data: any[];
  date: IDate;
  name: string;
}
const VoucherExcelTable = ({ data, date, name }: IProps) => {
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  useEffect(() => {
    let drTotal = 0;
    data.forEach((element: any) => {
      drTotal = element.AccountTransactionValues.reduce(
        (pValue: number, current: any) => {
          return pValue + current.DebitAmount;
        },
        drTotal
      );
    });
    setTotalDebit(drTotal);
    let crTotal = 0;
    data.forEach((element: any) => {
      crTotal = element.AccountTransactionValues.reduce(
        (pValue: number, current: any) => {
          return pValue + current.CreditAmount;
        },
        crTotal
      );
    });
    setTotalCredit(crTotal);
  }, [data]);
  return (
    <>
      <Paper sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer>
          <Table id="downloadExcel" aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {companyName}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {`${date.StartDate} - ${date.EndDate}`}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-bold" width="5%" align="center">
                  Date
                </TableCell>
                <TableCell className="text-bold" width="25%" align="left">
                  Particular
                </TableCell>
                <TableCell
                  className="text-bold text-center"
                  width="10%"
                  align="center"
                >
                  Voucher Type
                </TableCell>
                <TableCell
                  className="text-bold text-center"
                  width="10%"
                  align="center"
                >
                  Voucher No.
                </TableCell>
                <TableCell
                  className="text-bold text-right"
                  width="10%"
                  align="center"
                >
                  Debit(Rs.)
                </TableCell>
                <TableCell
                  className="text-bold text-right"
                  width="10%"
                  align="center"
                >
                  Credit(Rs.)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((data: IAllVoucher, index: number) => {
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="center">{data.VDate}</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell className="text-center" align="center">
                          {data.VType}
                        </TableCell>
                        <TableCell className="text-center" align="center">
                          {data.VoucherNo}
                        </TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {data.AccountTransactionValues.map((value, ind) => {
                        return (
                          <>
                            <TableRow id={ind + "val"}>
                              <TableCell align="right"></TableCell>
                              <TableCell colSpan={3} align="left">
                                {value.Name}
                              </TableCell>
                              <TableCell className="text-right" align="right">
                                {value.DebitAmount > 0 &&
                                  value.DebitAmount.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right" align="right">
                                {value.CreditAmount > 0 &&
                                  value.CreditAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </>
                  );
                })}
            </TableBody>
            <TableRow>
              <TableCell
                className="text-center text-bold"
                colSpan={4}
                align="center"
              >
                Total
              </TableCell>
              <TableCell className="text-right text-bold" align="right">
                {totalDebit && totalDebit.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-bold" align="right">
                {totalCredit && totalCredit.toFixed(2)}
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default VoucherExcelTable;
