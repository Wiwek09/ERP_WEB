import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { IOnSubmit } from "../../../interfaces/event";
import { IProduct } from "../../../interfaces/invoice";
import { ProfitItemWise } from "../../../interfaces/profitDateItemWise";
import { IItemsDateWise } from "../../../interfaces/salesDateWise";
import { getAllItemWiseProfit } from "../../../services/itemWiseProfit";
import {
  getAllProducts,
  getAllCustomers,
  getAllItemWiseSales
} from '../../../services/itemWiseSalesApi';
import { IsDateVerified } from "../../../utils/dateVerification";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IDate, ISelectedProduct, PSelectedProduct } from "../../transaction/invoice/interfaces";
import GridHeader from "./component/GridHeader";
import ItemWiseProfitabilityTable from "./component/ItemWiseProfitability";

const ItemWiseProfitability = () => {
    const dispatch = useAppDispatch();
    const defaultDate = useAppSelector((state) => state.defaultDate);
    const financialYear = useAppSelector((state) => state.financialYear);
    // const branch = useAppSelector((state) => state.branchData.data);
    // const [selectbranchId, setSelectBranchId] = useState({ ...branch });
    const [selectedProductData, setSelectedProductData] = useState<PSelectedProduct>({
        ItemId: 0
    });
    const [products, setProducts] = useState<IProduct[]>([]);
    const [itemsDateWise, setItemsDateWise] = useState<ProfitItemWise[]>([]);

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
            const productsData: IProduct[] = await getAllProducts();
            setProducts(productsData);
            const itemsDateWiseData = await getAllItemWiseProfit(
                date.StartDate,
                date.EndDate,
                selectedProductData.ItemId
            );
            // if (itemsDateWiseData.length > 0) {
                setItemsDateWise(itemsDateWiseData);
                setIsAllDataLoaded(true);
            // } else {
            //     errorMessage("no Data");
            // }
            
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

    const updateSelectedFormData = (name: string, value: number | 0) => {
    }
    const selectedProductDataId = (value: any) => {
        setSelectedProductData({
            ItemId: value
        })
    }
    return (
        <>
        <GridHeader
            dateChoose={date}
            setDateChoose={setDate}
            getDataInSearch={loadDataByDate}
            // pdf="true"
            // PDF="true"
            // excel="true"
            products={products}
            setItemId = {selectedProductDataId}
            itemId={selectedProductData}
            addDisable={true}
            onClickHandler={updateSelectedFormData}
            //   branch={selectbranchId.branch}
            fileName={`itemwise-sales-report-${date.StartDate}-${date.EndDate}`}
        />
        <ItemWiseProfitabilityTable
            itemsDateWiseData={itemsDateWise}
            // productData={products}
            // ledgerData={ledgers}
            date={date}
        />
        </>
    );
};

export default ItemWiseProfitability;
