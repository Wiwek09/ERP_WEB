import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import SmallTableContainer from "../../../components/dataGrid";
import DateHeader from "../../../components/headers/dateHeader";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { getAllUnderLedger } from "../../../services/masterLedgerAPI";
import StyledLink from "../../../utils/link/styledLink";
import { IUnderGroupLedger } from "../../../interfaces/underGroupLedger";

const GroupLedger = () => {
  const [allData, setAllData] = useState<IUnderGroupLedger[]>([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setloading(true);
      const GroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
      const UnderGroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
      let data: any = [];
      GroupLedger.forEach((elm: any, i: any) => {
        const underledgername = UnderGroupLedger.find(
          (val) => val.Id == elm.UnderGroupLedger
        );
        data.push({
          id: i + 1,
          Id: elm.Id,
          Name: elm.Name,
          NatureOfGroup: elm.NatureofGroup,
          UnderGroupLedger: underledgername ? underledgername.Name : "",
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
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 240,
      headerName: "Group Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "UnderGroupLedger",
      width: 200,
      headerName: "UnderGroup Ledger",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "NatureOfGroup",
      width: 200,
      headerName: "Nature Of Group",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Action",
      width: 150,
      sortable: false,
      type: "number",
      headerClassName: "super-app-theme--header",

      renderCell: (params: any) => {
        return (
          <>
            <IconButton>
              <StyledLink to={`/group-ledger/${params.row.Id}`}>
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
      <SmallGridHeader headerName="Group Ledger" path="/group-ledger/add" />
      <DateHeader headerName="Group Ledger" />

      <SmallTableContainer Columns={Columns} Rows={allData} loading={loading} />
    </>
  );
};

export default GroupLedger;
