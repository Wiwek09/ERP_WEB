import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IUnderGroupLedger } from "../../../interfaces/underGroupLedger";
import { getAllBillTerm } from "../../../services/billTermApi";
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import StyledLink from "../../../utils/link/styledLink";
import { errorMessage } from "../../../utils/messageBox/Messages";
import {
  amountType,
  applicableOn,
  termType,
} from "../transactionType/helper/types";

const BillTerm = () => {
  const history = useHistory();
  const [allData, setAllData] = useState<IUnderGroupLedger[]>([]);
  const [loading, setloading] = useState(false);
  const [ledgerData, setLedgerData] = useState<Array<any>>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  useEffect(() => {
    if (loginedUserRole.includes("BTView")) {
      setloading(true);
      getAllMasterLedger().then((data) => {
        setloading(false);
        if (data) {
          let ledgerData: any = data.map((elm: any) => {
            return {
              value: elm.Id.toString(),
              label: elm.Name,
            };
          });
          setLedgerData(ledgerData);
        }
      });
    } else {
      history.push("/");
      errorMessage("Sorry! permission is denied");
    }
  }, []);

  useEffect(() => {
    setloading(true);
    getAllBillTerm().then((response) => {
      setloading(false);
      const data: any = response.map((item: any) => {
        const forData = applicableOn.find(
          (el) => el.value === item.ApplicableOn
        );
        const termData = termType.find((el) => el.value === item.TermType);
        const typeData = amountType.find((el) => el.value === item.Type);
        const linkedLedger = ledgerData.find(
          (el) => el.value === item.LinkedLedgerId
        );
        return {
          id: item.Id,
          name: item.Name,
          type: typeData ? typeData.label : "",
          forData: forData ? forData.label : "",
          rate: item.Rate,
          term_type: termData ? termData.label : "",
          linked_ledger: linkedLedger ? linkedLedger.label : "",
        };
      });
      setAllData(data);
    });
  }, [ledgerData]);

  const Columns = [
    {
      field: "id",
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      width: 240,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "type",
      width: 200,
      headerName: "Type",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "forData",
      width: 200,
      headerName: "For",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "rate",
      width: 200,
      headerName: "Rate",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "term_type",
      width: 200,
      headerName: "Term Type",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "linked_ledger",
      width: 200,
      headerName: "Linked Ledger",
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
              <StyledLink to={`/bill-term/${params.row.id}`}>
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
      {loginedUserRole.includes("BTAdd") ? (
        <SmallGridHeader headerName="Bill Terms" path="/bill-term/add" />
      ) : (
        <SmallGridHeader headerName="Bill Terms" addDisable={true} />
      )}

      <SmallTableContainer Columns={Columns} Rows={allData} loading={loading} />
    </>
  );
};

export default BillTerm;
