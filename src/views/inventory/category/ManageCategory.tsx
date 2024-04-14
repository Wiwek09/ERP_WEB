import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getAllCategory, getCategory } from "../../../services/categoryApi";
import SingleInputForm from "../components/SingleInputForm";
import { ICategory } from "../../../interfaces/category";
import { IParams } from "../../../interfaces/params";
import {
  addNewCategory,
  updateCategory,
  _deleteCategory_,
} from "./helperFunction";
import { useAppSelector } from "../../../app/hooks";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageCategory = () => {
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [allCategory, setAllCategory] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<ICategory>({
    Id: 0,
    Name: "",
  });
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const { id }: IParams = useParams();
  const getData = async () => {
    const response = await getCategory(id);
    if (response) {
      setCategory(response);
    }
  };

  const onSubmit = async (e: any) => {
    setOpenSaveDialog(true);
    e.preventDefault();
    if (id === "add") {
      if (
        allCategory.find((obj: ICategory) => obj.Name === category.Name) ||
        allCategory.find((obj) => obj.Name.toLowerCase() === category.Name)
      ) {
        setOpenSaveDialog(false);
        errorMessage(`The name ${category.Name} is already used...`);
      } else {
        addNewCategory(category, setCategory);
        setOpenSaveDialog(false);
      }
    } else {
      const response = await updateCategory(id, category);
      if (response) {
        setOpenSaveDialog(false);
        history.push("/category");
      }
    }
  };

  const getCategoryList = async () => {
    const response = await getAllCategory();
    setAllCategory(
      response &&
        response.map((category: ICategory) => ({
          Name: category.Name,
          Id: category.Id,
        }))
    );
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (loginedUserRole.includes("CategoryAdd")) {
      if (id === "add") {
        return;
      } else {
        getData();
      }
    } else {
      history.push("/category");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);

  const deleteCategory = async () => {
    const response = await _deleteCategory_(id);
    if (response) {
      history.push("/category");
    }
  };

  return (
    <>
      <SingleInputForm
        headerName="Category"
        data={category}
        setData={setCategory}
        action={id}
        onSubmit={onSubmit}
        deleteFunction={deleteCategory}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageCategory;
