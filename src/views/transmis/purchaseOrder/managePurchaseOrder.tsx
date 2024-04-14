import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import InputForms from "./components/inputForms";
import { getPurchaseOrder } from "../../../services/purchaseOrderApi";
import { IParams } from "../../../interfaces/params";
import FormHeader from "../../../components/headers/formHeader";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { InitialState } from "./components/initialState";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { useAppSelector } from "../../../app/hooks";
import { IPurchaseOrder } from "../../../interfaces/purchaseOrder";

const ManagePurchaseOrder = () => {
  const { id }: IParams = useParams();
  const puror = useAppSelector((state) => state.purorData.data);
  const [allData, setAllData] = useState<IPurchaseOrder>({
    ...puror,
    Id: "",
    AccountId: 0,
    EnglishDate: "",
    NepaliDate: "",
    ExpiredNepaliDate: "",
    ExpiredEnglishDate: "",
    Message: "",
    MessageStatement: "",
    FinancialYear: "",
    CompanyCode: "",
    PurchaseOrderDetails: [],
  });
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const history = useHistory();

  const getPurchaseData = async () => {
    try {
      const response = await getPurchaseOrder(id);
      setAllData(response);
    } catch (error: any) {
      history.push("/purchase-order");
    }
  };

  useEffect(() => {
    if(loginedUserRole.includes("POAdd") && id === "add"){
      const currentnepaliDate = getNepaliDate();
      setAllData({ ...allData, NepaliDate: currentnepaliDate });
      return;
    }
    else if(loginedUserRole.includes("POEdit") && id !== "add"){
      getPurchaseData();
    }else{
      history.push("/purchase-order");
      errorMessage("Sorry! permission is denied");
    }
    
  }, [id]);

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Purchase Order" : "Edit Purchase Order"}
        path="/purchase-order"
      />
      <InputForms allData={allData} setAllData={setAllData} paramId={id} />
    </>
  );
};

export default ManagePurchaseOrder;
