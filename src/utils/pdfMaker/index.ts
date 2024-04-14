import pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { errorMessage } from "../messageBox/Messages";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface IDataItem {
  text: string;
  colSpan?: number;
  alignment?: string;
  bold: boolean;
}

type IData = IDataItem[];

export const htmlTableToPdf = () => {
  const htmlTableData: any = document.getElementById("downloadExcel");

  if (htmlTableData === null) {
    errorMessage("Please wait, the data has not loaded yet.");
    return;
  } else if (htmlTableData.rows.length < 3) {
    errorMessage("Please wait, the data has not loaded yet.");
    return;
  }

  // Data preparation
  let tableData: IData[] = [];

  for (let i = 0; i < htmlTableData.rows.length; i++) {
    const element = htmlTableData.rows[i];
    let tableRow: IDataItem[] = [];

    for (let td = 0; td < element.cells.length; td++) {
      const tableCell = element.cells[td];
      const className = tableCell.className.split(" ");
      const isTextBold = className.includes("text-bold");
      let textAlignment = "left";
      if (className.includes("text-left")) {
        textAlignment = "left";
      } else if (className.includes("text-right")) {
        textAlignment = "right";
      } else if (className.includes("text-center")) {
        textAlignment = "center";
      }
      let colSpan = tableCell.colSpan;
      tableRow.push({
        text: tableCell.innerHTML,
        alignment: textAlignment,
        colSpan: colSpan,
        bold: isTextBold,
      });

      for (let colI = 0; colI < colSpan; colI++) {
        if (colI === 0) {
          continue;
        }
        tableRow.push({
          text: "testing",
          alignment: "left",
          bold: false,
        });
      }
    }
    tableData.push(tableRow);
  }

  const tableHead: string[] = [];
  for (let i = 0; i < tableData[3].length; i++) {
    tableHead.push("*");
  }

  // Table styling

  pdfMake.tableLayouts = {
    exampleLayout: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return i === node.table.headerRows ? 2 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return "#ededed";
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
    },
  };

  let content: any = [];

  content.push(
    {
      text: {
        text: tableData[0][0].text,
        alignment: "center",
        isBold: true,
        fontSize: 13,
      },
    },
    {
      margin: [0, 10, 0, 0],
      text: {
        text: tableData[1][0].text,
        alignment: "center",
        isBold: true,
        fontSize: 13,
      },
    },
    {
      margin: [0, 10, 0, 0],
      text: {
        text: tableData[2][0].text,
        alignment: "center",
        isBold: true,
        fontSize: 13,
      },
    }
  );
  const tableBody = tableData.filter((data, index) => index > 2);
  content.push({
    margin: [0, 20, 0, 0],
    layout: "exampleLayout", // optional
    fontSize: 10,
    table: {
      // headers are automatically repeated if the table spans over multiple pages
      // you can declare how many rows should be treated as headers
      headerRows: 0,
      widths: tableHead,
      body: tableBody,
    },
  });

  const fileName = `${tableData[1][0].text}-${tableData[2][0].text}.pdf`;

  try {
    pdfMake.createPdf({ content }).download(fileName);
  } catch {
    errorMessage("Inconsistancy data.");
  }
};
