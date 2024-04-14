import { IHeader, ITableBody, ITableHead } from "./interface";

interface IProps {
  header: IHeader;
  tableHead: ITableHead[];
  tableBody: ITableBody[];
}

export const downloadExcel = ({ header, tableHead, tableBody }: IProps) => {
  const getHeader = (): string => {
    const numOfColumn = tableHead.length;
    let data = "";
    data += `<tr><th style="${
      header.style ? header.style : ""
    }" colspan=${numOfColumn}>${header.companyName}</th></tr>`;
    data += `<tr><th style="${
      header.style ? header.style : ""
    }"  colspan=${numOfColumn}>${header.tableType}</th></tr>`;
    data += `<tr><th style="${
      header.style ? header.style : ""
    }"  colspan=${numOfColumn}>${header.startDate} - ${
      header.endDate
    }</th></tr>`;

    return data;
  };

  const getTableHead = (): string => {
    let data = "";
    tableHead.forEach((element) => {
      data += `<th style="${element.style ? element.style : ""}">${
        element.name
      }</th>`;
    });
    return data;
  };

  const getTableBody = (): string => {
    let data = "";

    tableBody.forEach((element) => {
      let itemData = "";
      element.forEach((item) => {
        itemData += `<td colSpan=${item.colSpan ? item.colSpan : 1} style="${
          item.style ? item.style : ""
        }">${item.tableCell}</td>`;
      });
      data += `<tr>${itemData}</tr>`;
    });
    return data;
  };

  let table = document.createElement("table");
  table.innerHTML = `${getHeader()}<tr>${getTableHead()}</tr>${getTableBody()}`;

  let downloadLink;
  // let dataType = "application/vnd.ms-excel"; => for actual excel
  let dataType = "data:text/plain;charset=utf-8";
  let tableHTML = table.outerHTML;

  const filename = `${header.tableType.toLocaleLowerCase()}-report-${
    header.startDate
  } - ${header.endDate}.xls`;

  downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  downloadLink.href = "data:" + dataType + ", " + encodeURIComponent(tableHTML);
  downloadLink.download = filename;
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
