import { adToBs } from "@sbmdkl/nepali-date-converter";

export const getNepaliDate = (): string => {
  let separator = "-";
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let formatedDate = `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date}`;

  try {
    const bsDate = adToBs(formatedDate);
    let nepaliDate = bsDate.replaceAll("-", ".");
    return nepaliDate;
  } catch (e) {
    return "-1";
  }
};

export const getYesNepaliDate = (): string => {
  // let yseparator = "-";
  let ynewDate = new Date();
  // let ydate = ynewDate.getDate() - 1;
  let ydate = new Date(ynewDate.getTime() - 1 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  // let ymonth = ynewDate.getMonth() + 1;
  // let yyear = ynewDate.getFullYear();

  // let yformatedDate = `${yyear}${yseparator}${
  //   ymonth < 10 ? `0${ymonth}` : `${ymonth}`
  // }${yseparator}${ydate}`;
  try {
    const ybsDate = adToBs(ydate);
    let yesnepaliDate = ybsDate.replaceAll("-", ".");
    return yesnepaliDate;
  } catch (e) {
    return "-1";
  }
};
export const getLasSevNepaliDate = (): string => {
  // let lsseparator = "-";
  let lsnewDate = new Date();
  // let lsdate = lsnewDate.getDate() - 7;
  let lsdate = new Date(lsnewDate.getTime() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  // let lsmonth = lsnewDate.getMonth() + 1;
  // let lsyear = lsnewDate.getFullYear();

  // let lsformatedDate = `${lsyear}${lsseparator}${
  //   lsmonth < 10 ? `0${lsmonth}` : `${lsmonth}`
  //   }${lsseparator}${lsdate < 10 ? `+${lsdate}` : `${lsdate}`}`;
  try {
    const lsbsDate = adToBs(lsdate);
    let lassevnepaliDate = lsbsDate.replaceAll("-", ".");
    return lassevnepaliDate;
  } catch (e) {
    return "-1";
  }
};
export const getLasMonNepaliDate = (): string => {
  let lmseparator = "-";
  let lmnewDate = new Date();
  let lmdate = lmnewDate.getDate();
  let lmmonth = lmnewDate.getMonth();
  let lmyear = lmnewDate.getFullYear();

  let monformatedDate = `${lmyear}${lmseparator}${
    lmmonth < 10 ? `0${lmmonth}` : `${lmmonth}`
  }${lmseparator}${lmdate}`;

  try {
    const lmbsDate = adToBs(monformatedDate);
    let lasmonnepaliDate = lmbsDate.replaceAll("-", ".");
    return lasmonnepaliDate;
  } catch (e) {
    return "-1";
  }
};

//for daily Sales report
export const getNepaliDateOne = (): string => {
  let dRseparator = "-";
  let dRnewDate = new Date();
  let dRdate = dRnewDate.getDate() + 1;
  let dRmonth = dRnewDate.getMonth() + 1;
  let dRyear = dRnewDate.getFullYear();

  let dRformatedDate = `${dRyear}${dRseparator}${
    dRmonth < 10 ? `0${dRmonth}` : `${dRmonth}`
  }${dRseparator}${dRdate}`;

  try {
    const dRbsDate = adToBs(dRformatedDate);
    let dRnepaliDate = dRbsDate.replaceAll("-", ".");
    return dRnepaliDate;
  } catch (e) {
    return "-1";
  }
};
