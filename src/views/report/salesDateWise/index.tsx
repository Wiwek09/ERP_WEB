import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import GridFormHeader from "../../../components/headers/gridDateHeader";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { IOnSubmit } from "../../../interfaces/event";
import { IItemsDateWise } from "../../../interfaces/salesDateWise";
import {
  getAllProducts,
  getAllCustomers,
  getAllItemWiseSales,
} from "../../../services/itemWiseSalesApi";
import { IsDateVerified } from "../../../utils/dateVerification";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IDate, ICommonObj } from "../../transaction/invoice/interfaces";
import ExcelTable from "./components/ExcelTable";
import SalesDateWiseTable from "./components/SalesDateWiseTable";

const SalesDateWise = () => {
  const dispatch = useAppDispatch();
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const financialYear = useAppSelector((state) => state.financialYear);

  const [itemsDateWise, setItemsDateWise] = useState<IItemsDateWise[]>([]);
  const [products, setProducts] = useState<ICommonObj[]>([]);
  const [ledgers, setLedgers] = useState<ICommonObj[]>([]);

  const [date, setDate] = useState<IDate>(
    defaultDate.EndDate === ""
      ? {
          StartDate: financialYear.NepaliStartDate,
          EndDate: financialYear.NepaliEndDate,
        }
      : defaultDate
  );
  const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
  const setItemsDateWiseData = async () => {
    try {
      const itemsDateWiseData: IItemsDateWise[] = await getAllItemWiseSales(
        date.StartDate,
        date.EndDate
      );
      setItemsDateWise(itemsDateWiseData);
      const productData = await getAllProducts();
      const ledgersData = await getAllCustomers();

      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      setProducts(
        productData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      setIsAllDataLoaded(true);
    } catch {
      errorMessage("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    setItemsDateWiseData();
  }, []);

  const loadDataByDate = (e: IOnSubmit) => {
    e.preventDefault();
    if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
      errorMessage("Invalid Date !!!");
      return;
    }
    setItemsDateWiseData();
    dispatch(setDefaultDateAction(date));
  };

  if (!isAllDataLoaded) {
    return <LinearProgress />;
  }

  const updateSelectedFormData = (name: string, value: number | 0) => {};

  return (
    <>
      <GridFormHeader
        dateChoose={date}
        setDateChoose={setDate}
        getDataInSearch={loadDataByDate}
        pdf="true"
        PDF="true"
        excel="true"
        addDisable={true}
        onClickHandler={updateSelectedFormData}
        fileName={`itemwise-sales-report-${date.StartDate}-${date.EndDate}`}
      />
      <SalesDateWiseTable
        itemsDateWiseData={itemsDateWise}
        productData={products}
        ledgerData={ledgers}
        date={date}
      />
      <ExcelTable
        itemsDateWiseData={itemsDateWise}
        productData={products}
        ledgerData={ledgers}
        date={date}
      />
    </>
  );
};

export default SalesDateWise;
