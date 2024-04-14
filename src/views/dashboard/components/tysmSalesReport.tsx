import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { IUnderGroupLedger } from "../../../interfaces/underGroupLedger";
import { getAllAccountBalance } from "../../../services/accountApi";
import { getAllUnderLedger } from "../../../services/masterLedgerAPI";
import { errorMessage } from "../../../utils/messageBox/Messages";
import {
  getNepaliDate,
  getYesNepaliDate,
  getLasSevNepaliDate,
  getLasMonNepaliDate,
} from "../../../utils/nepaliDate/index";

interface Data {
  Name: string;
  Amount: number;
  child0: child01[];
  child: child02[];
}
interface child01 {
  Id: number;
  Name: string;
  Amount: number;
  AccountTypeId: number;
}
interface child02 {
  child01: child03[];
  child02: child03[];
  child03: child03[];
}
interface child03 {
  Id: number;
  Name: string;
  Amount: number;
  AccountTypeId: number;
}

export default function SalesReportTable() {
  const [allTExpansesC, setTAllExpansesC] = useState<Data[]>([]);
  const [allTIncomeC, setTAllIncomeC] = useState<Data[]>([]);
  const [allTExpanses, setAllTExpanses] = useState<Data[]>([]);
  const [allTIncome, setAllTIncome] = useState<Data[]>([]);

  const [allYExpanses, setYAllExpanses] = useState<Data[]>([]);
  const [allYIncome, setAllYIncome] = useState<Data[]>([]);
  const [yExpanses, setYExpanses] = useState<Data[]>([]);
  const [yIncome, setYIncome] = useState<Data[]>([]);

  const [allWExpanses, setWAllExpanses] = useState<Data[]>([]);
  const [allWIncome, setAllWIncome] = useState<Data[]>([]);
  const [wExpanses, setWExpanses] = useState<Data[]>([]);
  const [wIncome, setWIncome] = useState<Data[]>([]);

  const [allMExpanses, setMAllExpanses] = useState<Data[]>([]);
  const [allMIncome, setAllMIncome] = useState<Data[]>([]);
  const [mExpanses, setMExpanses] = useState<Data[]>([]);
  const [mIncome, setMIncome] = useState<Data[]>([]);

  //for Sales Cash and Credit Sales
  const [allTCashSales, setAllTCashSales] = useState([]);
  const [allTCreditSales, setAllTCreditSales] = useState([]);
  const [allYCashSales, setAllYCashSales] = useState([]);
  const [allYCreditSales, setAllYCreditSales] = useState([]);
  const [allWCashSales, setAllWCashSales] = useState([]);
  const [allWCreditSales, setAllWCreditSales] = useState([]);
  const [allMCashSales, setAllMCashSales] = useState([]);
  const [allMCreditSales, setAllMCreditSales] = useState([]);

  useEffect(() => {
    let today = getNepaliDate();
    let yesterday = getYesNepaliDate();
    let sevDay = getLasSevNepaliDate();
    let monDay = getLasMonNepaliDate();
    const load = async () => {
      const GroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
      const ress: any = await getAllAccountBalance(today, today);
      loadData(ress, GroupLedger);
      const resss: any = await getAllAccountBalance(yesterday, yesterday);
      loadDatas(resss, GroupLedger);
      const ressss: any = await getAllAccountBalance(sevDay, today);
      loadDatass(ressss, GroupLedger);
      const resssss: any = await getAllAccountBalance(monDay, today);
      loadDatasss(resssss, GroupLedger);
    };
    load();
  }, []);

  const loadDatasss = (res: any, GL: any) => {
    if (res.length > 0) {
      //for cash and credit Sales only
      const getCreditSalesM = res.filter((data: any) => {
        return data.BusinesType === "Credit Sales " && data.Amount > 0;
      });
      setAllMCreditSales(getCreditSalesM);
      const getCashSalesM = res.filter((data: any) => {
        return data.BusinesType === "Cash Sales " && data.Amount > 0;
      });
      setAllMCashSales(getCashSalesM);
      //for profit part
      const filterdExp = res.filter((data: any) => {
        return data.Name.includes("Opening Stock");
      });
      setMExpanses(filterdExp[0].Amount);
      const filterdInc = res.filter((data: any) => {
        return data.Name.includes("Closing Stock");
      });
      setMIncome(filterdInc[0].Amount);
      if (res.length > 2) {
        let MEchildren: any = [];
        let MIchildren: any = [];
        let ichildrenpr: any = [];
        let ichildrencr: any = [];
        const getExpansesFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Expenses" || "Assets") &&
            datas.AccountTypeId > 0
          );
        });
        if (getExpansesFromAPI.length > 0) {
          const filtersingleE = getExpansesFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );
          for (var i = 0; i < filtersingleE.length; i++) {
            let ATI = filtersingleE[i];
            ichildrenpr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getExpansesFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });

            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes(
                  "Taxable Purchase" || "Non Taxable Purchase"
                ) && datas.Amount <= 0
              );
            });
            if (getReturnVlaues.length === 0) {
              let oldArray = [...getFilterChild1];
              for (var a = 0; a < getFilterChild1.length; a++) {
                ichildrenpr.push({
                  Name: oldArray[a].Name,
                  Amount: Math.abs(oldArray[a].Amount),
                  OldAmt: "",
                });
              }
            } else {
              const taxablePurP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount > 0;
              });
              const taxablePurN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount < 0;
              });
              const ntaxablePurP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount > 0
                );
              });
              const ntaxablePurN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];
              //sum of taxP
              const totalPurP = taxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalPurN = taxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxablePurP.length > 0 && taxablePurN.length > 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: "",
                  OldAmt: totalPurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurN.toFixed(2),
                });
              }
              //if no return
              else if (taxablePurP.length > 0 && taxablePurN.length === 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxablePurP.length === 0 && taxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: Number(totalPurN).toFixed(2),
                  OldAmt: Number(totalPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnPurP = ntaxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnPurN = ntaxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              //nontaxable and return has.
              if (ntaxablePurP.length > 0 && ntaxablePurN.length > 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: "",
                  OldAmt: ntaxablePurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxablePurP.length > 0 && ntaxablePurN.length === 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxablePurP.length === 0 && ntaxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: Number(totalnPurN).toFixed(2),
                  OldAmt: Number(totalnPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Non Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Purchase" &&
                  data.Name !== "Non Taxable Purchase"
                );
              });
              if (otherExpanses.length > 0) {
                for (var h = 0; h < otherExpanses.length; h++) {
                  ichildrenpr.push({
                    Name: otherExpanses[h].Name,
                    Amount: otherExpanses[h].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              }
            }

            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Expenses") {
              } else {
                MEchildren.push({
                  child01: ichildrenpr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var j = 0; j < filterSingle.length; j++) {
                let ATID = filterSingle[j];
                const gparent = GL.filter((dats: any) => {
                  return dats.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Expenses") {
                    MEchildren.push({
                      child01: ichildrenpr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  }
                } else {
                  errorMessage("Code Error. Need More Action....");
                }
              }
            }
          }
          if (MEchildren.length > 0) {
            setMAllExpanses(
              MEchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setMAllExpanses([]);
          }
        } else {
          if (MEchildren.length > 0) {
          } else {
            setMAllExpanses([]);
          }
        }
        const getIncomeFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Income" || "Liabilities") &&
            datas.AccountTypeId > 0
          );
        });

        if (getIncomeFromAPI.length > 0) {
          const filtersingleI = getIncomeFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );

          for (var k = 0; k < filtersingleI.length; k++) {
            let ATI = filtersingleI[k];
            ichildrencr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getIncomeFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });

            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes("Taxable Sales" || "Non Taxable Sales") &&
                datas.Amount <= 0
              );
            });
            if (getReturnVlaues === null) {
              let oldArray = [...getFilterChild1];
              for (var c = 0; c < getFilterChild1.length; c++) {
                ichildrencr.push({
                  Name: oldArray[c].Name,
                  Amount: oldArray[c].Amount,
                  OldAmt: "",
                });
              }
            } else {
              const taxableSalP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount > 0;
              });
              const taxableSalN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount < 0;
              });
              const ntaxableSalP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount > 0
                );
              });
              const ntaxableSalN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];

              //sum of taxP
              const totalSalP = taxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalSalN = taxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxableSalP.length > 0 && taxableSalN.length > 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalN.toFixed(2),
                });
              }
              //if no return
              else if (taxableSalP.length > 0 && taxableSalN.length === 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxableSalP.length === 0 && taxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: Number(totalSalN).toFixed(2),
                  OldAmt: Number(totalSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnSalP = ntaxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnSalN = ntaxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //nontaxable and return has.
              if (ntaxableSalP.length > 0 && ntaxableSalN.length > 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalnSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxableSalP.length > 0 && ntaxableSalN.length === 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxableSalP.length === 0 && ntaxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: Number(totalnSalN).toFixed(2),
                  OldAmt: Number(totalnSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Non Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Sales" &&
                  data.Name !== "Non Taxable Sales"
                );
              });
              if (otherExpanses.length > 0) {
                for (var d = 0; d < otherExpanses.length; d++) {
                  ichildrencr.push({
                    Name: otherExpanses[d].Name,
                    Amount: otherExpanses[d].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }

            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Incomes") {
              } else {
                MIchildren.push({
                  child01: ichildrencr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var l = 0; l < filterSingle.length; l++) {
                let ATID = filterSingle[l];
                const gparent = GL.filter((dat: any) => {
                  return dat.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Incomes") {
                    MIchildren.push({
                      child01: ichildrencr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error Need More Action ...");
                }
              }
            }
          }
          if (MIchildren.length > 0) {
            setAllMIncome(
              MIchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setAllMIncome([]);
          }
        } else {
          if (MIchildren.length > 0) {
          } else {
            setAllMIncome([]);
          }
        }
      } else {
        setMAllExpanses([]);
        setAllMIncome([]);
      }
    } else {
      setMExpanses([]);
      setMIncome([]);
      setMAllExpanses([]);
      setAllMIncome([]);
    }
  };
  const loadDatass = (res: any, GL: any) => {
    if (res.length > 0) {
      //for cash and credit Sales only
      const getCreditSalesW = res.filter((data: any) => {
        return data.BusinesType === "Credit Sales " && data.Amount > 0;
      });
      setAllWCreditSales(getCreditSalesW);
      const getCashSalesW = res.filter((data: any) => {
        return data.BusinesType === "Cash Sales " && data.Amount > 0;
      });
      setAllWCashSales(getCashSalesW);
      //for profit part
      const filterdExp = res.filter((data: any) => {
        return data.Name.includes("Opening Stock");
      });
      setWExpanses(filterdExp[0].Amount);
      const filterdInc = res.filter((data: any) => {
        return data.Name.includes("Closing Stock");
      });
      setWIncome(filterdInc[0].Amount);
      if (res.length > 2) {
        let WEchildren: any = [];
        let WIchildren: any = [];
        let ichildrenpr: any = [];
        let ichildrencr: any = [];
        const getExpansesFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Expenses" || "Assets") &&
            datas.AccountTypeId > 0
          );
        });
        if (getExpansesFromAPI.length > 0) {
          const filtersingleE = getExpansesFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );
          for (var i = 0; i < filtersingleE.length; i++) {
            let ATI = filtersingleE[i];
            ichildrenpr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getExpansesFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes(
                  "Taxable Purchase" || "Non Taxable Purchase"
                ) && datas.Amount <= 0
              );
            });
            if (getReturnVlaues.length === 0) {
              let oldArray = [...getFilterChild1];
              for (var a = 0; a < getFilterChild1.length; a++) {
                ichildrenpr.push({
                  Name: oldArray[a].Name,
                  Amount: Math.abs(oldArray[a].Amount),
                  OldAmt: "",
                });
              }
            } else {
              const taxablePurP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount > 0;
              });
              const taxablePurN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount < 0;
              });
              const ntaxablePurP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount > 0
                );
              });
              const ntaxablePurN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];
              //sum of taxP
              const totalPurP = taxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalPurN = taxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxablePurP.length > 0 && taxablePurN.length > 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: "",
                  OldAmt: totalPurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurN.toFixed(2),
                });
              }
              //if no return
              else if (taxablePurP.length > 0 && taxablePurN.length === 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxablePurP.length === 0 && taxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: Number(totalPurN).toFixed(2),
                  OldAmt: Number(totalPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnPurP = ntaxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnPurN = ntaxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              //nontaxable and return has.
              if (ntaxablePurP.length > 0 && ntaxablePurN.length > 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: "",
                  OldAmt: ntaxablePurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxablePurP.length > 0 && ntaxablePurN.length === 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxablePurP.length === 0 && ntaxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: Number(totalnPurN).toFixed(2),
                  OldAmt: Number(totalnPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Non Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Purchase" &&
                  data.Name !== "Non Taxable Purchase"
                );
              });
              if (otherExpanses.length > 0) {
                for (var h = 0; h < otherExpanses.length; h++) {
                  ichildrenpr.push({
                    Name: otherExpanses[h].Name,
                    Amount: otherExpanses[h].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Expenses") {
              } else {
                WEchildren.push({
                  child01: ichildrenpr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var j = 0; j < filterSingle.length; j++) {
                let ATID = filterSingle[j];
                const gparent = GL.filter((dats: any) => {
                  return dats.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Expenses") {
                    WEchildren.push({
                      child01: ichildrenpr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error. Need More Action....");
                }
              }
            }
          }
          if (WEchildren.length > 0) {
            setWAllExpanses(
              WEchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setWAllExpanses([]);
          }
        } else {
          if (WEchildren.length > 0) {
          } else {
            setWAllExpanses([]);
          }
        }
        const getIncomeFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Income" || "Liabilities") &&
            datas.AccountTypeId > 0
          );
        });

        if (getIncomeFromAPI.length > 0) {
          const filtersingleI = getIncomeFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );

          for (var k = 0; k < filtersingleI.length; k++) {
            let ATI = filtersingleI[k];
            ichildrencr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getIncomeFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes("Taxable Sales" || "Non Taxable Sales") &&
                datas.Amount <= 0
              );
            });
            if (getReturnVlaues === null) {
              let oldArray = [...getFilterChild1];
              for (var c = 0; c < getFilterChild1.length; c++) {
                ichildrencr.push({
                  Name: oldArray[c].Name,
                  Amount: oldArray[c].Amount,
                  OldAmt: "",
                });
              }
            } else {
              const taxableSalP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount > 0;
              });
              const taxableSalN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount < 0;
              });
              const ntaxableSalP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount > 0
                );
              });
              const ntaxableSalN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];

              //sum of taxP
              const totalSalP = taxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalSalN = taxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxableSalP.length > 0 && taxableSalN.length > 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalN.toFixed(2),
                });
              }
              //if no return
              else if (taxableSalP.length > 0 && taxableSalN.length === 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxableSalP.length === 0 && taxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: Number(totalSalN).toFixed(2),
                  OldAmt: Number(totalSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnSalP = ntaxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnSalN = ntaxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //nontaxable and return has.
              if (ntaxableSalP.length > 0 && ntaxableSalN.length > 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalnSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxableSalP.length > 0 && ntaxableSalN.length === 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxableSalP.length === 0 && ntaxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: Number(totalnSalN).toFixed(2),
                  OldAmt: Number(totalnSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Non Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Sales" &&
                  data.Name !== "Non Taxable Sales"
                );
              });
              if (otherExpanses.length > 0) {
                for (var d = 0; d < otherExpanses.length; d++) {
                  ichildrencr.push({
                    Name: otherExpanses[d].Name,
                    Amount: otherExpanses[d].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Incomes") {
              } else {
                WIchildren.push({
                  child01: ichildrencr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var l = 0; l < filterSingle.length; l++) {
                let ATID = filterSingle[l];
                const gparent = GL.filter((dat: any) => {
                  return dat.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Incomes") {
                    WIchildren.push({
                      child01: ichildrencr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error Need More Action ...");
                }
              }
            }
          }
          if (WIchildren.length > 0) {
            setAllWIncome(
              WIchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setAllWIncome([]);
          }
        } else {
          if (WIchildren.length > 0) {
          } else {
            setAllWIncome([]);
          }
        }
      } else {
        setWAllExpanses([]);
        setAllWIncome([]);
      }
    } else {
      setWExpanses([]);
      setWIncome([]);
      setWAllExpanses([]);
      setAllWIncome([]);
    }
  };
  const loadDatas = (res: any, GL: any) => {
    if (res.length > 0) {
      //for cash and credit Sales only
      const getCreditSalesY = res.filter((data: any) => {
        return data.BusinesType === "Credit Sales " && data.Amount > 0;
      });
      setAllYCreditSales(getCreditSalesY);
      const getCashSalesY = res.filter((data: any) => {
        return data.BusinesType === "Cash Sales " && data.Amount > 0;
      });
      setAllYCashSales(getCashSalesY);
      //for profit part
      const filterdExp = res.filter((data: any) => {
        return data.Name.includes("Opening Stock");
      });
      setYExpanses(filterdExp[0].Amount);
      const filterdInc = res.filter((data: any) => {
        return data.Name.includes("Closing Stock");
      });
      setYIncome(filterdInc[0].Amount);
      if (res.length > 2) {
        let YEchildren: any = [];
        let YIchildren: any = [];
        let ichildrenpr: any = [];
        let ichildrencr: any = [];
        const getExpansesFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Expenses" || "Assets") &&
            datas.AccountTypeId > 0
          );
        });
        if (getExpansesFromAPI.length > 0) {
          const filtersingleE = getExpansesFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );
          for (var i = 0; i < filtersingleE.length; i++) {
            let ATI = filtersingleE[i];
            ichildrenpr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getExpansesFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes(
                  "Taxable Purchase" || "Non Taxable Purchase"
                ) && datas.Amount <= 0
              );
            });
            if (getReturnVlaues.length === 0) {
              let oldArray = [...getFilterChild1];
              for (var a = 0; a < getFilterChild1.length; a++) {
                ichildrenpr.push({
                  Name: oldArray[a].Name,
                  Amount: Math.abs(oldArray[a].Amount),
                  OldAmt: "",
                });
              }
            } else {
              const taxablePurP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount > 0;
              });
              const taxablePurN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount < 0;
              });
              const ntaxablePurP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount > 0
                );
              });
              const ntaxablePurN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];
              //sum of taxP
              const totalPurP = taxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalPurN = taxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxablePurP.length > 0 && taxablePurN.length > 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: "",
                  OldAmt: totalPurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurN.toFixed(2),
                });
              }
              //if no return
              else if (taxablePurP.length > 0 && taxablePurN.length === 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxablePurP.length === 0 && taxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: Number(totalPurN).toFixed(2),
                  OldAmt: Number(totalPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnPurP = ntaxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnPurN = ntaxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              //nontaxable and return has.
              if (ntaxablePurP.length > 0 && ntaxablePurN.length > 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: "",
                  OldAmt: ntaxablePurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxablePurP.length > 0 && ntaxablePurN.length === 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxablePurP.length === 0 && ntaxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: Number(totalnPurN).toFixed(2),
                  OldAmt: Number(totalnPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Non Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Purchase" &&
                  data.Name !== "Non Taxable Purchase"
                );
              });
              if (otherExpanses.length > 0) {
                for (var h = 0; h < otherExpanses.length; h++) {
                  ichildrenpr.push({
                    Name: otherExpanses[h].Name,
                    Amount: otherExpanses[h].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Expenses") {
              } else {
                YEchildren.push({
                  child01: ichildrenpr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var j = 0; j < filterSingle.length; j++) {
                let ATID = filterSingle[j];
                const gparent = GL.filter((dats: any) => {
                  return dats.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Expenses") {
                    YEchildren.push({
                      child01: ichildrenpr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error. Need More Action....");
                }
              }
            }
          }
          if (YEchildren.length > 0) {
            setYAllExpanses(
              YEchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setYAllExpanses([]);
          }
        } else {
          if (YEchildren.length > 0) {
          } else {
            setYAllExpanses([]);
          }
        }
        const getIncomeFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Income" || "Liabilities") &&
            datas.AccountTypeId > 0
          );
        });

        if (getIncomeFromAPI.length > 0) {
          const filtersingleI = getIncomeFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );

          for (var k = 0; k < filtersingleI.length; k++) {
            let ATI = filtersingleI[k];
            ichildrencr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getIncomeFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes("Taxable Sales" || "Non Taxable Sales") &&
                datas.Amount <= 0
              );
            });
            if (getReturnVlaues === null) {
              let oldArray = [...getFilterChild1];
              for (var c = 0; c < getFilterChild1.length; c++) {
                ichildrencr.push({
                  Name: oldArray[c].Name,
                  Amount: oldArray[c].Amount,
                  OldAmt: "",
                });
              }
            } else {
              const taxableSalP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount > 0;
              });
              const taxableSalN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount < 0;
              });
              const ntaxableSalP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount > 0
                );
              });
              const ntaxableSalN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];

              //sum of taxP
              const totalSalP = taxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalSalN = taxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxableSalP.length > 0 && taxableSalN.length > 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalN.toFixed(2),
                });
              }
              //if no return
              else if (taxableSalP.length > 0 && taxableSalN.length === 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxableSalP.length === 0 && taxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: Number(totalSalN).toFixed(2),
                  OldAmt: Number(totalSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnSalP = ntaxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnSalN = ntaxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //nontaxable and return has.
              if (ntaxableSalP.length > 0 && ntaxableSalN.length > 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalnSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxableSalP.length > 0 && ntaxableSalN.length === 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxableSalP.length === 0 && ntaxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: Number(totalnSalN).toFixed(2),
                  OldAmt: Number(totalnSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Non Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Sales" &&
                  data.Name !== "Non Taxable Sales"
                );
              });
              if (otherExpanses.length > 0) {
                for (var d = 0; d < otherExpanses.length; d++) {
                  ichildrencr.push({
                    Name: otherExpanses[d].Name,
                    Amount: otherExpanses[d].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Incomes") {
              } else {
                YIchildren.push({
                  child01: ichildrencr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var l = 0; l < filterSingle.length; l++) {
                let ATID = filterSingle[l];
                const gparent = GL.filter((dat: any) => {
                  return dat.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Incomes") {
                    YIchildren.push({
                      child01: ichildrencr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error Need More Action ...");
                }
              }
            }
          }
          if (YIchildren.length > 0) {
            setAllYIncome(
              YIchildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setAllYIncome([]);
          }
        } else {
          if (YIchildren.length > 0) {
          } else {
            setAllYIncome([]);
          }
        }
      } else {
        setYAllExpanses([]);
        setAllYIncome([]);
      }
    } else {
      setYExpanses([]);
      setYIncome([]);
      setYAllExpanses([]);
      setAllYIncome([]);
    }
  };
  const loadData = (res: any, GL: any) => {
    if (res.length > 0) {
      //for cash and credit Sales only
      const getCreditSalesT = res.filter((data: any) => {
        return data.BusinesType === "Credit Sales " && data.Amount > 0;
      });
      setAllTCreditSales(getCreditSalesT);
      const getCashSalesT = res.filter((data: any) => {
        return data.BusinesType === "Cash Sales " && data.Amount > 0;
      });
      setAllTCashSales(getCashSalesT);
      //for profit part
      const filterdExp = res.filter((data: any) => {
        return data.Name.includes("Opening Stock");
      });
      setAllTExpanses(filterdExp[0].Amount);
      const filterdInc = res.filter((data: any) => {
        return data.Name.includes("Closing Stock");
      });
      setAllTIncome(filterdInc[0].Amount);
      if (res.length > 2) {
        let Echildren: any = [];
        let Ichildren: any = [];
        let ichildrenpr: any = [];
        let ichildrencr: any = [];
        const getExpansesFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Expenses" || "Assets") &&
            datas.AccountTypeId > 0
          );
        });
        if (getExpansesFromAPI.length > 0) {
          const filtersingleE = getExpansesFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );
          for (var i = 0; i < filtersingleE.length; i++) {
            let ATI = filtersingleE[i];
            ichildrenpr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getExpansesFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes(
                  "Taxable Purchase" || "Non Taxable Purchase"
                ) && datas.Amount <= 0
              );
            });
            if (getReturnVlaues.length === 0) {
              let oldArray = [...getFilterChild1];
              for (var a = 0; a < getFilterChild1.length; a++) {
                ichildrenpr.push({
                  Name: oldArray[a].Name,
                  Amount: Math.abs(oldArray[a].Amount),
                  OldAmt: "",
                });
              }
            } else {
              const taxablePurP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount > 0;
              });
              const taxablePurN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Purchase" && data.Amount < 0;
              });
              const ntaxablePurP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount > 0
                );
              });
              const ntaxablePurN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Purchase") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];
              //sum of taxP
              const totalPurP = taxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalPurN = taxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxablePurP.length > 0 && taxablePurN.length > 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: "",
                  OldAmt: totalPurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurN.toFixed(2),
                });
              }
              //if no return
              else if (taxablePurP.length > 0 && taxablePurN.length === 0) {
                let sub = Number(totalPurP) + Number(totalPurN);
                ichildrenpr.push({
                  Name: taxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxablePurP.length === 0 && taxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Taxable Purchase)",
                  Amount: Number(totalPurN).toFixed(2),
                  OldAmt: Number(totalPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnPurP = ntaxablePurP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnPurN = ntaxablePurN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              //nontaxable and return has.
              if (ntaxablePurP.length > 0 && ntaxablePurN.length > 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: "",
                  OldAmt: ntaxablePurP.toFixed(2),
                });
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxablePurP.length > 0 && ntaxablePurN.length === 0) {
                let sub = Number(totalnPurP) + Number(totalnPurN);
                ichildrenpr.push({
                  Name: ntaxablePurP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnPurP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxablePurP.length === 0 && ntaxablePurN.length > 0) {
                ichildrenpr.push({
                  Name: "Return (Non Taxable Purchase)",
                  Amount: Number(totalnPurN).toFixed(2),
                  OldAmt: Number(totalnPurN).toFixed(2),
                });
              } else {
                ichildrenpr.push({
                  Name: "Non Taxable Purchase",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Purchase" &&
                  data.Name !== "Non Taxable Purchase"
                );
              });
              if (otherExpanses.length > 0) {
                for (var h = 0; h < otherExpanses.length; h++) {
                  ichildrenpr.push({
                    Name: otherExpanses[h].Name,
                    Amount: otherExpanses[h].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Expenses") {
              } else {
                Echildren.push({
                  child01: ichildrenpr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var j = 0; j < filterSingle.length; j++) {
                let ATID = filterSingle[j];
                const gparent = GL.filter((dats: any) => {
                  return dats.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Expenses") {
                    Echildren.push({
                      child01: ichildrenpr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error. Need More Action....");
                }
              }
            }
          }
          if (Echildren.length > 0) {
            setTAllExpansesC(
              Echildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setTAllExpansesC([]);
          }
        } else {
          if (Echildren.length > 0) {
          } else {
            setTAllExpansesC([]);
          }
        }
        const getIncomeFromAPI: any = res.filter((datas: any) => {
          return (
            datas.NatureofGroup.includes("Income" || "Liabilities") &&
            datas.AccountTypeId > 0
          );
        });

        if (getIncomeFromAPI.length > 0) {
          const filtersingleI = getIncomeFromAPI
            .map((item: any, index: any) => item.AccountTypeId)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            );

          for (var k = 0; k < filtersingleI.length; k++) {
            let ATI = filtersingleI[k];
            ichildrencr = [];
            const parent = GL.filter((dat: any) => {
              return dat.Id === Number(ATI);
            });
            const getForChild1 = getIncomeFromAPI.filter((data: any) => {
              return data.AccountTypeId === Number(ATI);
            });
            const getFilterChild1 = getForChild1.filter((data: any) => {
              return data.Amount !== 0;
            });
            const getReturnVlaues = getFilterChild1.filter((datas: any) => {
              return (
                datas.Name.includes("Taxable Sales" || "Non Taxable Sales") &&
                datas.Amount <= 0
              );
            });
            if (getReturnVlaues === null) {
              let oldArray = [...getFilterChild1];
              for (var c = 0; c < getFilterChild1.length; c++) {
                ichildrencr.push({
                  Name: oldArray[c].Name,
                  Amount: oldArray[c].Amount,
                  OldAmt: "",
                });
              }
            } else {
              const taxableSalP = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount > 0;
              });
              const taxableSalN = getFilterChild1.filter((data: any) => {
                return data.Name === "Taxable Sales" && data.Amount < 0;
              });
              const ntaxableSalP = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount > 0
                );
              });
              const ntaxableSalN = getFilterChild1.filter((data: any) => {
                return (
                  data.Name.includes("Non Taxable Sales") && data.Amount < 0
                );
              });
              let oldArray = [...getFilterChild1];

              //sum of taxP
              const totalSalP = taxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalSalN = taxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //taxable and return has.
              if (taxableSalP.length > 0 && taxableSalN.length > 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalN.toFixed(2),
                });
              }
              //if no return
              else if (taxableSalP.length > 0 && taxableSalN.length === 0) {
                let sub = Number(totalSalP) + Number(totalSalN);
                ichildrencr.push({
                  Name: taxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (taxableSalP.length === 0 && taxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Taxable Sales)",
                  Amount: Number(totalSalN).toFixed(2),
                  OldAmt: Number(totalSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }
              //sum of ntaxP
              const totalnSalP = ntaxableSalP.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);
              const totalnSalN = ntaxableSalN.reduce(function (a: any, b: any) {
                return Number(a) + Number(b.Amount);
              }, 0);

              //nontaxable and return has.
              if (ntaxableSalP.length > 0 && ntaxableSalN.length > 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: "",
                  OldAmt: totalnSalP.toFixed(2),
                });
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalN.toFixed(2),
                });
              }
              //if no return
              else if (ntaxableSalP.length > 0 && ntaxableSalN.length === 0) {
                let sub = Number(totalnSalP) + Number(totalnSalN);
                ichildrencr.push({
                  Name: ntaxableSalP[0].Name,
                  Amount: sub.toFixed(2),
                  OldAmt: totalnSalP.toFixed(2),
                });
              }
              //if no taxable but retuen
              else if (ntaxableSalP.length === 0 && ntaxableSalN.length > 0) {
                ichildrencr.push({
                  Name: "Return (Non Taxable Sales)",
                  Amount: Number(totalnSalN).toFixed(2),
                  OldAmt: Number(totalnSalN).toFixed(2),
                });
              } else {
                ichildrencr.push({
                  Name: "Non Taxable Sales",
                  Amount: 0.0,
                  OldAmt: "",
                });
              }

              //except taxable and non taxable and their return
              const otherExpanses = getFilterChild1.filter((data: any) => {
                return (
                  data.Name !== "Taxable Sales" &&
                  data.Name !== "Non Taxable Sales"
                );
              });
              if (otherExpanses.length > 0) {
                for (var d = 0; d < otherExpanses.length; d++) {
                  ichildrencr.push({
                    Name: otherExpanses[d].Name,
                    Amount: otherExpanses[d].Amount.toFixed(2),
                    OldAmt: "",
                  });
                }
              } else {
              }
            }
            if (parent[0].UnderGroupLedger === "0") {
              if (parent[0].Name === "Indirect Incomes") {
              } else {
                Ichildren.push({
                  child01: ichildrencr,
                  child02: parent,
                });
              }
            } else {
              const filterSingle = parent
                .map((item: any, index: any) => item.UnderGroupLedger)
                .filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                );
              for (var l = 0; l < filterSingle.length; l++) {
                let ATID = filterSingle[l];
                const gparent = GL.filter((dat: any) => {
                  return dat.Id === Number(ATID);
                });
                const getForChild2 = parent.filter((data: any) => {
                  return data.UnderGroupLedger === ATID;
                });
                if (gparent[0].UnderGroupLedger === "0") {
                  if (gparent[0].Name === "Direct Incomes") {
                    Ichildren.push({
                      child01: ichildrencr,
                      child02: getForChild2,
                      child03: gparent,
                    });
                  } else {
                  }
                } else {
                  errorMessage("Code Error Need More Action ...");
                }
              }
            }
          }
          if (Ichildren.length > 0) {
            setTAllIncomeC(
              Ichildren.map((datas: any) => {
                return datas.child01.map((data: any) => ({
                  ...data,
                }));
              })
            );
          } else {
            setTAllIncomeC([]);
          }
        } else {
          if (Ichildren.length > 0) {
          } else {
            setTAllIncomeC([]);
          }
        }
      } else {
        setTAllExpansesC([]);
        setTAllIncomeC([]);
      }
    } else {
      setAllTExpanses([]);
      setAllTIncome([]);
      setTAllExpansesC([]);
      setTAllIncomeC([]);
    }
  };
  //Month
  let ss = allMExpanses.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalMDebitChild = ss.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let MonthEAmount = Number(totalMDebitChild + mExpanses);
  let uu = allMIncome.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalMCreditChild = uu.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let MonthIAmount = Number(totalMCreditChild + mIncome);
  //Week
  let aa = allWExpanses.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalWDebitChild = aa.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let WeekEAmount = Number(totalWDebitChild + wExpanses);
  let bb = allWIncome.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalWCreditChild = bb.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let WeekIAmount = Number(totalWCreditChild + wIncome);
  //Yesterday
  let cc = allYExpanses.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalYDebitChild = cc.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let YesterdayEAmount = Number(totalYDebitChild + yExpanses);
  let dd = allYIncome.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalYCreditChild = dd.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let YesterdayIAmount = Number(totalYCreditChild + yIncome);
  //today
  let mm = allTExpansesC.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalDebitChild = mm.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let TodayEAmount = Number(totalDebitChild + allTExpanses);
  let nn = allTIncomeC.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalCreditChild = nn.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  let TodayIAmount = Number(totalCreditChild + allTIncome);

  //for cash abd credit sales total amount
  //today
  const todaycash = allTCashSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  const todaycredit = allTCreditSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  //yesterday
  const yesterdaycash = allYCashSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  const yesterdaycredit = allYCreditSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  //week
  const weekcash = allWCashSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  const weekcredit = allWCreditSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  //week
  const monthcash = allMCashSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  const monthcredit = allMCreditSales.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);

  return (
    <>
      <Box>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center">Today</TableCell>
                <TableCell align="center">Yesterday</TableCell>
                <TableCell align="center">Last 7 days</TableCell>
                <TableCell align="center">1 month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* <TableRow>
                            <TableCell> Sales </TableCell>
                            <TableCell sx={{backgroundColor:"white"}} align="center">{Number(totalCreditChild).toFixed(2)}</TableCell>
                            <TableCell sx={{backgroundColor:"white"}} align="center">{Number(totalYCreditChild).toFixed(2)}</TableCell>
                            <TableCell sx={{backgroundColor:"white"}} align="center">{Number(totalWCreditChild).toFixed(2)}</TableCell>
                            <TableCell sx={{backgroundColor:"white"}} align="center">{Number(totalMCreditChild).toFixed(2)}</TableCell>
                        </TableRow> */}
              <TableRow>
                <TableCell> Cash Sales </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(todaycash).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(yesterdaycash).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(weekcash).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(monthcash).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Credit Sales </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(todaycredit).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(yesterdaycredit).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(weekcredit).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {Number(monthcredit).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profit</TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {(TodayIAmount - TodayEAmount).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {(YesterdayIAmount - YesterdayEAmount).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {(WeekIAmount - WeekEAmount).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: "white" }} align="center">
                  {(MonthIAmount - MonthEAmount).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
