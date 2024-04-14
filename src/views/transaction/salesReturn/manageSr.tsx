import React from "react";
import { useParams } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import { IParams } from "../../../interfaces/params";
import InputForms from "./components/inputForms";

const ManageSalesReturn = () => {
  const { id }: IParams = useParams();

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Sales Return" : "Edit Sales Return"}
        path="/sales-return"
      />
      <InputForms paramID={id} />
    </>
  );
};

export default ManageSalesReturn;
