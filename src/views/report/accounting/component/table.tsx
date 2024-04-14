import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import {
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";
import { getAllAccountBalance } from "../../../../services/accountApi";
import { getAllUnderLedger } from "../../../../services/masterLedgerAPI";
import { IUnderGroupLedger } from "../../../../interfaces/underGroupLedger";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { IDate } from "../../../transaction/invoice/interfaces";
import { Box } from "@mui/system";
import { setDefaultDateAction } from "../../../../features/defaultDateSlice";
import { IsDateVerified } from "../../../../utils/dateVerification";
import { IOnSubmit } from "../../../../interfaces/event";
import GridFormHeader from "../../../../components/headers/gridDateHeader";

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

const AccountingTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allExpanses, setAllExpanses] = useState<Data[]>([]);
  const [allExpansesC, setAllExpansesC] = useState<Data[]>([]);
  const [allIncome, setAllIncome] = useState<Data[]>([]);
  const [allIncomeC, setAllIncomeC] = useState<Data[]>([]);
  const [getValue, setGetValue] = useState<any>(0);

  const [allInDExpanses, setAllInDExpanses] = useState<any[]>([]);
  const [allInDIncome, setAllInDIncome] = useState<any[]>([]);
  const [indirectTotalE, setInDirectTotalE] = useState<any[]>([]);
  const [indirectTotalI, setInDirectTotalI] = useState<any[]>([]);
  const [findNetP, setFinfNetProfit] = useState<any>(0);
  const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const CompanyData = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const financialYear = useAppSelector((state) => state.financialYear);
  const [date, setDate] = useState<IDate>(
    defaultDate.EndDate === ""
      ? {
          StartDate: financialYear.NepaliStartDate,
          EndDate: financialYear.NepaliEndDate,
        }
      : defaultDate
  );

  const [inGLData, setInGLData] = useState<any>(0);
  const [inGPData, setInGPData] = useState<any>(0);

  const loAdData = async (start: any, end: any) => {
    const res: any = await getAllAccountBalance(start, end);
    const GroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
    const filterdExp = res.filter((data: any) => {
      return data.Name.includes("Opening Stock");
    });
    const filterdInc = res.filter((data: any) => {
      return data.Name.includes("Closing Stock");
    });
    if (res.length > 2) {
      const getExpansesFromAPI: any = res.filter((datas: any) => {
        return (
          datas.NatureofGroup.includes("Expenses" || "Assets") &&
          datas.AccountTypeId > 0
        );
      });
      let dchildren: any = [];
      let ichildren: any = [];
      let ichildrenpr: any = [];
      let idchildren: any = [];
      let iichildren: any = [];
      let ichildrencr: any = [];

      if (getExpansesFromAPI.length > 0) {
        setAllExpanses(
          filterdExp.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
            child0: getExpansesFromAPI,
          }))
        );
        const filtersingleE = getExpansesFromAPI
          .map((item: any, index: any) => item.AccountTypeId)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          );

        for (var i = 0; i < filtersingleE.length; i++) {
          let ATI = filtersingleE[i];
          ichildrenpr = [];
          const parent = GroupLedger.filter((dat: any) => {
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
                OldAmt: totalnPurP.toFixed(2),
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
              const filterChild1 = ichildrenpr.filter((data: any) => {
                return data.Amount !== 0;
              });
              ichildren.push({
                child01: filterChild1,
                child02: parent,
              });
              setAllInDExpanses(
                filterdExp.map((data: Data) => ({
                  child0: getExpansesFromAPI,
                  child: ichildren,
                }))
              );
            } else {
              dchildren.push({
                child01: ichildrenpr,
                child02: parent,
              });
              setAllExpanses(
                filterdExp.map((data: Data) => ({
                  Name: data.Name,
                  Amount: data.Amount,
                  child0: getExpansesFromAPI,
                  child: dchildren,
                }))
              );
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
              const gparent = GroupLedger.filter((dats: any) => {
                return dats.Id === Number(ATID);
              });
              const getForChild2 = parent.filter((data: any) => {
                return data.UnderGroupLedger === ATID;
              });
              if (gparent[0].UnderGroupLedger === "0") {
                if (gparent[0].Name === "Direct Expenses") {
                  dchildren.push({
                    child01: ichildrenpr,
                    child02: getForChild2,
                    child03: gparent,
                  });
                  setAllExpanses(
                    filterdExp.map((data: Data) => ({
                      Name: data.Name,
                      Amount: data.Amount,
                      child0: getExpansesFromAPI,
                      child: dchildren,
                    }))
                  );
                } else {
                  const filtersChild1 = ichildrenpr.filter((data: any) => {
                    return data.Amount !== 0;
                  });
                  ichildren.push({
                    child01: filtersChild1,
                    child02: getForChild2,
                    child03: gparent,
                  });
                  setAllInDExpanses(
                    filterdExp.map((data: Data) => ({
                      child0: getExpansesFromAPI,
                      child: ichildren,
                    }))
                  );
                }
              } else {
                errorMessage("Code Error. Need More Action....");
              }
            }
          }
        }
        if (ichildren.length > 0) {
          setInDirectTotalE(
            ichildren.map((datass: any) => {
              return datass.child01.map((data: any) => ({
                ...data,
              }));
            })
          );
        } else {
          setInDirectTotalE([]);
          setAllInDExpanses([]);
        }
        setAllExpansesC(
          dchildren.map((datas: any) => {
            return datas.child01.map((data: any) => ({
              ...data,
            }));
          })
        );
      } else {
        setAllExpanses(
          filterdExp.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
        if (ichildren.length > 0) {
        } else {
          setInDirectTotalE([]);
          setAllInDExpanses([]);
        }
      }
      const getIncomeFromAPI: any = res.filter((datas: any) => {
        return (
          datas.NatureofGroup.includes("Income" || "Liabilities") &&
          datas.AccountTypeId > 0
        );
      });
      if (getIncomeFromAPI.length > 0) {
        setAllIncome(
          filterdInc.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
            child0: getIncomeFromAPI,
          }))
        );
        const filtersingleI = getIncomeFromAPI
          .map((item: any, index: any) => item.AccountTypeId)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          );

        for (var k = 0; k < filtersingleI.length; k++) {
          let ATI = filtersingleI[k];
          ichildrencr = [];
          const parent = GroupLedger.filter((dat: any) => {
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
              return data.Name.includes("Non Taxable Sales") && data.Amount > 0;
            });
            const ntaxableSalN = getFilterChild1.filter((data: any) => {
              return data.Name.includes("Non Taxable Sales") && data.Amount < 0;
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
              const filterChild1 = ichildrencr.filter((data: any) => {
                return data.Amount !== 0;
              });
              iichildren.push({
                child01: filterChild1,
                child02: parent,
              });
              setAllInDIncome(
                filterdInc.map((data: Data) => ({
                  child0: getExpansesFromAPI,
                  child: iichildren,
                }))
              );
            } else {
              idchildren.push({
                child01: ichildrencr,
                child02: parent,
              });
              setAllIncome(
                filterdInc.map((data: Data) => ({
                  Name: data.Name,
                  Amount: data.Amount,
                  child0: getIncomeFromAPI,
                  child: idchildren,
                }))
              );
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
              const gparent = GroupLedger.filter((dat: any) => {
                return dat.Id === Number(ATID);
              });
              const getForChild2 = parent.filter((data: any) => {
                return data.UnderGroupLedger === ATID;
              });
              if (gparent[0].UnderGroupLedger === "0") {
                if (gparent[0].Name === "Direct Incomes") {
                  idchildren.push({
                    child01: ichildrencr,
                    child02: getForChild2,
                    child03: gparent,
                  });
                  setAllIncome(
                    filterdInc.map((data: Data) => ({
                      Name: data.Name,
                      Amount: data.Amount,
                      child0: getIncomeFromAPI,
                      child: idchildren,
                    }))
                  );
                } else {
                  const filtersChild1 = ichildrencr.filter((data: any) => {
                    return data.Amount !== 0;
                  });
                  iichildren.push({
                    child01: filtersChild1,
                    child02: getForChild2,
                    child03: gparent,
                  });
                  setAllInDIncome(
                    filterdExp.map((data: Data) => ({
                      child0: getExpansesFromAPI,
                      child: iichildren,
                    }))
                  );
                }
              } else {
                errorMessage("Code Error Need More Action ...");
              }
            }
          }
        }
        if (iichildren.length > 0) {
          setInDirectTotalI(
            iichildren.map((datass: any) => {
              return datass.child01.map((data: any) => ({
                ...data,
              }));
            })
          );
        } else {
          setInDirectTotalI([]);
          setAllInDIncome([]);
        }
        setAllIncomeC(
          idchildren.map((datas: any) => {
            return datas.child01.map((data: any) => ({
              ...data,
            }));
          })
        );
      } else {
        setAllIncome(
          filterdInc.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
        if (iichildren.length > 0) {
        } else {
          setInDirectTotalI([]);
          setAllInDIncome([]);
        }
      }
    } else {
      setAllExpansesC([]);
      setInDirectTotalE([]);
      setAllIncomeC([]);
      setInDirectTotalI([]);
      setAllExpanses(
        filterdExp.map((data: Data) => ({
          Name: data.Name,
          Amount: data.Amount,
        }))
      );
      setAllIncome(
        filterdInc.map((datas: Data) => ({
          Name: datas.Name,
          Amount: datas.Amount,
        }))
      );
      errorMessage("No oter data found");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loAdData(date.StartDate, date.EndDate);
  }, []);

  //get total here
  const totalDebit = allExpanses.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  let mm = allExpansesC.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalDebitChild = mm.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);

  const totalCredit = allIncome.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);
  let nn = allIncomeC.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalCreditChild = nn.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);
  //indirect
  let oo = indirectTotalI.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalInCredit = oo.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);

  let pp = indirectTotalE.map(function (items: any) {
    return items.reduce(function (a: any, b: any) {
      a += Number(b.Amount);
      return a;
    }, 0);
  });
  const totalInDebit = pp.reduce(function (a: any, b: any) {
    return Number(a) + Number(b);
  }, 0);

  useEffect(() => {
    if (totalDebit === totalCredit) {
      setGetValue(Number(totalDebit - totalCredit));
    } else {
      setGetValue(
        Number(totalDebit + totalDebitChild - (totalCredit + totalCreditChild))
      );
    }
  }, [allExpanses, allExpansesC, allIncome, allIncomeC]);

  useEffect(() => {
    getIntValue();
  }, [getValue]);

  const getIntValue = () => {
    if (getValue > 0) {
      setFinfNetProfit(getValue + totalInDebit - totalInCredit);
      let kk = getValue + totalInDebit - totalInCredit;
      if (kk > 0) {
        setInGLData(Number(getValue + totalInDebit));
        setInGPData(Number(totalInCredit + Math.abs(kk)));
      } else {
        setInGLData(Number(getValue + totalInDebit + Math.abs(kk)));
        setInGPData(Number(totalInCredit));
      }
    } else {
      setFinfNetProfit(totalInDebit - (Math.abs(getValue) + totalInCredit));
      let kk = totalInDebit - (Math.abs(getValue) + totalInCredit);
      if (kk > 0) {
        setInGLData(Number(totalInDebit));
        setInGPData(Number(Math.abs(getValue) + totalInCredit + Math.abs(kk)));
      } else {
        setInGLData(Number(totalInDebit + Math.abs(kk)));
        setInGPData(Number(Math.abs(getValue) + totalInCredit));
      }
    }
    return null;
  };

  const loadDataByDate = (e: IOnSubmit) => {
    e.preventDefault();
    if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
      errorMessage("Invalid Date !!!");
      return;
    }
    loAdData(date.StartDate, date.EndDate);
    dispatch(setDefaultDateAction(date));
  };
  const updateSelectedFormData = (name: string, value: number | 0) => {};
  return (
    <>
      <GridFormHeader
        dateChoose={date}
        setDateChoose={setDate}
        getDataInSearch={loadDataByDate}
        pdf="true"
        PDF="true"
        excel="true"
        addDisable={true}
        onClickHandler={updateSelectedFormData}
        fileName={`accounting-report-${date.StartDate}-${date.EndDate}`}
      />
      {!isLoading ? (
        <Box>
          <TableContainer component={Paper} sx={{ mt: 2 }} id="PLAccounting">
            <DateHeader headerName="Profit And Loss" date={date} />
            <Table stickyHeader aria-label="sticky table" id="downloadExcel">
              <TableHead>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={5} align="center">
                    {CompanyData?.NameEnglish}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={5} align="center">
                    Trial Balance
                  </TableCell>
                </TableRow>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={5} align="center">
                    {`${NepaliStartDate} - ${NepaliEndDate}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ padding: 0 }} width="50%">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold" }}
                            align="left"
                            width="80%"
                          >
                            Particular
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold" }}
                            align="left"
                            width="20%"
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableCell>
                  <TableCell sx={{ padding: 0 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            width="80%"
                            sx={{ fontWeight: "bold" }}
                            align="left"
                          >
                            Particular
                          </TableCell>
                          <TableCell
                            width="20%"
                            sx={{ fontWeight: "bold" }}
                            align="left"
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    width="50%"
                    sx={{ padding: 0, verticalAlign: "top" }}
                  >
                    <Table>
                      <TableBody>
                        {allExpanses.map((data: Data, index: number) => {
                          return (
                            <>
                              <TableRow hover id={index + "e"}>
                                <TableCell align="left" width="60%">
                                  {" "}
                                  {data.Name}{" "}
                                </TableCell>
                                <TableCell align="left" width="20%"></TableCell>
                                <TableCell align="right" width="20%">
                                  {" "}
                                  {data.Amount.toFixed(2)}{" "}
                                </TableCell>
                              </TableRow>
                              {data.child?.map((datac: any, index: number) => {
                                return (
                                  <>
                                    {datac.child03?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                    {datac.child02?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                sx={{ paddingLeft: 5 }}
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                    {datac.child01?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                sx={{ paddingLeft: 10 }}
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.OldAmt}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                );
                              })}
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell
                    width="50%"
                    sx={{ padding: 0, verticalAlign: "top" }}
                  >
                    <Table>
                      <TableBody>
                        {allIncome.map((dataa: Data, index: number) => {
                          return (
                            <>
                              {dataa.child?.map((dataI: any, index: number) => {
                                return (
                                  <>
                                    {dataI.child03?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="50%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                    {dataI.child02?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                sx={{ paddingLeft: 5 }}
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                    {dataI.child01?.map(
                                      (elm: any, index: number) => {
                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                sx={{ paddingLeft: 10 }}
                                                align="left"
                                                width="60%"
                                              >
                                                {" "}
                                                {elm.Name}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.OldAmt}{" "}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                width="20%"
                                              >
                                                {" "}
                                                {elm.Amount}{" "}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                );
                              })}
                              <TableRow hover id={index + "e"}>
                                <TableCell align="left" width="60%">
                                  {" "}
                                  {dataa.Name}{" "}
                                </TableCell>
                                <TableCell align="right" width="20%">
                                  {" "}
                                </TableCell>
                                <TableCell align="right" width="20%">
                                  {" "}
                                  {dataa.Amount.toFixed(2)}{" "}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
                {totalDebit === totalCredit ? (
                  ""
                ) : (
                  <TableRow>
                    <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                      <Table>
                        <TableBody>
                          {getValue > 0 ? (
                            <TableRow>
                              <TableCell
                                width="100%"
                                sx={{ textAlign: "left" }}
                              >
                                .
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell width="50%" sx={{ textAlign: "left" }}>
                                Gross Profit
                              </TableCell>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "right" }}
                              >
                                {Math.abs(getValue).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableCell>
                    <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                      <Table>
                        <TableBody>
                          {getValue > 0 ? (
                            <TableRow>
                              <TableCell width="50%" sx={{ textAlign: "left" }}>
                                Gross Loss
                              </TableCell>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "right" }}
                              >
                                {Math.abs(getValue).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell
                                width="100%"
                                sx={{ textAlign: "left" }}
                              >
                                .
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                    <Table>
                      <TableBody>
                        {getValue > 0 ? (
                          <TableRow>
                            <TableCell
                              width="50%"
                              align="left"
                              sx={{ fontWeight: "bold" }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              {Math.abs(
                                Number(totalDebit + totalDebitChild)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "left", fontWeight: "bold" }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              {(
                                Math.abs(getValue) +
                                Number(totalDebit + totalDebitChild)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                    <Table>
                      <TableBody>
                        {getValue > 0 ? (
                          <TableRow>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "left", fontWeight: "bold" }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              {Math.abs(
                                getValue + totalCredit + totalCreditChild
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "left", fontWeight: "bold" }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              width="50%"
                              sx={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              {Math.abs(totalCredit + totalCreditChild).toFixed(
                                2
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
                {totalDebit === totalCredit ? (
                  ""
                ) : (
                  <>
                    <TableRow>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            {getValue > 0 ? (
                              <TableRow>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "left" }}
                                >
                                  Gross Loss
                                </TableCell>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "right" }}
                                >
                                  {Math.abs(getValue).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell
                                  width="100%"
                                  sx={{ textAlign: "left" }}
                                >
                                  .
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            {getValue > 0 ? (
                              <TableRow>
                                <TableCell
                                  width="100%"
                                  sx={{ textAlign: "left" }}
                                >
                                  .
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "left" }}
                                >
                                  Gross Profit
                                </TableCell>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "right" }}
                                >
                                  {Math.abs(getValue).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        width="50%"
                        sx={{ padding: 0, verticalAlign: "top" }}
                      >
                        <Table>
                          <TableBody>
                            {allInDExpanses.map(
                              (datae: Data, index: number) => {
                                return (
                                  <>
                                    {datae.child?.map(
                                      (data: any, index: number) => {
                                        return (
                                          <>
                                            {data.child03?.map(
                                              (elm: any, index: number) => {
                                                return (
                                                  <>
                                                    <TableRow>
                                                      <TableCell
                                                        align="left"
                                                        width="60%"
                                                      >
                                                        {" "}
                                                        {elm.Name}{" "}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {" "}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {" "}
                                                        {elm.Amount}{" "}
                                                      </TableCell>
                                                    </TableRow>
                                                  </>
                                                );
                                              }
                                            )}
                                            {data.child02?.map(
                                              (elm: any, index: number) => {
                                                return (
                                                  <>
                                                    <TableRow>
                                                      <TableCell
                                                        sx={{ paddingLeft: 5 }}
                                                        align="left"
                                                        width="60%"
                                                      >
                                                        {" "}
                                                        {elm.Name}{" "}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {" "}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {" "}
                                                        {elm.Amount}{" "}
                                                      </TableCell>
                                                    </TableRow>
                                                  </>
                                                );
                                              }
                                            )}
                                            {data.child01?.map(
                                              (elm: any, index: number) => {
                                                return (
                                                  <>
                                                    <TableRow>
                                                      <TableCell
                                                        sx={{ paddingLeft: 10 }}
                                                        align="left"
                                                        width="60%"
                                                      >
                                                        {" "}
                                                        {elm.Name}{" "}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {elm.OldAmt}
                                                      </TableCell>
                                                      <TableCell
                                                        align="right"
                                                        width="20%"
                                                      >
                                                        {" "}
                                                        {elm.Amount}{" "}
                                                      </TableCell>
                                                    </TableRow>
                                                  </>
                                                );
                                              }
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                );
                              }
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell
                        width="50%"
                        sx={{ padding: 0, verticalAlign: "top" }}
                      >
                        <Table>
                          <TableBody>
                            {allInDIncome.map((datai: Data, index: number) => {
                              return (
                                <>
                                  {datai.child?.map(
                                    (data: any, index: number) => {
                                      return (
                                        <>
                                          {data.child03?.map(
                                            (elm: any, index: number) => {
                                              return (
                                                <>
                                                  <TableRow>
                                                    <TableCell
                                                      align="left"
                                                      width="60%"
                                                    >
                                                      {" "}
                                                      {elm.Name}{" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                      {elm.Amount}{" "}
                                                    </TableCell>
                                                  </TableRow>
                                                </>
                                              );
                                            }
                                          )}
                                          {data.child02?.map(
                                            (elm: any, index: number) => {
                                              return (
                                                <>
                                                  <TableRow>
                                                    <TableCell
                                                      sx={{ paddingLeft: 5 }}
                                                      align="left"
                                                      width="60%"
                                                    >
                                                      {" "}
                                                      {elm.Name}{" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                      {elm.Amount}{" "}
                                                    </TableCell>
                                                  </TableRow>
                                                </>
                                              );
                                            }
                                          )}
                                          {data.child01?.map(
                                            (elm: any, index: number) => {
                                              return (
                                                <>
                                                  <TableRow>
                                                    <TableCell
                                                      sx={{ paddingLeft: 10 }}
                                                      align="left"
                                                      width="60%"
                                                    >
                                                      {" "}
                                                      {elm.Name}{" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                      {elm.OldAmt}{" "}
                                                    </TableCell>
                                                    <TableCell
                                                      align="right"
                                                      width="20%"
                                                    >
                                                      {" "}
                                                      {elm.Amount}{" "}
                                                    </TableCell>
                                                  </TableRow>
                                                </>
                                              );
                                            }
                                          )}
                                        </>
                                      );
                                    }
                                  )}
                                </>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            {findNetP > 0 ? (
                              <TableRow>
                                <TableCell
                                  width="100%"
                                  sx={{ textAlign: "left" }}
                                >
                                  .
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "left" }}
                                >
                                  Net Profit
                                </TableCell>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "right" }}
                                >
                                  {Math.abs(findNetP).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            {findNetP > 0 ? (
                              <TableRow>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "left" }}
                                >
                                  Net Loss
                                </TableCell>
                                <TableCell
                                  width="50%"
                                  sx={{ textAlign: "right" }}
                                >
                                  {Math.abs(findNetP).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell
                                  width="100%"
                                  sx={{ textAlign: "left" }}
                                >
                                  .
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "left", fontWeight: "bold" }}
                              >
                                Total
                              </TableCell>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "right", fontWeight: "bold" }}
                              >
                                {Math.abs(inGLData).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell sx={{ padding: 0, verticalAlign: "top" }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "left", fontWeight: "bold" }}
                              >
                                Total
                              </TableCell>
                              <TableCell
                                width="50%"
                                sx={{ textAlign: "right", fontWeight: "bold" }}
                              >
                                {Math.abs(inGPData).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <LinearProgress sx={{ marginTop: 3 }} />
      )}
    </>
  );
};
export default AccountingTable;
