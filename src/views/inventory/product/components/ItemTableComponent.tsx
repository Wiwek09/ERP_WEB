import { Menu, PriceChange } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { toast } from "react-toastify";
import { IOnChange } from "../../../../interfaces/event";
import { IPricerange, IProduct } from "../../../../interfaces/product";
import { deletePriceRange, deleteProductItem } from "../../../../services/productApi";
import {
  deletePRMessage,
  deleteRowMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";

interface IProps {
  data: IProduct;
  setData: any;
}

const ItemTableComponent = ({ data, setData }: IProps) => {
  const { MenuItemPortions } = data;
  const addNewRow = () => {
    let lastRow = MenuItemPortions.length - 1;
    if (
      MenuItemPortions[lastRow].ItemCode === "" ||
      MenuItemPortions[lastRow].Name === ""
    ) {
      toast.error("Fields can't be empty");
    } else {
      const newPortion = [
        ...MenuItemPortions,
        {
          ItemCode: "",
          Name: "",
          Price: 0,
          Discount:0,
          Multiplier: 0,
          OpeningStock: 0,
          OpeningStockRate: 0,
          OpeningStockAmount: 0,
          StockLimit: 0,
          MenuItemPortionPriceRanges: [
            { Id: 0, PositionId: 0, QtyMin: 0, QtyMax: 0, Price: 0 },
          ],
        },
      ];
      setData({ ...data, MenuItemPortions: newPortion });
    }
  };

  const onChangeFieldhandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    let list = [...MenuItemPortions];
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "ItemCode":
        list[i]["ItemCode"] = value;
        break;
      case "Name":
        list[i]["Name"] = value;
        break;
      case "Multiplier":
        list[i]["Multiplier"] = parseFloat(value);
        break;
      case "Price":
        list[i]["Price"] = parseFloat(value);
        break;
      case "Discount":
        list[i]["Discount"] = parseFloat(value);
        break;
      case "OpeningStockRate":
        list[i]["OpeningStockRate"] = parseFloat(value);
        list[i]["OpeningStockAmount"] =
          list[i].OpeningStockRate * list[i].OpeningStock;
        break;
      case "OpeningStock":
        list[i]["OpeningStock"] = parseFloat(value);
        list[i]["OpeningStockAmount"] =
          list[i].OpeningStockRate * list[i].OpeningStock;
        break;
      case "StockLimit":
        list[i]["StockLimit"] = parseFloat(value);
        break;
    }
    setData({ ...data, MenuItemPortions: list });
  };

  const AddPriceRange = (index: number) => {
    let selectedPriceRange: any =
      MenuItemPortions[index].MenuItemPortionPriceRanges;
    let itemList = MenuItemPortions;
    itemList[index].MenuItemPortionPriceRanges = [
      ...selectedPriceRange,
      { Id: 0, PositionId: 0, QtyMin: 0, QtyMax: 0, Price: 0 },
    ];
    setData({ ...data, MenuItemPortions: itemList });
  };

  const handleRemove = async (i: any,ind:number,index:number) => {

    if(i.Id &&i.Id>0){
      const response = await deletePriceRange(i.Id);
          if (response === 1) {
            deletePRMessage();
            let itemList = MenuItemPortions;
            itemList[index].MenuItemPortionPriceRanges.splice(ind,1);
            setData({ ...data, MenuItemPortions: itemList });
          } else {
            errorMessage();
          }
    }else
    {
   let itemList = MenuItemPortions;
   itemList[index].MenuItemPortionPriceRanges.splice(ind,1);
   setData({ ...data, MenuItemPortions: itemList });
    }       
  };

  const priceRangeOnChange = (e: IOnChange, index: number, i: number) => {
    let value = e.target.value;
    let name = e.target.name;

    let list = [...MenuItemPortions];

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
    setData({ ...data, MenuItemPortions: list });
  };

  const deleteRow = async (index: number, id: number) => {
    if (id && id > 0) {
      const response = await deleteProductItem(id);
      if (response === 1) {
        deleteRowMessage();
        let newPortion = [...MenuItemPortions];
        newPortion.splice(index, 1);
        setData({ ...data, MenuItemPortions: newPortion });
      } else {
        errorMessage();
      }
    } else {
      let newPortion = [...MenuItemPortions];
      newPortion.splice(index, 1);
      setData({ ...data, MenuItemPortions: newPortion });
    }
  };

  return (
    <>
      <Box sx={{ marginTop: 0 }}>
        <Grid container spacing={2}>
          {MenuItemPortions &&
            MenuItemPortions.map((item, index) => {
              return (
                <>
                  <Grid
                    container
                    py={4}
                    borderTop="solid 1px black"
                    borderBottom="solid 1px black"
                  >
                    <Grid
                      item
                      xs={12}
                      md={11}
                      key={index}
                      sx={{ marginTop: 2 }}
                    >
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Item code"
                              size="small"
                              name="ItemCode"
                              value={item ? item.ItemCode :""}
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Name"
                              size="small"
                              value={item ? item.Name : ""}
                              name="Name"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              id="outlined-required"
                              type="number"
                              label="Qty"
                              size="small"
                              value={item ? item.Multiplier : ""}
                              name="Multiplier"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Sales price"
                              size="small"
                              type="number"
                              value={item ? item.Price : ""}
                              name="Price"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Discount"
                              size="small"
                              type="number"
                              value={item ? item.Discount : ""}
                              name="Discount"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>                          
                        </Grid>
                      </Box>
                      {MenuItemPortions[index].MenuItemPortionPriceRanges?.map(
                        (price, i) => {
                          return (
                            <>
                              <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      fullWidth
                                      required
                                      id="outlined-required"
                                      type="number"
                                      label="Min Qty"
                                      size="small"
                                      value={price ? price.QtyMin : ""}
                                      name="QtyMin"
                                      InputProps={{ inputProps: { min: ""} }}
                                      onChange={(e: IOnChange) =>
                                        priceRangeOnChange(e, index, i)
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      fullWidth
                                      required
                                      id="outlined-required"
                                      type="number"
                                      label="max Qty"
                                      size="small"
                                      InputProps={{ inputProps: { min: "" } }}
                                      value={price ? price.QtyMax : ""}
                                      name="QtyMax"
                                      onChange={(e: IOnChange) =>
                                        priceRangeOnChange(e, index, i)
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      required
                                      fullWidth
                                      id="outlined-required"
                                      label="Sales price"
                                      size="small"
                                      type="number"
                                      value={price ? price.Price : ""}
                                      name="Price"
                                      InputProps={{ inputProps: { min: ""} }}
                                      onChange={(e: IOnChange) =>
                                        priceRangeOnChange(e, index, i)
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="warning"
                                      startIcon={<DeleteIcon />}
                                      sx={{ mx: 0, mt: 0.5 }}
                                      onClick={(e) => handleRemove(price,i,index)}
                                    >
                                      Remove
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </>
                          );
                        }
                      )}

                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<BiPlus />}
                          sx={{ mx: 0, mt: 2 }}
                          onClick={(e) => AddPriceRange(index)}
                        >
                          Add price range
                        </Button>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            {" "}
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Stock rate"
                              size="small"
                              type="number"
                              value={item ? item.OpeningStockRate : ""}
                              name="OpeningStockRate"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            {" "}
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Stock"
                              size="small"
                              type="number"
                              value={item ? item.OpeningStock : ""}
                              name="OpeningStock"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Stock Amount"
                              size="small"
                              type="number"
                              value={
                                item
                                  ? Number(item.OpeningStockRate * item.OpeningStock).toFixed(2)
                                  : ""
                              }
                              name="OpeningStock"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              required
                              fullWidth
                              id="outlined-required"
                              label="Stock Limit"
                              size="small"
                              type="number"
                              value={item ? item.StockLimit : ""}
                              name="StockLimit"
                              onChange={(e: IOnChange) =>
                                onChangeFieldhandler(e, index)
                              }
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid
                      key={`delete${index}`}
                      item
                      xs={12}
                      md={1}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 7,
                      }}
                    >
                      <Box>
                        {MenuItemPortions?.length > 1 ? (
                          <IconButton
                            color="error"
                            onClick={() => deleteRow(index, item.Id)}
                          >
                            <FiDelete />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </>
              );
            })}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<BiPlus />}
            sx={{ mx: 0, mt: 2 }}
            onClick={addNewRow}
          >
            Add
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ItemTableComponent;
