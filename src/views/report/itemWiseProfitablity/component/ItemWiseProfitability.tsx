import React, { useEffect, useState } from "react";
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
import DateHeader from "../../../../components/headers/dateHeader";
import { ProfitItemWise } from "../../../../interfaces/profitDateItemWise";
import { IDate } from "../../../transaction/invoice/interfaces";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { selectCompany } from "../../../../features/companySlice";
import { AnyARecord } from "dns";
import { errorMessage } from "../../../../utils/messageBox/Messages";

interface IProps {
  itemsDateWiseData: any;
  date: IDate;
}
interface Data {
  Name: string;
  Amount: number;
  child: child02[];
  child1: child02[];
}
interface child02 {
  Name: string;
  Amount: number;
}
const ItemWiseProfitabilityTable = ({ itemsDateWiseData, date }: IProps) => {
  const { NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const CompanyData = useAppSelector(selectCompany);

  const [allExpanses, setAllExpanses] = useState<Data[]>([]);
  const [allIncome, setAllIncome] = useState<Data[]>([]);

  const [getValue, setGetValue] = useState<any>(0);
  const [allExpansesPR, setAllExpansesPR] = useState<Data[]>([]);
  const [allIncomeSR, setAllIncomeSR] = useState<Data[]>([]);

  const loAdData = async () => {
    const filterdExp = itemsDateWiseData.filter((data: any) => {
      return data.Name.includes("Opening Stock");
    });
    const filterdInc = itemsDateWiseData.filter((data: any) => {
      return data.Name.includes("Closing Stock");
    });

    if (itemsDateWiseData.length > 2) {
      let ichildrenp: any = [];
      let ichildrenpr: any = [];
      let schildren: any = [];
      let srchildren: any = [];
      //Expanses
      const getExpansesFromAPI: any = itemsDateWiseData.filter((datas: any) => {
        return datas.NatureofGroup.includes("Expense"); //purchase return
      });
      if (getExpansesFromAPI.length > 0) {
        setAllExpanses(
          filterdExp.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
        const PurP = getExpansesFromAPI.filter((data: any) => {
          return data.Name === "Purchase";
        });
        const PurReturn = getExpansesFromAPI.filter((datas: any) => {
          return datas.Name.includes("Purchase Return");
        });
        if (PurReturn.length === 0) {
          let sub = Number(PurP[0].Amount) + 0;
          ichildrenp.push({
            Name: PurP[0].Name,
            Amount: "",
            OldAmt: PurP[0].Amount,
          });
          ichildrenpr.push({
            Name: "Purchase Return",
            Amount: sub.toFixed(2),
            OldAmt: 0,
          });
          setAllExpanses(
            filterdExp.map((data: Data) => ({
              Name: data.Name,
              Amount: data.Amount,
              child: ichildrenp,
              child1: ichildrenpr,
            }))
          );
        } else {
          let sub = Number(PurP[0].Amount) + Number(PurReturn[0].Amount);
          ichildrenp.push({
            Name: PurP[0].Name,
            Amount: "",
            OldAmt: PurP[0].Amount,
          });
          ichildrenpr.push({
            Name: PurReturn[0].Name,
            Amount: sub.toFixed(2),
            OldAmt: PurReturn[0].Amount,
          });
          setAllExpanses(
            filterdExp.map((data: Data) => ({
              Name: data.Name,
              Amount: data.Amount,
              child: ichildrenp,
              child1: ichildrenpr,
            }))
          );
        }
        setAllExpansesPR(ichildrenpr);
      } else {
        setAllExpanses(
          filterdExp.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
      }
      //Sales
      const getIncomeFromAPI: any = itemsDateWiseData.filter((datas: any) => {
        return datas.NatureofGroup.includes("Income");
      });
      if (getIncomeFromAPI.length > 0) {
        setAllIncome(
          filterdInc.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
        const SalS = getIncomeFromAPI.filter((data: any) => {
          return data.Name === "Sales";
        });
        const SalReturn = getIncomeFromAPI.filter((datas: any) => {
          return datas.Name.includes("Sales Return");
        });
        if (SalReturn.length === 0) {
          let ssub = Number(SalS[0].Amount) + 0;
          schildren.push({
            Name: SalS[0].Name,
            Amount: "",
            OldAmt: SalS[0].Amount,
          });
          srchildren.push({
            Name: "Sales Return",
            Amount: ssub.toFixed(2),
            OldAmt: 0,
          });
          setAllIncome(
            filterdInc.map((data: Data) => ({
              Name: data.Name,
              Amount: data.Amount,
              child: schildren,
              child1: srchildren,
            }))
          );
        } else {
          let sub = Number(SalS[0].Amount) + Number(SalReturn[0].Amount);
          schildren.push({
            Name: SalS[0].Name,
            Amount: "",
            OldAmt: SalS[0].Amount,
          });
          srchildren.push({
            Name: SalReturn[0].Name,
            Amount: sub.toFixed(2),
            OldAmt: SalReturn[0].Amount,
          });
          setAllIncome(
            filterdInc.map((data: Data) => ({
              Name: data.Name,
              Amount: data.Amount,
              child: schildren,
              child1: srchildren,
            }))
          );
        }
        setAllIncomeSR(srchildren);
      } else {
        setAllIncome(
          filterdInc.map((data: Data) => ({
            Name: data.Name,
            Amount: data.Amount,
          }))
        );
      }
    } else {
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
  };

  useEffect(() => {
    loAdData();
  }, [itemsDateWiseData]);

  //get total here
  const totalDebit = allExpanses.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);

  const totalCredit = allIncome.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);

  const totalpurchasereturn = allExpansesPR.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);

  const totalsalesreturn = allIncomeSR.reduce(function (a: any, b: any) {
    return Number(a) + Number(b.Amount);
  }, 0);

  useEffect(() => {
    if (totalDebit === totalCredit) {
      setGetValue(Number(totalDebit - totalCredit));
    } else {
      setGetValue(
        Number(
          totalDebit + totalpurchasereturn - (totalCredit + totalsalesreturn)
        )
      );
    }
  }, [allExpanses, allIncome]);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }} id="PLAccounting">
        <DateHeader headerName="Item Wise Profitibility" date={date} />
        <Table stickyHeader aria-label="sticky table" id="downloadExcel">
          <TableHead>
            <TableRow sx={{ display: "none" }}>
              <TableCell colSpan={5} align="center">
                {CompanyData?.NameEnglish}
              </TableCell>
            </TableRow>
            <TableRow sx={{ display: "none" }}>
              <TableCell colSpan={5} align="center">
                Item Wise Profitibility
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
              <TableCell width="50%" sx={{ padding: 0, verticalAlign: "top" }}>
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
                          {data.child?.map((elm: any, index: number) => {
                            return (
                              <>
                                <TableRow>
                                  <TableCell align="left" width="60%">
                                    {" "}
                                    {elm.Name}{" "}
                                  </TableCell>
                                  <TableCell align="right" width="20%">
                                    {elm.OldAmt}{" "}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    width="20%"
                                  ></TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                          {data.child1?.map((elm: any, index: number) => {
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
                                  <TableCell align="right" width="20%">
                                    {" "}
                                    {elm.OldAmt}{" "}
                                  </TableCell>
                                  <TableCell align="right" width="20%">
                                    {" "}
                                    {elm.Amount}{" "}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableCell>
              <TableCell width="50%" sx={{ padding: 0, verticalAlign: "top" }}>
                <Table>
                  <TableBody>
                    {allIncome.map((dataa: Data, index: number) => {
                      return (
                        <>
                          {dataa.child?.map((elm: any, index: number) => {
                            return (
                              <>
                                <TableRow>
                                  <TableCell align="left" width="60%">
                                    {" "}
                                    {elm.Name}{" "}
                                  </TableCell>
                                  <TableCell align="right" width="20%">
                                    {" "}
                                    {elm.OldAmt}{" "}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    width="50%"
                                  ></TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                          {dataa.child1?.map((elm: any, index: number) => {
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
                                  <TableCell align="right" width="20%">
                                    {" "}
                                    {elm.OldAmt}{" "}
                                  </TableCell>
                                  <TableCell align="right" width="20%">
                                    {" "}
                                    {elm.Amount}{" "}
                                  </TableCell>
                                </TableRow>
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
                          <TableCell width="100%" sx={{ textAlign: "left" }}>
                            .
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell width="50%" sx={{ textAlign: "left" }}>
                            Gross Profit
                          </TableCell>
                          <TableCell width="50%" sx={{ textAlign: "right" }}>
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
                          <TableCell width="50%" sx={{ textAlign: "right" }}>
                            {Math.abs(getValue).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell width="100%" sx={{ textAlign: "left" }}>
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
                          {(
                            Math.abs(Number(totalDebit)) +
                            Number(totalpurchasereturn)
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
                            Number(totalDebit) +
                            Number(totalpurchasereturn)
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
                          {(
                            Math.abs(getValue) +
                            Number(totalsalesreturn) +
                            Number(totalCredit)
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
                            Math.abs(totalCredit) + Number(totalsalesreturn)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
            {/* {totalDebit === totalCredit ? "" :
                  <>
                      <TableRow>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {getValue > 0 ?
                                          <TableRow>
                                              <TableCell width= "50%" sx={{textAlign: "left"}}>
                                                  Gross Loss
                                              </TableCell>
                                              <TableCell width= "50%" sx={{textAlign: "right"}}>
                                                  {Math.abs(getValue).toFixed(2)}
                                              </TableCell>
                                          </TableRow>:
                                          <TableRow>
                                              <TableCell width= "100%" sx={{textAlign: "left"}}>
                                                  .
                                              </TableCell>
                                          </TableRow>
                                      }                                      
                                  </TableBody>
                              </Table>
                          </TableCell>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {getValue > 0 ?
                                          <TableRow>
                                              <TableCell width= "100%" sx={{textAlign: "left"}}>
                                                  .
                                              </TableCell>
                                          </TableRow>:
                                          <TableRow>
                                              <TableCell width= "50%" sx={{textAlign: "left"}}>
                                                  Gross Profit
                                              </TableCell>
                                              <TableCell width= "50%" sx={{textAlign: "right"}}>
                                                  {Math.abs(getValue).toFixed(2)}
                                              </TableCell>
                                          </TableRow> 
                                      } 
                                  </TableBody>
                              </Table>
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell width= "50%" sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {allInDExpanses.map((datae: Data, index: number) => {
                                          return(
                                              <>
                                                  {
                                                      datae.child?.map((data: any, index: number) => {
                                                          return(
                                                              <>
                                                                  {data.child03?.map((elm: any, index: number) => {
                                                                      return (
                                                                          <>
                                                                              <TableRow>
                                                                                  <TableCell align="left" width= "60%"> {elm.Name} </TableCell> 
                                                                                  <TableCell align="right" width= "20%"> </TableCell> 
                                                                                  <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                              </TableRow>
                                                                          </>
                                                                      );
                                                                  })}
                                                                  {data.child02?.map((elm: any, index: number) => {
                                                                      return (
                                                                          <>
                                                                              <TableRow>
                                                                                  <TableCell sx={{paddingLeft: 5}} align="left" width= "60%"> {elm.Name} </TableCell> 
                                                                                  <TableCell align="right" width= "20%"> </TableCell> 
                                                                                  <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                              </TableRow>
                                                                          </>
                                                                      );
                                                                  })}
                                                                  {data.child01?.map((elm: any, index: number) => {
                                                                      return (
                                                                          <>
                                                                              <TableRow>
                                                                                  <TableCell sx={{paddingLeft: 10}} align="left" width= "60%"> {elm.Name} </TableCell>  
                                                                                  <TableCell align="right" width= "20%">{elm.OldAmt}</TableCell>
                                                                                  <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                              </TableRow>
                                                                          </>
                                                                      );
                                                                  })}
                                                              </>
                                                          );
                                                      })
                                                  }
                                                  
                                              </>
                                          );
                                      })}
                                  </TableBody>
                              </Table>
                          </TableCell>
                          <TableCell width= "50%" sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {allInDIncome.map((datai: Data, index: number) => {
                                          return(
                                              <>
                                                  {datai.child?.map((data: any, index: number) => {
                                                      return(
                                                          <>
                                                              {data.child03?.map((elm: any, index: number) => {
                                                                  return (
                                                                      <>
                                                                          <TableRow>
                                                                              <TableCell align="left" width= "60%"> {elm.Name} </TableCell>
                                                                              <TableCell align="right" width= "20%"> </TableCell>  
                                                                              <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                          </TableRow>
                                                                      </>
                                                                  );
                                                              })}
                                                              {data.child02?.map((elm: any, index: number) => {
                                                                  return (
                                                                      <>
                                                                          <TableRow>
                                                                              <TableCell sx={{paddingLeft: 5}} align="left" width= "60%"> {elm.Name} </TableCell> 
                                                                              <TableCell align="right" width= "20%"> </TableCell> 
                                                                              <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                          </TableRow>
                                                                      </>
                                                                  );
                                                              })}
                                                              {data.child01?.map((elm: any, index: number) => {
                                                                  return (
                                                                      <>
                                                                          <TableRow>
                                                                              <TableCell sx={{paddingLeft: 10}} align="left" width= "60%"> {elm.Name} </TableCell>
                                                                              <TableCell align="right" width= "20%"> {elm.OldAmt} </TableCell>  
                                                                              <TableCell align="right" width= "20%"> {elm.Amount} </TableCell>  
                                                                          </TableRow>
                                                                      </>
                                                                  );
                                                              })}
                                                          </>
                                                      );
                                                  })}
                                              </>
                                          );
                                      })}
                                  </TableBody>
                              </Table>
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {findNetP > 0 ?
                                          <TableRow>
                                              <TableCell width= "100%" sx={{textAlign: "left"}}>
                                                  .
                                              </TableCell>
                                          </TableRow> :
                                          <TableRow>
                                              <TableCell width= "50%" sx={{textAlign: "left"}}>
                                                  Net Profit
                                              </TableCell>
                                              <TableCell width= "50%" sx={{textAlign: "right"}}>
                                                  {Math.abs(findNetP).toFixed(2)}
                                              </TableCell>
                                          </TableRow> 
                                      }                                      
                                  </TableBody>
                              </Table>
                          </TableCell>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      {findNetP > 0 ?
                                          <TableRow>
                                              <TableCell width= "50%" sx={{textAlign: "left"}}>
                                                  Net Loss
                                              </TableCell>
                                              <TableCell width= "50%" sx={{textAlign: "right"}}>
                                                  {Math.abs(findNetP).toFixed(2)}
                                              </TableCell>
                                          </TableRow> :
                                          <TableRow>
                                              <TableCell width= "100%" sx={{textAlign: "left"}}>
                                                  .
                                              </TableCell>
                                          </TableRow>
                                      } 
                                  </TableBody>
                              </Table>
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      <TableRow>
                                          <TableCell width= "50%" sx={{textAlign: "left", fontWeight: 'bold'}}>
                                              Total
                                          </TableCell>
                                          <TableCell width= "50%" sx={{textAlign: "right", fontWeight: 'bold'}}>
                                              {Math.abs(inGLData).toFixed(2)}
                                          </TableCell>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </TableCell>
                          <TableCell sx={{padding: 0, verticalAlign: "top"}}>
                              <Table>
                                  <TableBody>
                                      <TableRow>
                                          <TableCell width= "50%" sx={{textAlign: "left", fontWeight: 'bold'}}>
                                              Total
                                          </TableCell>
                                          <TableCell width= "50%" sx={{textAlign: "right", fontWeight: 'bold'}}>
                                              {Math.abs(inGPData).toFixed(2)}
                                          </TableCell>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </TableCell>
                      </TableRow>
                  </>
                  } */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemWiseProfitabilityTable;
