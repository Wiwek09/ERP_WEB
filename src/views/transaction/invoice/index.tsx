import { useEffect, useState } from "react";
import { ISales } from "../../../interfaces/invoice";
import {
  getAllCustomers,
  getAllLedgerForCalculation,
  getAllProducts,
  getAllSales,
  getAllSalesFilteredByBillno,
  getAllSalesFilteredByBranch,
} from "../../../services/invoice";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { ICommonObj, IDate, ILedgerCalculation } from "./interfaces";
import InvoiceTable from "./components/InvoiceTable";
import { IOnSubmit } from "../../../interfaces/event";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { IsDateVerified } from "../../../utils/dateVerification";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import ExcelTable from "./components/ExcelTable";
import { LinearProgress } from "@mui/material";
import { useParams } from "react-router";
import { IParams } from "../../../interfaces/params";
import { updateBraDataAction } from "../../../features/braSlice";
import GridInvoiceFormHeader from "../../../components/headers/invoiceDataHeader";
import { getNepaliDate } from "../../../utils/nepaliDate";

const getBillNo = (bill: string): string => {
  let billNo = "";

  let startPosition = bill.search("#");
  let endPosition = bill.search("]");

  for (let index = startPosition + 1; index < endPosition; index++) {
    billNo += bill[index];
  }
  return billNo;
};

const Invoice = () => {
  const dispatch = useAppDispatch();
  const hostName = window.location.host;
  const invProData = hostName + "invProData";
  const financialYear = useAppSelector((state) => state.financialYear);
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({ ...branch });
  const { id }: IParams = useParams();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [sales, setSales] = useState<ISales[]>([]);
  const [products, setProducts] = useState<ICommonObj[]>([]);
  const [ledgers, setLedgers] = useState<ICommonObj[]>([]);
  const [selectedbill, setSelectedBill] = useState("");
  let [databyBill, setDatabyBill] = useState([]);
  const [date, setDate] = useState<IDate>({
    StartDate: getNepaliDate(),
    EndDate: getNepaliDate(),
  });
  const [allLedgerData, setAllLedgerData] = useState<ILedgerCalculation[]>([]);
  const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);

  const setAllData = async () => {
    setISAllDataLoaded(true);
    try {
      const ledgersData = await getAllCustomers();
      const productsData = await getAllProducts();
      if (selectbranchId.branch === 0) {
        const salesData: any = await getAllSales(date.StartDate, date.EndDate);
        const setNVDate = salesData.map((obj: any, i: number) => ({
          ...obj,
          NVDate: salesData[i].AccountTransactionValues[0].NVDate,
        }));
        if (salesData.length > 0) {
          if (selectedbill === "") {
            setSales(setNVDate);
            setISAllDataLoaded(false);
          } else {
            const filterExp = await getAllSalesFilteredByBillno(
              date.StartDate,
              date.EndDate,
              0,
              financialYear.Name,
              selectedbill
            );
            if (filterExp.length > 0) {
              setSales(filterExp);
              setISAllDataLoaded(false);
            } else {
              setISAllDataLoaded(false);
              errorMessage(`${selectedbill} Bill No data is not available.`);
            }
          }
        } else {
          setISAllDataLoaded(false);
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      } else if (selectbranchId.branch === 0 && selectedbill !== "") {
        const filterExp = await getAllSalesFilteredByBillno(
          date.StartDate,
          date.EndDate,
          0,
          financialYear.Name,
          selectedbill
        );
        if (filterExp.length > 0) {
          setSales(filterExp);
          setISAllDataLoaded(false);
        } else {
          setISAllDataLoaded(false);
          errorMessage(`${selectedbill} Bill No data is not available.`);
        }
      } else if (selectbranchId.branch > 0) {
        const salesData: ISales[] = await getAllSalesFilteredByBranch(
          date.StartDate,
          date.EndDate,
          selectbranchId.branch
        );
        const setNVDate = salesData.map((obj, i) => ({
          ...obj,
          NVDate: salesData[i].AccountTransactionValues[0].NVDate,
        }));
        if (salesData.length > 0) {
          if (selectedbill === "") {
            setSales(setNVDate);
            setISAllDataLoaded(false);
          } else {
            const filterExp = await getAllSalesFilteredByBillno(
              date.StartDate,
              date.EndDate,
              selectbranchId.branch,
              financialYear.Name,
              selectedbill
            );
            if (filterExp.length > 0) {
              setSales(filterExp);
              setISAllDataLoaded(false);
            } else {
              setISAllDataLoaded(false);
              errorMessage(`${selectedbill} Bill No data is not available.`);
            }
          }
        } else {
          setISAllDataLoaded(false);
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      } else {
        const salesData: ISales[] = await getAllSales(
          date.StartDate,
          date.EndDate
        );
        const setNVDate = salesData.map((obj, i) => ({
          ...obj,
          NVDate: salesData[i].AccountTransactionValues[0].NVDate,
        }));
        if (salesData.length > 0) {
          if (selectedbill === "") {
            setSales(setNVDate);
            setISAllDataLoaded(false);
          } else {
            const filterdExp = setNVDate.filter((datass: any) => {
              return getBillNo(datass.Name) === selectedbill;
            });
            if (filterdExp.length > 0) {
              setSales(filterdExp);
              setISAllDataLoaded(false);
            } else {
              setISAllDataLoaded(false);
              errorMessage(`${selectedbill} Bill No data is not available.`);
            }
          }
        } else {
          setISAllDataLoaded(false);
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      }

      const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();

      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      setProducts(
        productsData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      setAllLedgerData(ledgerCalculationData);
    } catch {
      errorMessage("Sorry, something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    setAllData();
  }, []);

  const loadDataByDate = (e: IOnSubmit) => {
    e.preventDefault();
    setISAllDataLoaded(true);
    if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
      setISAllDataLoaded(false)
      errorMessage("Invalid Date !!!");
      return;
    }
    setAllData();
    dispatch(setDefaultDateAction(date));
  };

  // if (!isAllDataLoaded) {
  //   return <LinearProgress />;
  // }

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, ["branch"]: value });
    localStorage.removeItem(invProData);
  };

  return (
    <>
      {loginedUserRole.includes("InvAdd") ? (
        <GridInvoiceFormHeader
          dateChoose={date}
          setDateChoose={setDate}
          getDataInSearch={loadDataByDate}
          billNoChange={setSelectedBill}
          billNo={selectedbill}
          path="/invoice/add"
          pdf="true"
          PDF="true"
          excel="true"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          fileName={`invoice-report-${date.StartDate}-${date.EndDate}`}
        />
      ) : (
        <GridInvoiceFormHeader
          dateChoose={date}
          setDateChoose={setDate}
          getDataInSearch={loadDataByDate}
          billNoChange={setSelectedBill}
          billNo={selectedbill}
          path="INVADD"
          pdf="true"
          PDF="true"
          excel="true"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          fileName={`invoice-report-${date.StartDate}-${date.EndDate}`}
        />
      )}
{isAllDataLoaded ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
            <InvoiceTable
            salesData={sales}
            productData={products}
            ledgerData={ledgers}
            ledgerCalculationData={allLedgerData}
            date={date}
          />
          )}

      <ExcelTable
        salesData={sales}
        productData={products}
        ledgerData={ledgers}
        ledgerCalculationData={allLedgerData}
        date={date}
      />
    </>
  );
};

export default Invoice;
