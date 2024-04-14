import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import { IBranch } from "../../../interfaces/branch";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import {
  addBranch,
  deleteBranch,
  getBranch,
  updateBranch,
} from "../../../services/branchApi";
import BranchForm from "./components/BranchForm";
import { useAppSelector } from "../../../app/hooks";
import { toast } from "react-toastify";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { SaveProgressDialog } from "../../../components/dialogBox";

interface IParams {
  id: string;
}

const getInitialBranchData = (companyId: number) => {
  return {
    Id: 0,
    NameEnglish: "",
    NameNepali: "",
    CompanyId: 0,
  };
};

const ManageBranch = () => {
  const companyId = useAppSelector((state) => state.company.data.Id);
  const history = useHistory();
  const { id }: IParams = useParams();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [branch, setBranch] = useState<IBranch>(
    getInitialBranchData(companyId)
  );
  const [showDeleteModal, setShowDeleteModel] = useState<boolean>(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const setBranchData = async () => {
    const responseData: any = await getBranch(id);
    if (responseData !== -1) {
      setBranch(responseData);
    } else {
      errorMessage(`Invalid branch id (${id})`);
      history.push("/branch");
    }
  };

  useEffect(() => {
    if(loginedUserRole.includes("BranchAdd")){
      if (id === "add") {
        setBranch(getInitialBranchData(companyId));
      } else {
        setBranchData();
      }
    }else{
      history.push("/branch");
      errorMessage("Sorry! permission is denied");
    }
    
  }, []);

  const updateBranchFields = (e: IOnChange) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const addNewBranch = async (e: IOnSubmit) => {
    setOpenSaveDialog(true);
    e.preventDefault();
    const response = await addBranch(branch);
    if (response === 1) {
      setOpenSaveDialog(false);
      toast.success("Successfully added.");
      setBranch(getInitialBranchData(companyId));
    } else {
      setOpenSaveDialog(false);
      toast.error("Operation failed due to internal server error.");
    }
  };

  const updateBranchData = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    const response = await updateBranch(id, branch);
    if (response === -1) {
      setOpenSaveDialog(false);
      toast.error("Operation is failed due to internal server error.");
    } else {
      setOpenSaveDialog(false);
      toast.success("Successfully updated.");
      history.push("/branch");
    }
  };

  const deleteBranchData = async (e: IOnSubmit) => {
    const response = await deleteBranch(id);
    if (response === -1) {
      setShowDeleteModel(false);
      toast.error("Operation is failed due to internal server error.");
    } else {
      toast.success("Successfully Deleted");
      setShowDeleteModel(false);
      history.push("/branch");
    }
  };

  return (
    <>
      <FormHeader headerName={id === "add" ? "Add branch" : "Edit branch"} />
      <BranchForm
        actionType={id}
        branch={branch}
        updateBranchFields={updateBranchFields}
        addBranch={addNewBranch}
        updateBranch={updateBranchData}
        deleteBranch={deleteBranchData}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModel}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageBranch;
