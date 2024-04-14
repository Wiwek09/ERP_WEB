import { useEffect, useState } from "react";
import {
  Box
} from "@mui/material";
import DateHeader from "../../../components/headers/dateHeader";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IMasterLedger } from "../../../interfaces/masterLedger";
import {
  getAllMasterLedger, getAllUnderLedger,
} from "../../../services/masterLedgerAPI";
import MultiOptionSearchBar from "../../../utils/multiOptionSearchBar";
import { useAppSelector } from "../../../app/hooks";
import LinearProgress from "@mui/material/LinearProgress";
import MasterLedgerTable from "./components/MasterLedgerTable";
import { IBranch } from "../../../interfaces/branch";
import { getAllBranch } from "../../../services/branchApi";

const MasterLedger = () => {
  const [allData, setAllData] = useState<IMasterLedger[]>([]);
  const [loading, setloading] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const loadData = async () => {
    setloading(true);
    const ledgerData = await getAllMasterLedger();
    const underLedger = await getAllUnderLedger();
    const BranchRes: IBranch[] = await getAllBranch();
    let data: any = [];
    if (ledgerData) {
      ledgerData.forEach((elm: any, index: any) => {
        const underledgername = underLedger.find(
          (val: any) => val.Id === elm.AccountTypeId
        );
        const getBranch = BranchRes.find(
          (elms) => elms.Id === elm.BranchId
        );
        data.push({
          id: index + 1,
          Id: elm.Id,
          Name: elm.Name,
          BranchId: getBranch ? getBranch.NameEnglish : "",
          PanNo: elm.PanNo,
          Telephone:elm.Telephone,
          UnderGroupMaster: underledgername ? underledgername.Name : "",
        });
      });
    }
    setAllData(data);
    setloading(false);
  };

  const searchOptions = ["Name","UnderGroupMaster","PanNo","Telephone"];

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      {
        loginedUserRole.includes("MLAdd") ?
        <SmallGridHeader headerName="Master Ledger" path="/master-ledger/add" /> :
        <SmallGridHeader headerName="Master Ledger" path="MLADD" />
      }
      <DateHeader headerName="Master Ledger" />
      <Box
        sx={{
          position:'sticky',
          top:125,
          zIndex:3,
          py:2,
          border:'solid 1px',
          borderColor:'#d9d9d9',
          bgcolor:'primary.tableHeader'
        }}
      >
        <MultiOptionSearchBar searchOptions={searchOptions} searchData={allData} setData={setSearchedData} />
      </Box>
      {loading ? 
      <LinearProgress/>:
        <MasterLedgerTable allData={searchedData?searchedData:allData} />
      }
      {/* <SmallTableContainer Columns={Columns} Rows={allData} loading={loading} /> */}
    </>
  );
};

export default MasterLedger;
