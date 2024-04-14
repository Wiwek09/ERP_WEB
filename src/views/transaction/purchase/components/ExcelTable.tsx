import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { IGetAllPurchase, IProduct } from "../../../../interfaces/purchase";
import { IDate } from "../../invoice/interfaces";

interface IProps {
  purchaseData: IGetAllPurchase[];
  productData: IProduct[];
  date: IDate;
}

const ExcelTable = ({ purchaseData, productData, date }: IProps) => {
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);

  const [total, setTotal] = useState({ debit: 0, credit: 0 });

  useEffect(() => {
    let debit = 0;
    let credit = 0;

    purchaseData.forEach((element) => {
      element.AccountTransactionValues.forEach((account) => {
        debit += account.DebitAmount;
        credit += account.CreditAmount;
      });
    });

    setTotal({ debit: debit, credit: credit });
  }, [purchaseData]);

  const getProductName = (id: number): string => {
    const productDetails = productData.find((data) => data.Id === id);
    return productDetails ? productDetails.Name : "";
  };

  return (
    <>
      <Paper id="printDownloadPDF" sx={{ mx: 2, display: "none" }}>
        <TableContainer>
          <Table stickyHeader id="downloadExcel">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={7}
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
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Purchase
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {`${date.StartDate} - ${date.EndDate}`}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell style={{ minWidth: "250px" }}>Particular</TableCell>
                <TableCell>Voucher Type</TableCell>
                <TableCell>Voucher No</TableCell>
                <TableCell sx={{ textAlign: "end" }}>Debit (RS.)</TableCell>
                <TableCell sx={{ textAlign: "end" }}>Credit (Rs.)</TableCell>
                <TableCell>File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseData.map((data, index) => {
                return (
                  <>
                    <TableRow key={`main_row${index}`}>
                      <TableCell>{data.VDate}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{data.VType}</TableCell>
                      <TableCell>{data.VoucherNo}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>No file</TableCell>
                    </TableRow>
                    {data.AccountTransactionValues.map(
                      (accountData, accountIndex) => {
                        if (
                          accountData.DebitAmount === 0 &&
                          accountData.CreditAmount === 0
                        ) {
                          return;
                        }
                        return (
                          <TableRow key={`account${accountIndex}`}>
                            <TableCell>{accountIndex + 1}</TableCell>
                            <TableCell colSpan={3}>
                              {accountData.Name}
                            </TableCell>
                            <TableCell sx={{ textAlign: "end" }}>
                              {accountData.DebitAmount > 0
                                ? accountData.DebitAmount.toFixed(2)
                                : ""}
                            </TableCell>
                            <TableCell sx={{ textAlign: "end" }}>
                              {accountData.CreditAmount > 0
                                ? accountData.CreditAmount.toFixed(2)
                                : ""}
                            </TableCell>
                            <TableCell colSpan={1}></TableCell>
                          </TableRow>
                        );
                      }
                    )}

                    {data.PurchaseDetails.length > 0 ? (
                      <TableRow>
                        <TableCell>S.N.</TableCell>
                        <TableCell>Item name</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Discount</TableCell>
                        <TableCell sx={{ textAlign: "end" }}>Rate</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}

                    {data.PurchaseDetails.map((purchaseItem, itemIndex) => {
                      return (
                        <TableRow key={`purchaseItem${itemIndex}`}>
                          <TableCell>{itemIndex + 1}</TableCell>
                          <TableCell>
                            {getProductName(purchaseItem.InventoryItemId)}
                          </TableCell>
                          <TableCell>{purchaseItem.Quantity}</TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {purchaseItem.PurchaseRate.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {purchaseItem.Discount.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {purchaseItem.PurchaseAmount.toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })}
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
                <TableCell sx={{ fontWeight: "bold", textAlign: "end" }}>
                  {total.debit.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "end" }}>
                  {total.credit.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ExcelTable;
