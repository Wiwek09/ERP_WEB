import { useEffect, useState } from "react";
import {
  Box, LinearProgress
} from "@mui/material";
import { IMasterLedger } from "../../../interfaces/masterLedger";
import { useAppSelector } from "../../../app/hooks";
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import DateHeader from "../../../components/headers/dateHeader";
import MultiOptionSearchBar from "../../../utils/multiOptionSearchBar";
import LedgerData from "../masterLedger/components/LedgerData";

const MasterLedger2 = () => {
  const [allData, setAllData] = useState<IMasterLedger[]>([]);
  const [loading, setloading] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const loadData = async () => {
    setloading(true);
    const ledgerData = await getAllMasterLedger();
    let data: any = [];
    ledgerData.forEach((elm:any, index:any) => {
        data.push({
            id: index + 1,
            Id: elm.Id,
            Name: elm.Name,
            PanNo: elm.PanNo,
            Telephone:elm.Telephone
        });
    });
    setAllData(
      data
    );
    setloading(false);
  };

  const searchOptions = ["Name","PanNo","Telephone"];

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
        <LedgerData allData={searchedData?searchedData:allData} />
      }
    </>
  );
};

export default MasterLedger2;
