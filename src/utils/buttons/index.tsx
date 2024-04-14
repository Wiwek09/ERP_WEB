import { Button } from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory, useParams } from "react-router";
import { IoMdAdd } from "react-icons/io";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import PrintIcon from "@mui/icons-material/Print";
import { htmlTableToPdf } from "../pdfMaker";
import { VscFilePdf } from "react-icons/vsc";
import { useAppSelector } from "../../app/hooks";
import { errorMessage } from "../messageBox/Messages";
import { useState } from "react";
import { PermissionDialog } from "../../components/dialogBox";

type IProps = {
  sx?: any;
  variant?: any;
  onClick?: (e?: any) => void;
  path?: any;
  color?: any;
  fileName?: any;
  disable?: boolean;
  btnName?: string;
};

export const SaveButton = ({ variant, color, ...other }: IProps) => {
  return (
    <Button
      type="submit"
      size="small"
      variant={variant || "outlined"}
      color={color || "primary"}
      startIcon={<BiPlus />}
      sx={{ mx: 1, px: 2 }}
      {...other}
    >
      Save
    </Button>
  );
};
export const CreateButton = ({ variant, color, btnName, ...other }: IProps) => {
  return (
    <Button
      type="submit"
      size="small"
      variant={variant || "outlined"}
      color={color || "primary"}
      startIcon={<BiPlus />}
      sx={{ mx: 1, px: 2 }}
      {...other}
    >
      {btnName}
    </Button>
  );
};

export const DeleteButton = (props: IProps) => {
  const { variant, color, ...other } = props;
  return (
    <>
      <Button
        size="small"
        variant={variant || "outlined"}
        color={color || "error"}
        startIcon={<DeleteOutlineIcon />}
        sx={{ mx: 1 }}
        {...other}
      >
        Delete
      </Button>
    </>
  );
};

export const UpdateButton = (props: IProps) => {
  return (
    <>
      <Button
        type="submit"
        size="small"
        variant={props.variant || "outlined"}
        color={props.color || "primary"}
        startIcon={<EditIcon />}
        sx={props.sx ? props.sx : { mx: 1 }}
        {...props}
      >
        Update
      </Button>
    </>
  );
};

export const AddPageBtn = ({ path }: IProps) => {
  localStorage.removeItem("purProData");
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  //added for role verify
  const onClickHandler = () => {
    if (path === "INVADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "PURADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "RECADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "PAYADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "BAKADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "SRADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "PRADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "JOUADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "OMADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "QUOADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "POADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "MLADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "PROADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "CATADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "UTADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "WHTADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "WHADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "DEADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "FYADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "BRAADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "USRADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else if (path === "ROLADD") {
      errorMessage("Sorry, permission denied.");
      setOpenDialog(true);
    } else {
      history.push(path);
    }
  };

  return (
    <>
      <Button
        onClick={onClickHandler}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<BiPlus />}
        sx={{ mx: 1 }}
      >
        Add
      </Button>
      <PermissionDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        name={""}
      />
    </>
  );
};

export const PdfBtn = () => {
  const downloadPdf = () => {
    const sTable = document.getElementById("printDownloadPDF")?.innerHTML;
    let style = "<style>";
    style += "table {width: 100%;font: 15px Calibri;}";
    style +=
      "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style += "padding: 2px 3px;text-align: center;}";
    style += "thead {display: table-row-group;}";
    style += `@page  
    { 
        size: auto;   /* auto is the initial value */ 
        /* this affects the margin in the printer settings */ 
        margin: 25mm 25mm 25mm 25mm;  
    }`;
    style = style + "</style>";

    let win = window.open("", "", "height=700,width=700");

    win?.document.write("<html><head>");
    // win?.document.write("<title>Profile</title>"); // <title> FOR PDF HEADER.
    win?.document.write(style);
    win?.document.write("</head>");
    win?.document.write("<body>");
    win?.document.write(sTable ? sTable : "");
    win?.document.write("</body></html>");
    win?.document.close();
    win?.print();
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={downloadPdf}
        color="error"
        startIcon={<PrintIcon />}
        sx={{ mx: 1 }}
      >
        Print
      </Button>
    </>
  );
};

export const ExcelBtn = ({ fileName, disable }: IProps) => {
  const documentName = `${fileName ? fileName : "reports"}`;
  return (
    <>
      <Button
        disabled={disable ? disable : false}
        size="small"
        variant="contained"
        color="success"
        startIcon={<SiMicrosoftexcel />}
        sx={{ mx: 1 }}
      >
        <ReactHTMLTableToExcel
          className="excelButton"
          table="downloadExcel"
          filename={documentName}
          sheet={"Bank-Cash-Voucher"}
          buttonText="Excel"
        />
      </Button>
    </>
  );
};

export const CloseButton = ({ variant, color, path, ...other }: IProps) => {
  const history = useHistory();
  return (
    <Button
      onClick={() => (path ? history.push(path) : history.goBack())}
      size="small"
      variant={variant || "outlined"}
      color={color || "error"}
      startIcon={<RiDeleteBack2Fill />}
      sx={{ mx: 1, px: 2 }}
      {...other}
    >
      Close
    </Button>
  );
};

export const AddBtn = () => {
  return (
    <>
      <Button
        size="small"
        type="submit"
        variant="outlined"
        color="primary"
        startIcon={<IoMdAdd />}
        sx={{ mx: 1 }}
      >
        Add
      </Button>
    </>
  );
};
export const PDFBtn = () => {
  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="info"
        startIcon={<VscFilePdf />}
        sx={{ mx: 1 }}
        onClick={() => htmlTableToPdf()}
      >
        PDF
      </Button>
    </>
  );
};
