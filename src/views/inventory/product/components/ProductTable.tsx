import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Tooltip,
  Collapse,
  Box,
  Input,
} from "@mui/material";
import { useState } from "react";
import StyledLink from "../../../../utils/link/styledLink";
import { BiEditAlt } from "react-icons/bi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SaveIcon from "@mui/icons-material/Save";
import {
  editMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";
import {
  editMenuItemPortion,
  editMenuItemPortionPriceRange,
} from "../../../../services/productApi";
import PrintQr from "./PrintQr";

const Row = ({ elm, i }: any) => {
  const [open, setOpen] = useState(false);
  const [menuItemPortionsData, setMenuItemPortionsData] = useState(
    elm.MenuItemPortions
  );

  const onMenuItemPortionsChange = (e: any, item: any) => {
    const value = parseFloat(e.target.value);
    const name = e.target.name;
    const { Id } = item;
    const newMenuItemPortionsData = menuItemPortionsData.map((row: any) => {
      if (row.Id === Id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setMenuItemPortionsData(newMenuItemPortionsData);
  };

  const priceRangeOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    i: number
  ) => {
    let value = e.target.value;
    let name = e.target.name;

    let list = [...menuItemPortionsData];
    switch (name) {
      case "QtyMin":
        list[index].MenuItemPortionPriceRanges[i].QtyMin = parseFloat(value);
        break;
      case "QtyMax":
        list[index].MenuItemPortionPriceRanges[i].QtyMax = parseFloat(value);
        break;
      case "Price":
        list[index].MenuItemPortionPriceRanges[i].Price = parseFloat(value);
        break;
    }
    setMenuItemPortionsData(list);
  };

  const onMenuItemPortionsDataSave = async (e: any, item: any) => {
    const dataToBeSaved = menuItemPortionsData.filter((row: any) => {
      return row.Id === item.Id;
    });
    const { Id, Multiplier, Price } = dataToBeSaved[0];
    const response = await editMenuItemPortion(Id, Multiplier, Price);
    if (response > 0) {
      editMessage();
    } else {
      errorMessage();
    }
  };

  const priceRangeOnSave = async (e: any, index: number, i: number) => {
    let list = [...menuItemPortionsData];
    const { Id, QtyMin, QtyMax, Price } =
      list[index].MenuItemPortionPriceRanges[i];
    const response = await editMenuItemPortionPriceRange(
      Id,
      QtyMin,
      QtyMax,
      Price
    );
    if (response > 0) {
      editMessage();
    } else {
      errorMessage();
    }
  };
  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: "primary.tableHeader",
        }}
      >
        <TableCell width={20} sx={{ border: "unset" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" sx={{ fontWeight: "bold", border: "unset" }}>
          {i + 1}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
            borderRight: "unset",
            borderBottom: "unset",
            borderTop: "unset",
          }}
        >
          {elm.Name}
        </TableCell>
        <TableCell sx={{ border: "unset" }}>
          <IconButton>
            <StyledLink to={`/products/${elm.Id}`}>
              <Tooltip title="Edit" followCursor={true}>
                <IconButton color="success">
                  <BiEditAlt />
                </IconButton>
              </Tooltip>
            </StyledLink>
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {elm.MenuItemPortions.map((item: any, index: number) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{item.ItemCode}</TableCell>
                          <TableCell>{item.Name}</TableCell>
                          <TableCell align="right">
                            <Input
                              inputProps={{ style: { textAlign: "right" } }}
                              disableUnderline
                              defaultValue={item.Multiplier.toFixed(2)}
                              type="number"
                              name="Multiplier"
                              onChange={(e) =>
                                onMenuItemPortionsChange(e, item)
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Input
                              inputProps={{ style: { textAlign: "right" } }}
                              disableUnderline
                              defaultValue={item.Price.toFixed(2)}
                              type="number"
                              name="Price"
                              onChange={(e) =>
                                onMenuItemPortionsChange(e, item)
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <IconButton
                              color="info"
                              onClick={(e) =>
                                onMenuItemPortionsDataSave(e, item)
                              }
                            >
                              <SaveIcon />
                            </IconButton>
                            <PrintQr itemCode={item.ItemCode} />
                          </TableCell>
                        </TableRow>
                        {item.MenuItemPortionPriceRanges.length > 0 ? (
                          <TableRow
                            sx={{ backgroundColor: "primary.tableHeader" }}
                          >
                            <TableCell align="right">Qty Min</TableCell>
                            <TableCell align="right">Qty Max</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell />
                          </TableRow>
                        ) : (
                          ""
                        )}
                        {item.MenuItemPortionPriceRanges.map(
                          (data: any, i: number) => {
                            return (
                              <TableRow
                                sx={{ backgroundColor: "primary.tableContent" }}
                                key={`item-${i}`}
                              >
                                <TableCell align="right">
                                  <Input
                                    inputProps={{
                                      style: { textAlign: "right" },
                                    }}
                                    disableUnderline
                                    defaultValue={data.QtyMin.toFixed(2)}
                                    type="number"
                                    name="QtyMin"
                                    onChange={(e) =>
                                      priceRangeOnChange(e, index, i)
                                    }
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Input
                                    inputProps={{
                                      style: { textAlign: "right" },
                                    }}
                                    disableUnderline
                                    defaultValue={data.QtyMax.toFixed(2)}
                                    type="number"
                                    name="QtyMax"
                                    onChange={(e) =>
                                      priceRangeOnChange(e, index, i)
                                    }
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Input
                                    inputProps={{
                                      style: { textAlign: "right" },
                                    }}
                                    disableUnderline
                                    defaultValue={data.Price.toFixed(2)}
                                    type="number"
                                    name="Price"
                                    onChange={(e) =>
                                      priceRangeOnChange(e, index, i)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    color="info"
                                    onClick={(e) =>
                                      priceRangeOnSave(e, index, i)
                                    }
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell />
                              </TableRow>
                            );
                          }
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProductTable = ({ allData }: any) => {
  return (
    <>
      {allData?.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader id="downloadExcel">
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.tableHeader" }}>
                  <TableCell sx={{ borderRight: "unset" }} />
                  <TableCell align="left" sx={{ borderLeft: "unset" }}>
                    S.N
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    Product Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allData &&
                  allData?.map((elm: any, i: any) => {
                    return <Row key={elm.Id} elm={elm} i={i} />;
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default ProductTable;
