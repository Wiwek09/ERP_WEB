import { useState } from "react";
import { useHistory } from "react-router";
import { IFinancialYear } from "../../../interfaces/financialYear";
import { addFinancial } from "../../../services/financialYearApi";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import InputForm from "./InputForm";

const AddFinancial = () => {
  const history = useHistory();
  const [financial, setFinancial] = useState<IFinancialYear>({
    Id: 0,
    Name: "",
    NepaliStartDate: "",
    NepaliEndDate: "",
    StartDate: "",
    EndDate: "",
  });

  const addNewFinancialYear = async (data: IFinancialYear) => {
    const response = await addFinancial(data);
    if (response === 1) {
      successMessage();
      history.push("/");
    } else {
      errorMessage();
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    addNewFinancialYear(financial);
  };

  return (
    <>
      <InputForm data={financial} setData={setFinancial} onSubmit={onSubmit} />
    </>
  );
};

export default AddFinancial;
