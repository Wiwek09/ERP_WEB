import {
  Button,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { BiLeftArrowCircle } from "react-icons/bi";
import ReactToPrint from "react-to-print";
import { useHistory, useParams } from "react-router";
import { savePDF } from "@progress/kendo-react-pdf";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintPdfInvoice from "./PrintPdfInvoice";
import { IParams } from "../../../../interfaces/params";
import { ILedger, ILedgerCalculation } from "../interfaces";
import { useEffect } from "react";
import {
  getBill,
  getBillReprint,
  getSalesData,
  updateSales,
  getAllLedgerForCalculation,
  getAllCustomers,
  getAllProducts,
} from "../../../../services/invoice";
import { IProduct, ISales } from "../../../../interfaces/invoice";
import { useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import {
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import * as XLSX from "xlsx";
// import { ExcelBtn } from "../../../../utils/buttons";
import { SiMicrosoftexcel } from "react-icons/si";
import { getDecimalInWord } from "../../../../services/decimalToWordApi";

interface IGrandDetailsKey {
  taxable: number;
  nonTaxable: number;
  exerciseDuty: number;
  tax: number;
  discount: number;
  sales: number;
}

interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totlaNonTaxable: number;
  totalDiscount: number;
  totalExerciseDuty: number;
  totalTax: number;
  grandTotal: number;
}

const initialGrandDetails: IGrandDetails = {
  totalAmount: 0,
  totalTaxable: 0,
  totlaNonTaxable: 0,
  totalDiscount: 0,
  totalExerciseDuty: 0,
  totalTax: 0,
  grandTotal: 0,
};

const ViewInvoice = () => {
  const PrintComponent = () => {
    let componentToPDFRef: any = useRef<HTMLDivElement>(null);
    let componentToPrintRef: any = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [salesDetails, setSalesDetails] = useState<ISales>();
    const [ledgers, setLedgers] = useState<ILedger[]>([]);
    const [grandDetails, setGrandDetails] =
      useState<IGrandDetails>(initialGrandDetails);
    const [decimalInWords, setDecimalInWords] = useState<string | any>("");
    const [keys, setKeys] = useState<IGrandDetailsKey>({
      exerciseDuty: 0,
      tax: 0,
      taxable: 0,
      nonTaxable: 0,
      discount: 0,
      sales: 0,
    });

    const { id }: IParams = useParams();
    const company = useAppSelector(selectCompany);
    const [loading, setLoading] = useState(true);

    const setAllKeys = async () => {
      const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();

      const nonTaxableData = ledgerCalculationData.find(
        (data) => data.Name === "Non Taxable Sales"
      );
      const taxableData = ledgerCalculationData.find(
        (data) => data.Name === "Taxable Sales"
      );
      const discountData = ledgerCalculationData.find(
        (data) => data.Name === "Discount"
      );
      const taxData = ledgerCalculationData.find(
        (data) => data.Name === "Vat 13%"
      );
      const exerciseDutyData = ledgerCalculationData.find(
        (data) => data.Name === "Excise Duty"
      );

      const salesData = ledgerCalculationData.find(
        (data) => data.Name === "Sales"
      );

      setKeys({
        nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
        taxable: taxableData ? taxableData.Id : 0,
        discount: discountData ? discountData.Id : 0,
        exerciseDuty: exerciseDutyData ? exerciseDutyData.Id : 0,
        tax: taxData ? taxData.Id : 0,
        sales: salesData ? salesData.Id : 0,
      });
    };

    const setData = async () => {
      try {
        const ledgersData = await getAllCustomers();
        setLedgers(ledgersData);
        const response = await getSalesData(id);
        setSalesDetails(response);
        const productsData: IProduct[] = await getAllProducts();
        setProducts(productsData);
      } catch {
        errorMessage("Invalid invoice id.");
        history.push("/invoice");
      }
    };

    useEffect(() => {
      setAllKeys();
      setData();
    }, [id]);

    useEffect(() => {
      const getDataHere = async () => {
        const response = await getSalesData(id);
        setSalesDetails(response);
      };
      getDataHere();
    }, [id]);
    const savePdf = () => {
      savePDF(componentToPDFRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "Invoice",
      });
    };

    const reactToPrintContent = useCallback(() => {
      return componentToPrintRef.current;
    }, [componentToPrintRef.current]);

    const handleAfterPrint = () => {
      history.push(`/invoice/view/${id}`);
    };

    const handleOnBeforeGetContent = async () => {
      if (company.IRD_SYS === "Yes") {
        setLoading(true);
        if (salesDetails && salesDetails?.Print_Copy > 0) {
          setLoading(true);
          const response = await getBillReprint(id);
        } else {
          const responsess = await getBill(id, salesDetails?.UserName);
        }
      } else {
        setLoading(false);
      }
    };

    const getGrandDetails = () => {
      const data = salesDetails;
      let amount = 0;
      let taxable = 0;
      let taxableDiscount = 0;
      let nonTaxable = 0;
      let nonTaxableDiscount = 0;
      let exerciseDuty = 0;
      let tax = 0;
      let discount = 0;
      let grand = 0;

      try {
        if (data) {
          const nonTaxableData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.nonTaxable
          );
          const taxableData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.taxable
          );
          const exerciseDutyData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.exerciseDuty
          );
          const taxData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.tax
          );
          const discountData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.discount
          );
          const salesData = data.AccountTransactionValues.find(
            (data) => data.AccountId === keys.sales
          );

          salesDetails.SalesOrderDetails.map((data, index) => {
            if (data.TaxRate === 0) {
              nonTaxableDiscount += data.Discount;
            } else {
              taxableDiscount += data.Discount;
            }
          });

          nonTaxable = nonTaxableData ? nonTaxableData.Credit : 0;
          taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
          discount = discountData
            ? discountData.Debit + discountData.Credit
            : 0;
          amount = taxable + nonTaxable + discount;
          exerciseDuty = exerciseDutyData
            ? exerciseDutyData.Credit + exerciseDutyData.Debit
            : 0;
          tax = taxData ? taxData.Credit + taxData.Debit : 0;
          grand = taxable + nonTaxable + tax + exerciseDuty;

          setGrandDetails({
            totalAmount: amount,
            totalTaxable: taxable,
            totlaNonTaxable: nonTaxable,
            totalDiscount: discount,
            totalExerciseDuty: exerciseDuty,
            totalTax: tax,
            grandTotal: grand,
          });
        }
      } catch {
        history.push("/invoice");
      }
    };

    useEffect(() => {
      getGrandDetails();
    }, [salesDetails, products, keys, ledgers]);

    const decimalToWord = async (grand: number) => {
      //Conversion of decimal value to word is accomplished here
      const grandInWord = await getDecimalInWord(grand);
      setDecimalInWords(grandInWord);
    };

    useEffect(() => {
      decimalToWord(grandDetails.grandTotal);
    }, [decimalInWords, grandDetails.grandTotal]);

    const getCustomerName = (id: number | any) => {
      if (id === null) {
        return "";
      }
      const customerData: any = ledgers.find((data) => data.Id === id);
      return customerData ? customerData.Name : "";
    };
    const getCustomerPhone = (id: number | any) => {
      if (id === null) {
        return "";
      }
      const customerData: any = ledgers.find((data) => data.Id === id);
      return customerData ? customerData.Telephone : "";
    };
    const getCustomerAddress = (id: number | any) => {
      if (id === null) {
        return "";
      }
      const customerData: any = ledgers.find((data) => data.Id === id);
      return customerData ? customerData.Address : "";
    };

    const getCustomerPan = (id: number | any): string[] => {
      if (id === null) {
        return [];
      }
      const customerData: any = ledgers.find((data) => data.Id === id);
      if (customerData) {
        if (customerData.PanNo === null) {
          return [];
        }
        let pan: string[] = [];
        for (let index = 0; index < customerData.PanNo.length; index++) {
          const element = customerData.PanNo[index];
          pan.push(element);
        }
        return pan;
      }
      return [];
    };

    interface Iprops {
      salesData: ISales[];
    }

    const getSaleType = (bill: string | any): string => {
      let SaleType = "";
      if (bill) {
        let endPosition = bill.search("#");
        for (let index = 0; index < endPosition - 1; index++) {
          SaleType += bill[index];
        }
      }
      return SaleType;
    };
    const getInvoiceNo = (bill: string | any): string => {
      let billNo = "";
      if (bill) {
        let startPosition = bill.search("#");
        let endPosition = bill.search("]");

        for (let index = startPosition + 1; index < endPosition; index++) {
          billNo += bill[index];
        }
        return billNo;
      }
      return "";
    };

    const handleExcelDownload = () => {
      if (salesDetails) {
        const getProductName = (id: number | any) => {
          if (id === null) {
            return "";
          }
          const productData = products.find((data) => data.Id === id);
          return productData ? productData.Name : "";
        };

        const workbook = XLSX.utils.book_new();

        const excelData = [
          ["", "", "", "Dcube IT Solution Pvt Ltd "],
          ["", "", "", "Invoice ", "", "", ""],
          [""],
          [
            "Name",
            getCustomerName(salesDetails.SourceAccountTypeId),
            "",
            "",
            "Miti",
            salesDetails.AccountTransactionValues[0].NVDate,
          ],
          [
            "Address",
            getCustomerAddress(salesDetails.SourceAccountTypeId),
            "",
            "",
            "Date",
            salesDetails.Date,
          ],
          [
            "Phone",
            [getCustomerPhone(salesDetails.SourceAccountTypeId)],
            "",
            "",
            ["Invoice No"],
            getInvoiceNo(salesDetails.AccountTransactionValues[0].Name),
          ],
          [
            "VAT/PAN",
            getCustomerPan(salesDetails.SourceAccountTypeId),
            "",
            "",
            "Sales Type",
            getSaleType(
              salesDetails && salesDetails.AccountTransactionValues[0].Name
            ),
          ],
          [""],
          ["SN.", "Item name", "Qty", "Unit", "Rate (Rs)", "Amount (Rs.)"],
          ...salesDetails.SalesOrderDetails.map((data, index) => [
            index + 1,
            [getProductName(data.ItemId), "", ""],
            data.Qty,
            data.UnitType,
            data.UnitPrice.toFixed(2),
            (data.UnitPrice * data.Qty).toFixed(2),
          ]),
          [
            "",
            "",
            "",
            "",
            ["Gross Total"],
            grandDetails.totalAmount.toFixed(2),
          ],
          ["", "", "", "", "Discount", grandDetails.totalDiscount.toFixed(2)],
          ["", "", "", "", "Taxable", grandDetails.totalTaxable.toFixed(2)],
          [
            "",
            "",
            "",
            "",
            ["Non-taxable"],
            grandDetails.totlaNonTaxable.toFixed(2),
          ],
          [
            "",
            "",
            "",
            "",
            "Exercise Duty",
            grandDetails.totalExerciseDuty.toFixed(2),
          ],
          ["", "", "", "", "VAT @ 13%", grandDetails.totalTax.toFixed(2)],
          ["", "", "", "", "Net Total", grandDetails.grandTotal.toFixed(2)],
          ["In Words", decimalInWords],
          ["Remarks", salesDetails?.Description],
          [["Challan No"], salesDetails?.ChallanNo],
          [["Vehicle No"], salesDetails?.VehicleNo],
        ];

        // const worksheetData = excelData.map((row) => row.map((cell) => cell));

        const worksheetData = excelData.map((row, rowIndex) =>
          row.map((cell, columnIndex) => {
            // Check if the cell's content matches the values you want to style
            if (
              [
                "SN.",
                "Item name",
                "Qty",
                "Unit",
                "Rate (Rs)",
                "Amount (Rs.)",
              ].includes(cell)
            ) {
              return {
                t: "s", // type: string
                v: cell, // value
                s: {
                  font: {
                    bold: true,
                  },
                  border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                  },
                },
              };
            }
            // Check if the current cell is in the header row or in the sales details rows
            if (rowIndex === 0 || rowIndex > 1) {
              return {
                t: "s",
                v: cell,
                s: {
                  border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                  },
                },
              };
            }
            return cell;
          })
        );

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Details");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "invoice_details.xlsx";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
    };

    return (
      <>
        <Paper
          sx={{
            position: "sticky",
            top: 65,
            mx: "auto",
            flexGrow: 1,
            py: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 3,
          }}
        >
          <Grid
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              px: { xs: 1, md: 2, lg: 3 },
            }}
            container
          >
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <ReactToPrint
                trigger={() => (
                  <Button
                    size="small"
                    variant="contained"
                    color="info"
                    startIcon={<PrintIcon />}
                  >
                    Print
                  </Button>
                )}
                onAfterPrint={handleAfterPrint}
                onBeforeGetContent={handleOnBeforeGetContent}
                // content={reactToPrintContent}
                content={() => {
                  return componentToPrintRef.current;
                }}
              />
              <Button
                sx={{ mx: 2 }}
                size="small"
                variant="contained"
                color="error"
                onClick={() => savePdf()}
                startIcon={<PictureAsPdfIcon />}
              >
                Pdf
              </Button>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                sx={{ mx: 2 }}
                size="small"
                variant="contained"
                color="success"
                onClick={handleExcelDownload}
                startIcon={<SiMicrosoftexcel />}
              >
                <p> Excel</p>
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "400" }}>
                Invoice
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Tooltip title="Go Back" followCursor={true}>
                <IconButton
                  sx={{ fontSize: "2.1rem" }}
                  color="primary"
                  onClick={() => history.goBack()}
                >
                  <BiLeftArrowCircle style={{ cursor: "pointer" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        <div
          ref={componentToPDFRef}
          style={{ marginTop: "40px", height: "100%" }}
        >
          <PrintPdfInvoice />
        </div>
        <div style={{ display: "none" }}>
          {loading && loading === true ? (
            <div
              ref={componentToPrintRef}
              style={{ padding: "15px", display: "flex", height: "100%" }}
            >
              <style type="text/css" media="print">
                {
                  "\
                  @page {size: portrait;}\
                  "
                }
              </style>
              <PrintPdfInvoice />
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <PrintComponent />
    </>
  );
};

export default ViewInvoice;
