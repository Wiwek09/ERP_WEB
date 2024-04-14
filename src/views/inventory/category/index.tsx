import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { ICategory } from "../../../interfaces/category";
import { getAllCategory } from "../../../services/categoryApi";
import StyledLink from "../../../utils/link/styledLink";

const Category = () => {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const getCategoryList = async () => {
    setLoading(true);
    const response = await getAllCategory();
    setCategory(
      response &&
        response.map((category: ICategory, index: number) => ({
          ...category,
          id: index + 1,
        }))
    );
    setLoading(false);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme---header",
    },
    {
      field: "Name",
      width: 600,
      headerName: "Category Name",
      headerClassName: "super-app-theme---header",
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
            <StyledLink to={`/category/${params.row.Id}`}>
              <Tooltip title="Edit" followCursor={true}>
                <IconButton color="success">
                  <BiEditAlt />
                </IconButton>
              </Tooltip>
            </StyledLink>
          </>
        );
      },
    },
  ];

  return (
    <>
      {
        loginedUserRole.includes("CategoryAdd") ?
        <SmallGridHeader headerName="Category" path="category/add" /> :
        <SmallGridHeader headerName="Category" path="CATADD" />
      }
      
      <SmallTableContainer
        loading={loading}
        Rows={category ? category : []}
        Columns={Columns}
      />
    </>
  );
};

export default Category;
