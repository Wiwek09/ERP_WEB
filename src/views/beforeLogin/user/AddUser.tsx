import { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { IUser } from "../../../interfaces/user";
import {
  getAssignRoles,
  updateAssignRole,
} from "../../../services/assignRolesApi";
import { addUser } from "../../../services/userApi";
import { editRoles } from "../../../services/userRoleApi";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import UserForm from "./UserForm";

const InitialRoles = {
  OrderManagement: false,
  PurchaseOrder: false,
  Branch: false,
  Quotation: false,
  PosBilling: false,
  Journal: false,
  Purchase: false,
  Invoice: false,
  Receipt: false,
  Payment: false,
  BankCash: false,
  SalesReturn: false,
  PurchaseReturn: false,
  Ledger: false,
  GroupLedger: false,
  Products: false,
  Category: false,
  UnitType: false,
  TrialBalance: false,
  ProfitLoss: false,
  BalanceSheet: false,
  SalesBook: false,
  SalesDateWise: false,
  SalesReturnBook: false,
  MaterializedView: false,
  PurchaseBook: false,
  ItemStockLedger: false,
  StockInHand: false,
  ChangePassword: false,
  Users: false,
  Roles: false,
  Department: false,
  FinancialYear: false,
  Company: false,
  Warehouse: false,
  WarehouseType: false,
  AssignRoles: false,
  TransactionType: false,
  MasterLedger: false,
};
const AddUser = () => {
  const history = useHistory();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState<IUser>({
    Claims: [],
    Logins: [],
    Roles: [],
    FullName: "",
    UserName: "",
    Password: "",
    FirstName: "",
    LastName: "",
    RoleName: "",
    Level: 0,
    Email: "",
    PhoneNumber: "",
    IsActive: false,
    ResetPassword: false,
    JoinDate: "",
    Token: "",
    EmailConfirmed: false,
    PasswordHash: "",
    SecurityStamp: "",
    PhoneNumberConfirmed: false,
    TwoFactorEnabled: false,
    LockoutEndDateUtc: "",
    LockoutEnabled: false,
    AccessFailedCount: 0,
    Id: "",
  });

  const validPassword = (Password: string, cPassword: string) => {
    if (Password.length < 6) {
      return false;
    } else if (Password !== cPassword) {
      return false;
    } else {
      return true;
    }
  };

  const addNewUser = async (data: IUser) => {
    try {
      let datas: any = {};
      let checkboxCollection = [];
      for (var key in InitialRoles) {
        checkboxCollection.push(key);
      }
      let ifChecked = {
        checkbox: checkboxCollection.toString(),
      };
      datas["Name"] = "superAdmin";
      datas["Description"] = "";
      datas["PermissionList"] = ifChecked.checkbox;
      datas["RoleName"] = "1";

      await addUser(data);

      await editRoles("1", datas);

      const res1: any = await getAssignRoles();

      await updateAssignRole(res1[0]?.Id, "1");

      successMessage();
      history.push("/");
    } catch {
      errorMessage();
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!validPassword(userData.Password, confirmPassword)) {
      toast.error("Invalid password");
    } else {
      addNewUser(userData);
    }
  };

  return (
    <>
      <UserForm
        onSubmit={onSubmit}
        userData={userData}
        setUserData={setUserData}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </>
  );
};

export default AddUser;
