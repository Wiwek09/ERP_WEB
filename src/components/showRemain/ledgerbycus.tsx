import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { getCurrentFinancialYear } from "../../features/financialYearSlice";
import { IDate } from "../../views/transaction/invoice/interfaces";
import { getLedgerDetail } from "../../services/ledgerDetailApi";
import { errorMessage } from "../../utils/messageBox/Messages";
interface IProps {
  cusID: number;
};

const Ledgerbycus = ({ cusID }: IProps) => {
  const { Name } = useAppSelector(getCurrentFinancialYear);
  const financialYear = useAppSelector((state) => state.financialYear);
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const [date, setDate] = useState<IDate>(
    defaultDate.EndDate === ""
      ? {
          StartDate: financialYear.NepaliStartDate,
          EndDate: financialYear.NepaliEndDate,
        }
      : defaultDate
  );
  const [ledgerDetails, setLedgerDetails] = useState<any[]>([]);

  const totalDebit = ledgerDetails?.reduce((pre: any, nvalue: any) => {
    return pre + nvalue.Debit;
  }, 0);
  const totalCredit = ledgerDetails?.reduce((pre: any, nvalue: any) => {
    return pre + nvalue.Credit;
  }, 0);
  useEffect(() => {
    const loadData = async () => {
      const res = await getLedgerDetail(
        cusID, 
        Name,
        date.StartDate, 
        date.EndDate);
      
      if (res) {
        setLedgerDetails(res)
      }else{
        errorMessage("No Data Available");
      }
    }
    loadData();
  },[cusID])

  let minus = (Number(totalCredit) - Number(totalDebit));
  return (
    <>
      <div style={{
        height: "38px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}>
        {minus > 0
          ?
          <h4 style={{color: "red"}}>
            {Math.abs(minus).toFixed(2) + " CR"}
          </h4>
          :
          <h4 style={{color: "red"}}>
            {Math.abs(minus).toFixed(2) + " DR"}
          </h4>
        }
      </div>
    </>
  );
};
export default Ledgerbycus;