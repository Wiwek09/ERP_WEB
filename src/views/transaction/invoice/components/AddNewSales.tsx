import {
  Grid,
  IconButton,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { ISelectedProduct } from "../interfaces";
import { useEffect, useState } from "react";
import { IProduct } from "../../../../interfaces/invoice";
import { IoMdAdd } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import { useHistory } from "react-router";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";

interface IProps {
  selectedProducts: ISelectedProduct[];
  products: IProduct[];
  addNewProduct: () => void;
  updateSelectedProduct: (
    index: number,
    name: string,
    value: any,
    itemId?: number | null
  ) => void;
  deleteProduct: (index: number) => void;
}

interface INormalizedProduct {
  id: number | null;
  label: string | null;
}

const AddNewSales = ({
  products,
  addNewProduct,
  selectedProducts,
  updateSelectedProduct,
  deleteProduct,
}: IProps) => {
  const history = useHistory();

  const [productsData, setProductsData] = useState<INormalizedProduct[]>([]);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    setProductsData(
      products.map((data) => {
        return { id: data.Id, label: data.Name };
      })
    );
  }, [products]);

  const getSelectedProductData = (id: any): INormalizedProduct | null => {
    for (let index = 0; index < productsData.length; index++) {
      const element = productsData[index];
      if (element.id === id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  const handleFocus = () => {
    setFocus(true);
  };
  const handleNewFocus = () => {
    setFocus(false);
  };

  return (
    <>
      <Box sx={{ marginTop: 7 }}>
        {selectedProducts &&
          selectedProducts.map((data, index) => {
            return (
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} key={index} sx={{ marginTop: 2 }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ width: "calc(100% - 50px)", float: "left" }}
                  >
                    <Grid item xs={12} md={12} lg={6}>
                      <Autocomplete
                        style={{ width: "calc(100% - 50px)", float: "left" }}
                        disablePortal
                        onClick={handleNewFocus}
                        options={productsData}
                        size="small"
                        isOptionEqualToValue={(
                          option: INormalizedProduct,
                          value: INormalizedProduct
                        ) => option.id === value.id}
                        value={getSelectedProductData(data.ItemId)}
                        renderInput={(params) => (
                          <TextField {...params} label="Product name" />
                        )}
                        onChange={(
                          event: any,
                          newValue: INormalizedProduct | null
                        ) => {
                          updateSelectedProduct(
                            index,
                            "Product",
                            newValue && newValue.id
                          );
                        }}
                        renderOption={handleRenderOption}
                      />
                      <IconButton
                        style={{
                          float: "left",
                          width: "45px",
                          height: "38px",
                          marginLeft: "5px",
                        }}
                        sx={{ border: 1, borderRadius: 1 }}
                        onClick={(e) => history.push("/products/add")}
                      >
                        <MdAddToPhotos />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                      <TextField
                        size="small"
                        fullWidth
                        name=""
                        onClick={handleFocus}
                        label="Quantity"
                        InputProps={{ inputProps: { min: "" } }}
                        value={data.Qty ? data.Qty : ""}
                        type="number"
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "Qty",
                            e.target.value,
                            data.ItemId
                          )
                        }
                      />
                    </Grid>
                    {focus === true ? (
                      <Grid item xs={12} md={3} lg={3}>
                        <TextField
                          value={data.CurrentStock}
                          fullWidth
                          label="Current Stock"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} md={3} lg={3}>
                        <TextField
                          value={data.CurrentStock || 0}
                          fullWidth
                          label="Current Stock"
                          InputLabelProps={{ shrink: true }}
                          size="small"
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={3} lg={3}>
                      <TextField
                        size="small"
                        fullWidth
                        name="Rate"
                        label="Rate"
                        type="number"
                        InputProps={{ inputProps: { min: "" } }}
                        value={data.UnitPrice ? data.UnitPrice : ""}
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "UnitPrice",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      <Autocomplete
                        disablePortal
                        fullWidth
                        size="small"
                        options={[
                          { id: "Percent", label: "Percent" },
                          { id: "Fixed", label: "Fixed" },
                        ]}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={
                          data && data.DiscountType
                            ? {
                                id: data.DiscountType,
                                label: data.DiscountType,
                              }
                            : null
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Discount type" />
                        )}
                        onChange={(e, values) =>
                          updateSelectedProduct(
                            index,
                            "DiscountType",
                            values && values.id
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                      <TextField
                        size="small"
                        fullWidth
                        name="Discount"
                        label="Discount"
                        value={data.Discount ? data.Discount : ""}
                        type="number"
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "DiscountE",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                      <TextField
                        size="small"
                        fullWidth
                        name="Rate"
                        label="After Excise Duty"
                        type="number"
                        value={data.ExcriseDutyAmount}
                      />
                    </Grid>

                    <Grid item xs={12} md={4} lg={4}>
                      <TextField
                        size="small"
                        fullWidth
                        name="Rate"
                        label="After VAT"
                        type="number"
                        value={Number(data.AmountAfterVat).toFixed(2)}
                      />
                    </Grid>

                    <Grid item xs={12} md={4} lg={4}>
                      <TextField
                        size="small"
                        fullWidth
                        name="Amount"
                        label="Amount"
                        type="number"
                        value={Number(data.TotalAmount).toFixed(2)}
                      />
                      {selectedProducts.length - 1 === index ? (
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: 5,
                            }}
                          >
                            <Box>
                              <Button
                                variant="outlined"
                                onClick={addNewProduct}
                              >
                                <IoMdAdd /> Add
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    key={`delete${index}`}
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    {selectedProducts.length > 1 ? (
                      <Box>
                        <IconButton onClick={() => deleteProduct(index)}>
                          <BackspaceIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Box>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            );
          })}

        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 3,
            }}
          >
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Button variant="outlined" onClick={addNewProduct}>
                <IoMdAdd /> Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddNewSales;
