import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DateHeader from "../../../components/headers/dateHeader";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import {
  ISalesReturn,
  IProductSalesReturn,
} from "../../../interfaces/salesReturn";
import GridDateHeader from "../../../components/headers/gridDateHeader";
import {
  getAllSalesReturn,
  getAllSalesReturnByBranch,
  getAllSalesReturnDataGird,
} from "../../../services/salesReturnApi";
import { IsDateVerified } from "../../../utils/dateVerification";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IAccountHolder } from "../../../interfaces/purchaseOrder";
import { getAllAccountHolder } from "../../../services/purchaseOrderApi";
import { ISelectType } from "../../../interfaces/autoComplete";
import ExcelSalesReturn from "./components/ExcelTable";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { useHistory } from "react-router";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { setSortAction } from "../../../features/sortSlice";
import { ILedgerCalculation } from "../invoice/interfaces";
import { getAllLedgerForCalculation } from "../../../services/invoice";
import TSalesReturn from "./tSalesReturn";
import { LinearProgress } from "@mui/material";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
const SalesReturn = () => {
  const PrintComponent = () => {
    const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
    const defaultDate = useAppSelector((state) => state.defaultDate);
    const FinancialYear = useAppSelector(getCurrentFinancialYear);
    const [selectedBranch, setSelectedBranch] = useState<number>(0);
    const [allData, setAllData] = useState<ISalesReturn[]>([]);
    const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
    const [allLedgerData, setAllLedgerData] = useState<ILedgerCalculation[]>(
      []
    );

    const [dateChoose, setDateChoose] = useState<IDateProps>(
      defaultDate.EndDate === ""
        ? {
            StartDate: getNepaliDate(),
            EndDate: FinancialYear.NepaliEndDate,
          }
        : defaultDate
    );

    useEffect(() => {
      getData();
    }, []);

    const getDataInSearch = async (e: any) => {
      e.preventDefault();
      setIsAllDataLoaded(true);
      if (
        !IsDateVerified(dateChoose.StartDate, dateChoose.EndDate, FinancialYear)
      ) {
        errorMessage("Invalid Date !!!");
        return;
      }

      if (selectedBranch > 0) {
        try {
          const response: ISalesReturn[] = await getAllSalesReturnByBranch(
            dateChoose.StartDate,
            dateChoose.EndDate,
            selectedBranch
          );
          const setNVDate = response.map((obj, i) => ({
            ...obj,
            NVDate: response[i].AccountTransactionValues[0].NVDate,
          }));
          if (response.length > 0) {
            setAllData(setNVDate);
            setIsAllDataLoaded(false);
          } else {
            errorMessage(
              `No data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`
            );
          }
        } catch (error) {
          errorMessage();
          getData();
        }
      } else {
        const response = await getAllSalesReturnDataGird(
          dateChoose.StartDate,
          dateChoose.EndDate
        );
        const setNVDate = response.map((obj: any, i: string | number) => ({
          ...obj,
          NVDate: response[i].AccountTransactionValues[0].NVDate,
        }));
        if (response.length > 0) {
          setAllData(setNVDate);
          setIsAllDataLoaded(false);
        } else {
          errorMessage(
            `No data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`
          );
        }
      }
      dispatch(setDefaultDateAction(dateChoose));
    };
    const updateSelectedFormData = (name: string, value: number | 0) => {};

    const getData = async () => {
      setIsAllDataLoaded(true);
      const response: ISalesReturn[] = await getAllSalesReturnDataGird(
        dateChoose.StartDate,
        dateChoose.EndDate
      );
      const setNVDate = response.map((obj: ISalesReturn, i: number) => ({
        ...obj,
        NVDate: response[i].AccountTransactionValues[0].NVDate,
      }));
      if (response.length > 0) {
        setAllData(setNVDate);
        setIsAllDataLoaded(false);
      } else {
        errorMessage(
          `No data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`
        );
      }

      const res: IAccountHolder[] = await getAllAccountHolder();

      setAccountHolder(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
      const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();
      setAllLedgerData(ledgerCalculationData);
    };

    return (
      <>
        {loginedUserRole.includes("SRAdd") ? (
          <GridDateHeader
            headerName="Sales Return"
            dateChoose={dateChoose}
            setDateChoose={setDateChoose}
            getDataInSearch={getDataInSearch}
            path="/sales-return/add"
            onClickHandler={updateSelectedFormData}
            excel="true"
            pdf="true"
            PDF="true"
            fileName={`Sales-report-${dateChoose.StartDate}-${dateChoose.EndDate}`}
          />
        ) : (
          <GridDateHeader
            headerName="Sales Return"
            dateChoose={dateChoose}
            setDateChoose={setDateChoose}
            getDataInSearch={getDataInSearch}
            path="SRADD"
            onClickHandler={updateSelectedFormData}
            excel="true"
            pdf="true"
            PDF="true"
            fileName={`Sales-report-${dateChoose.StartDate}-${dateChoose.EndDate}`}
          />
        )}
        {isAllDataLoaded ? (
          <LinearProgress sx={{ marginTop: 3 }} />
        ) : (
          <TSalesReturn
            loginedUserRole={loginedUserRole}
            dateChoose={dateChoose}
            allData={allData}
            accountHolder={accountHolder}
            allLedgerData={allLedgerData}
          />
        )}

        <ExcelSalesReturn />
      </>
    );
  };
  return (
    <>
      <PrintComponent />
    </>
  );
};
export default SalesReturn;
