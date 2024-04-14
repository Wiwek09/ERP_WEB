import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import { IBillTerm } from "../../../interfaces/billTerm";
import { IParams } from "../../../interfaces/params";
import {
  addBillTerm,
  deleteBillTerm,
  editBillTerm,
  getAllBillTerm,
  getBillTermById,
} from "../../../services/billTermApi";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import SingleInputForm from "./components/SingleInputForm";
import { InitialState } from "./components/initialState";

const ManageBillTerm = () => {
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [allBillTerm, setAllBillTerm] = useState<IBillTerm[]>([]);
  const [billTerm, setBillTerm] = useState<IBillTerm>(InitialState);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const { id }: IParams = useParams();

  const onSubmit = async (e: any) => {
    setOpenSaveDialog(true);
    e.preventDefault();
    if (id === "add") {
      if (
        allBillTerm.find((obj: IBillTerm) => obj.Name === billTerm.Name) ||
        allBillTerm.find((obj) => obj.Name.toLowerCase() === billTerm.Name)
      ) {
        setOpenSaveDialog(false);
        errorMessage(`The name ${billTerm.Name} is already used...`);
      } else {
        addBillTerm(billTerm).then((response) => {
          if (response === 1) {
            setOpenSaveDialog(false);
            setBillTerm(InitialState);
            successMessage();
            history.push("/bill-term");
          } else {
            setOpenSaveDialog(false);
            errorMessage();
          }
        });
      }
    } else {
      editBillTerm(id, billTerm).then((response) => {
        if (response === 1) {
          setOpenSaveDialog(false);
          setBillTerm(InitialState);
          successMessage();
          history.push("/bill-term");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      });
    }
  };

  const getBillTerm = () => {
    getBillTermById(id).then((response) => {
      if (response != null) {
        setBillTerm(response);
      } else {
        errorMessage("Sorry! searched data not found");
        history.push("/bill-term");
      }
    });
  };

  useEffect(() => {
    getAllBillTerm().then((response) => {
      setAllBillTerm(response);
    });
  }, []);

  useEffect(() => {
    if (id === "add" && loginedUserRole.includes("BTAdd")) {
      return;
    } else if (id !== "add" && loginedUserRole.includes("BTEdit")) {
      getBillTerm();
    } else {
      history.push("/bill-term");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);

  const removeBillTerm = async () => {
    deleteBillTerm(id).then((response) => {
      history.push("/bill-term");
    });
  };

  return (
    <>
      <SingleInputForm
        headerName="Bill Term"
        data={billTerm}
        setData={setBillTerm}
        action={id}
        onSubmit={onSubmit}
        deleteFunction={removeBillTerm}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageBillTerm;
