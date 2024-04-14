import React from "react";
import { useParams } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import { IParams } from "../../../interfaces/params";
import InputForms from "./components/inputForms";

const ManagePurchaseReturn = () => {
  const { id }: IParams = useParams();

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Purchase return" : "Edit Purchase return"}
        path="/purchase-return"
      />
      <InputForms paramID={id} />
    </>
  );
};

export default ManagePurchaseReturn;
