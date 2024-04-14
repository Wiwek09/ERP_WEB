import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import FormHeader from "../../../components/headers/formHeader";
import UserModal from "../../../components/modal/userModal/UserModal";
import { addNewLedger } from "../../../components/modal/userModal/userModalApi";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import { IProduct } from "../../../interfaces/invoice";
import { IParams } from "../../../interfaces/params";
import { IQuotation } from "../../../interfaces/quotation";
import { getAllBranch } from "../../../services/branchApi";
import { getAllDepartments } from "../../../services/departmentApi";
import { getAllCustomers, getAllProducts } from "../../../services/invoice";
import { getQuotation } from "../../../services/quotationApi";
import { getAllWarehouseData } from "../../../services/warehouseApi";
import { errorMessage, successMessage } from "../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { ICommonObj, IMinimumLedgerDetails } from "../../transaction/invoice/interfaces";
import { InitialState } from "./components/initialState";
import InputForms from "./components/inputForms";

const initialNewLedger: IMinimumLedgerDetails = {
  name: "",
  address: "",
  telephoneNo: "",
  email: "",
  panvatno: "",
};

const ManageQuotation = () => {
  const quo = useAppSelector((state) => state.quoData.data);
  const [allData, setAllData] = useState<IQuotation>({
    ...quo,
    Id: 0,
    AccountId: 0,
    QuotationNumber: "",
    EnglishDate: "",
    NepaliDate: "",
    ExpiredEnglishDate: "",
    ExpiredNepaliDate: "",
    Message: "",
    MessageStatement: "",
    QuotationDetails: [],
    FinancialYear: "",
    CompanyCode: 0,
    BranchCode: 0,
  });
  const { id, type }: IParams = useParams();

  const history = useHistory();
  const FinancialYear = useAppSelector(getCurrentFinancialYear);

   const [newLedger, setNewLedger] =
    useState<IMinimumLedgerDetails>(initialNewLedger);
  const [displayNewLedgerModal, setDisplayNewLedgerModal] =
    useState<boolean>(false);
  const [branch, setBranch] = useState<ICommonObj[]>([]);
  const [warehouse, setWarehouse] = useState<ICommonObj[]>([]);
  const [department, setDepartment] = useState<ICommonObj[]>([]);
  const [customer, setLedgers] = useState<ICommonObj[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const loadData = async () => {
    if(loginedUserRole.includes("QuotationAdd") && id === "add"){
      const currentnepaliDate = getNepaliDate();
      setAllData({ ...allData, NepaliDate: currentnepaliDate });
      return;
    }
    else if(loginedUserRole.includes("QuotationEdit") && id !== "add"){
      try {
        const res = await getQuotation(
          FinancialYear.StartDate,
          FinancialYear.EndDate,
          id
        );
        if (res) {
          setAllData(res);
        } else {
          history.push("/quotation");
        }
      } catch (error) {
        history.push("/quotation");
      }
    }else{
      history.push("/quotation");
      errorMessage("Sorry! permission is denied");
    }
  };
  useEffect(() => {
    loadData();
    setAllDatas();
  }, []);
  const setAllDatas = async () => {
    try {
      const productsData: IProduct[] = await getAllProducts();
      setProducts(productsData);
      const departmentData = await getAllDepartments();
      const warehouseData = await getAllWarehouseData();
      const branchData = await getAllBranch();
      const ledgersData = await getAllCustomers();

      setBranch(
        branchData.map((data: any) => {
          return { id: data.Id, label: data.NameEnglish };
        })
      );
      setDepartment(
        departmentData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setWarehouse(
        warehouseData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );

      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
    } catch {
      errorMessage("Someting went wrong. Please try again later.");
    }
  };
  const updateNewLedgerFields = (e: IOnChange) => {
    if (e.target.name === "telephoneNo") {
      if (isNaN(Number(e.target.value))) {
        return;
      }
    }
    setNewLedger({ ...newLedger, [e.target.name]: e.target.value });
  };
  const addNewLedgerFromModal = async (e: IOnSubmit) => {
    e.preventDefault();
    try {
      const response = await addNewLedger({
        Name: newLedger.name,
        Address: newLedger.address,
        Email: newLedger.email,
        Telephone: newLedger.telephoneNo,
        AccountTypeId: 18,
      });
      successMessage("New customer successfully added.");
      setDisplayNewLedgerModal(false);
      setNewLedger(initialNewLedger);
      setAllDatas();
    } catch {
      errorMessage("Invalid data");
    }
  };
  return (
    <>
      <FormHeader
        headerName={
          id === "add"
            ? "Add Quotation"
            : type === "createorder"
            ? "Quotation to Order"
            : "Edit Quotation"
        }
        path="/quotation"
      />
      <InputForms
        allData={allData}
        setAllData={setAllData}
        paramId={id}
        paramType={type}
        setDisplayUserModal={setDisplayNewLedgerModal}
      />
      <UserModal
        displayStatus={displayNewLedgerModal}
        setDisplayStatus={setDisplayNewLedgerModal}
        ledgerDetails={newLedger}
        setInputData={updateNewLedgerFields}
        setLedgerDetails={setNewLedger}
        onClickHandler={addNewLedgerFromModal}
      />
    </>
  );
};

export default ManageQuotation;
