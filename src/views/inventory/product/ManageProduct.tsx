import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import { IParams } from "../../../interfaces/params";
import { IProduct } from "../../../interfaces/product";
import {
  addProduct,
  editProduct,
  getProduct,
} from "../../../services/productApi";
import { addNewProduct, updateProduct } from "./components/helperFunctions";
import { InitialProductData } from "./components/initialState";
import ProductForm from "./components/ProductForm";
import { useAppSelector } from "../../../app/hooks";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageProduct = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const companyData = useAppSelector((state) => state.company.data);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const [product, setProduct] = useState<IProduct>({
    ...InitialProductData,
    ExciseDuty: companyData.ExciseDuty,
    TaxRate: companyData.VATRate,
  });
  const getProductData = async () => {
    const response = await getProduct(id);
    if (response) {
      setProduct(response);
    }
  };

  useEffect(() => {
    if (loginedUserRole.includes("ProductAdd")) {
      if (id === "add") {
      } else {
        getProductData();
      }
    } else {
      history.push("/products");
      errorMessage("Sorry! permission is denied");
    }
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      const response = await addProduct(product);
      if (response === -1) {
        setOpenSaveDialog(false);
        errorMessage("Operation failed. Please try again later.");
      } else {
        setProduct({
          ...InitialProductData,
          ExciseDuty: companyData.ExciseDuty,
          TaxRate: companyData.VATRate,
          MenuItemPortions: [
            {
              Id: 0,
              Name: "",
              MenuItemPortionId: 0,
              Multiplier: 0,
              Price: 0,
              Discount: 0,
              OpeningStockRate: 0,
              OpeningStock: 0,
              OpeningStockAmount: 0,
              StockLimit: 0,
              ItemCode: "",
              MenuItemPortionPriceRanges: [
                {
                  Id: 0,
                  PositionId: 0,
                  QtyMin: 0,
                  QtyMax: 0,
                  Price: 0,
                },
              ],
            },
          ],
        });
      }
      setOpenSaveDialog(false);
    } else {
      const response = await editProduct(id, product);
      if (response > 0) {
        setOpenSaveDialog(false);
        history.push("/products");
      } else {
        if (response === -1) {
          setOpenSaveDialog(false);
          errorMessage("Sorry, Product Item was same.");
        }
        if (response === -2) {
          setOpenSaveDialog(false);
          errorMessage("Sorry, Product Portion Item was same.");
        }
      }
    }
  };

  return (
    <>
      <FormHeader headerName={id === "add" ? "Add Product" : "Edit Product"} />
      <ProductForm data={product} setData={setProduct} onSubmit={onSubmit} />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageProduct;
