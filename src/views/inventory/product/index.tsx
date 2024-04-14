import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IProduct } from "../../../interfaces/product";
import { getAllProducts } from "../../../services/productApi";
import StyledLink from "../../../utils/link/styledLink";
import ProductTable from "./components/ProductTable";
import LinearProgress from "@mui/material/LinearProgress";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const getProductList = async () => {
    setLoading(true);
    const response = await getAllProducts();
    if (response) {
      setProducts(
        response.map((product: IProduct, index: string) => ({
          id: index + 1,
          ...product,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getProductList();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 150,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 350,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "Action",
      width: 200,
      sortable: false,
      type: "number",
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => {
        return (
          <>
            <IconButton>
              <StyledLink to={`/products/${params.row.Id}`}>
                <Tooltip title="Edit" followCursor={true}>
                  <IconButton color="success">
                    <BiEditAlt />
                  </IconButton>
                </Tooltip>
              </StyledLink>
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
      {loginedUserRole.includes("ProductAdd") ? (
        <SmallGridHeader
          searchData={products}
          setData={setSearchedData}
          headerName="Products"
          path="/products/add"
        />
      ) : (
        <SmallGridHeader
          searchData={products}
          setData={setSearchedData}
          headerName="Products"
          path="PROADD"
        />
      )}
      {loading ? (
        <LinearProgress />
      ) : (
        <ProductTable allData={searchedData ? searchedData : products} />
      )}
      {/* <SmallTableContainer
        loading={loading}
        Rows={products}
        Columns={Columns}
      /> */}
    </>
  );
};

export default Product;
