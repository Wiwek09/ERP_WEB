import { Grid, Paper } from "@mui/material";
import { IBranch } from "../../../../interfaces/branch";
import { IOnChange, IOnSubmit } from "../../../../interfaces/event";
import preeti from "preeti";
import {
  AddBtn,
  CloseButton,
  DeleteButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import { DeleteDialog } from "../../../../components/dialogBox";
import { useEffect, useState } from "react";
import { getAllBranch } from "../../../../services/branchApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";

interface IProps {
  actionType: string;
  branch: IBranch;
  updateBranchFields: (e: IOnChange) => void;
  addBranch: (e: IOnSubmit) => void;
  updateBranch: (e: IOnSubmit) => void;
  deleteBranch: (e: IOnSubmit) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: any;
}
interface IBranchData {
  Id: number;
  NameEnglish: string;
}

const BranchForm = ({
  actionType,
  branch,
  updateBranchFields,
  addBranch,
  updateBranch,
  deleteBranch,
  showDeleteModal,
  setShowDeleteModal,
}: IProps) => {

  const [branchs, setBranchs] = useState<IBranchData[]>([]);
  const setBranchData = async () => {
    const response = await getAllBranch();
    setBranchs(
      response.map((data: IBranchData) => {
        return {
          Id: data.Id,
          NameEnglish: data.NameEnglish,
        };
      })
    );
  };
  useEffect(() => {
    setBranchData();
  }, []);
  useEffect(() => {
     if(branchs.find((obj:IBranchData) => obj.NameEnglish === branch.NameEnglish) || branchs.find((obj:IBranchData) => obj.NameEnglish.toLowerCase() ===  branch.NameEnglish)){
      errorMessage(`The name ${ branch.NameEnglish} is already used...`);
    }else{
    }
  }, [branch]);
 

  return (
    <>
      <Paper
        component="form"
        sx={{ px: 2, py: 3 }}
        autoComplete="off"
        onSubmit={actionType === "add" ? addBranch : updateBranch}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InputField
              label="Branch Name (English)"
              required
              name="NameEnglish"
              value={branch && branch.NameEnglish ? branch.NameEnglish : ""}
              onChange={updateBranchFields}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              label="Branch Name (Nepali)"
              required
              name="NameNepali"
              value={
                branch && branch.NameNepali ? preeti(branch.NameNepali) : ""
              }
              onChange={updateBranchFields}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, textAlign: "end" }}>
            {actionType === "add" ? (
              <>
                <AddBtn />
                <CloseButton />
              </>
            ) : (
              <>
                <UpdateButton />
                <DeleteButton
                  onClick={() => setShowDeleteModal(!showDeleteModal)}
                />
                <CloseButton />
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <DeleteDialog
        openDialog={showDeleteModal}
        setOpenDialog={setShowDeleteModal}
        name={branch.NameEnglish ? branch.NameEnglish : ""}
        deleteData={deleteBranch}
      />
    </>
  );
};

export default BranchForm;
