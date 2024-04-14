import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import SmallTableContainer from "../../../components/dataGrid";
import DateHeader from "../../../components/headers/dateHeader";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { ITransactionType } from "../../../interfaces/transactionType";
import { getAllTransactionType } from "../../../services/transactionTypeApi";
import StyledLink from "../../../utils/link/styledLink";

const TransactionType = () => {
  const [allData, setAllData] = useState<ITransactionType[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setloading(true);
      const res: ITransactionType[] = await getAllTransactionType();
      let data: any = [];
      res.forEach((elm, i) => {
        data.push({
          id: i + 1,
          Id: elm.Id,
          Name: elm.Name,
        });
      });
      setAllData(data);
      setloading(false);
    };
    loadData();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 300,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 450,
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
              <StyledLink to={`/transaction-type/${params.row.Id}`}>
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
      <SmallGridHeader
        headerName="Transaction Type"
        path="/transaction-type/add"
      />
      <DateHeader headerName="Transaction Type" />
      <SmallTableContainer Columns={Columns} Rows={allData} loading={loading} />
    </>
  );
};

export default TransactionType;
