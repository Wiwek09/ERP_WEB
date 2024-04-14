import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import GridFormHeader from "../../../components/headers/gridDateHeader";
import { updateBraDataAction } from "../../../features/braSlice";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { IOnSubmit } from "../../../interfaces/event";
import { IGetAllPurchase, IProduct } from "../../../interfaces/purchase";
import server from "../../../server/server";
import { getAllProducts } from "../../../services/purchaseApi";
import {
  getAllPurchase,
  getAllPurchaseFilteredByBranch,
} from "../../../services/purchaseApi";
import { IsDateVerified } from "../../../utils/dateVerification";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IDate } from "../invoice/interfaces";
import ExcelTable from "./components/ExcelTable";
import PurchaseTable from "./components/PurchaseTable";

const ImportBill = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const hostName = window.location.host;
  const purchaseProData = hostName + "purchaseProData";
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const financialYear = useAppSelector((state) => state.financialYear);
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({ ...branch });
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const [purchases, setPurchases] = useState<IGetAllPurchase[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const [date, setDate] = useState<IDate>(
    defaultDate.EndDate === ""
      ? {
          StartDate: financialYear.NepaliStartDate,
          EndDate: financialYear.NepaliEndDate,
        }
      : defaultDate
  );
  const [areAllDataLoaded, setAreAllDataLoaded] = useState<boolean>(false);

  const setPurchaseData = async () => {
    //LOAD NEW IMPORT BILL
    setAreAllDataLoaded(true);
    try {
      if (selectbranchId.branch === 0) {
        const purchaseData: IGetAllPurchase[] = await getAllPurchase(
          date.StartDate,
          date.EndDate
        );
        if (purchaseData.length > 0) {
          setPurchases(
            purchaseData.filter((item) => item.VType === "Purchase Import")
          );
          setAreAllDataLoaded(false);
          // {console.log(purchases,"Import-Purchase")}
        } else {
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      } else if (selectbranchId.branch > 0) {
        const purchaseData: IGetAllPurchase[] =
          await getAllPurchaseFilteredByBranch(
            date.StartDate,
            date.EndDate,
            selectbranchId.branch
          );

        if (purchaseData.length > 0) {
          setPurchases(
            purchaseData.filter((item) => item.VType === "Purchase Import")
          );
          setAreAllDataLoaded(false);
        } else {
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      } else {
        const purchaseData: IGetAllPurchase[] = await getAllPurchase(
          date.StartDate,
          date.EndDate
        );
        if (purchaseData.length > 0) {
          setPurchases(
            purchaseData.filter((item) => item.VType === "Purchase Import")
          );
          setAreAllDataLoaded(false);
        } else {
          errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
        }
      }
      const productData: IProduct[] = await getAllProducts();
      if (productData.length > 0) {
        setProducts(productData);
      } else {
        errorMessage(`No data between ${date.StartDate} - ${date.EndDate}`);
      }
    } catch {
      errorMessage("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (loginedUserRole.includes("IBView")) {
      if (localStorage) {
        localStorage.myPageDataArr = server + "/import-bill";
      }
      setPurchaseData();
    } else {
      history.push("/");
      errorMessage("Sorry! permission is denied");
    }
  }, []);

  const loadDataByDate = (e: IOnSubmit) => {
    e.preventDefault();
    if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
      errorMessage("Invalid Date !!!");
      return;
    }
    setPurchaseData();
    dispatch(setDefaultDateAction(date));
  };

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, branch: value });
    localStorage.removeItem(purchaseProData);
  };

  return (
    <>
      <GridFormHeader
        dateChoose={date}
        setDateChoose={setDate}
        getDataInSearch={loadDataByDate}
        path="/import-bill/add"
        pdf="true"
        PDF="true"
        excel="true"
        addDisable={!loginedUserRole.includes("IBAdd")}
        onClickHandler={updateSelectedFormData}
        branch={selectbranchId.branch}
        fileName={`import-bill-report-${date.StartDate}-${date.EndDate}`}
      />

      {areAllDataLoaded ? (
        <LinearProgress sx={{ marginTop: 3 }} />
      ) : (
        <PurchaseTable
          purchaseData={purchases}
          productData={products}
          date={date}
        />
      )}

      <ExcelTable purchaseData={purchases} productData={products} date={date} />
    </>
  );
};

export default ImportBill;
