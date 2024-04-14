import { Paper, Grid, Box, Typography, TextField } from "@mui/material";
import { ImImage } from "react-icons/im";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { IProduct } from "../../../interfaces/posBiling";
import { useAppSelector } from "../../../app/hooks";
interface IProps {
  products: IProduct[];
  addNewProduct: (product: IProduct) => void;
}

const useStyles = makeStyles({
  imageIcon: {
    margin: "10px auto",
    fontSize: "75px",
    display: "block",
  },
});

const Products = ({ products, addNewProduct }: IProps) => {
  const currentTheme = useAppSelector((state) => state.theme.value);
  const [searchKey, setSearchKey] = useState("");
  const classes = useStyles();

  return (
    <>
      <Paper sx={{ p: 2, overflowX: "auto" }} style={{ height: "765px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Filter the products by their name"
              variant="outlined"
              value={searchKey ? searchKey : ""}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Grid>
          {products &&
            products
              .filter((data) => {
                if (searchKey === "") {
                  return data;
                } else if (
                  data.Name.toLowerCase().includes(
                    searchKey.toLocaleLowerCase()
                  )
                ) {
                  return data;
                }
              })
              .map((data, index) => {
                return (
                  <Grid item xs={6} md={6} lg={4} key={index}>
                    <Box
                      sx={
                        currentTheme === "dark"
                          ? { border: 1, borderRadius: 2, p: 2 }
                          : { boxShadow: 1, borderRadius: 2, p: 2 }
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => addNewProduct(data )}
                    >
                      <ImImage className={classes.imageIcon} />
                      <Typography sx={{ fontSize: 20, mt: 6 }}>
                        {data.Name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 16,
                          mt: 2,
                          bgcolor: "primary.main",
                          display: "inline-block",
                          px: 1,
                          borderRadius: 1,
                        }}
                        color="white"
                      >
                        Rs. {data.UnitPrice ? data.UnitPrice : 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 16,
                          mt: 2,
                          bgcolor: "primary.green",
                          display: "inline-block",
                          px: 1,
                          borderRadius: 1,
                        }}
                        color="red"
                      >
                        Rs. {Math.round(data.UnitPrice + data.UnitPrice * data.TaxRate/100)  ? Math.round(data.UnitPrice + data.UnitPrice * data.TaxRate/100) : 0}
                      </Typography>                      
                      <Typography
                        sx={{
                          fontSize: 16,
                          mt: 3,
                          bgcolor: "primary.main",
                          display: "inline-block",
                          px: 1,
                          borderRadius: 1,
                        }}
                        color="white"
                      >
                        Qty. {data.Qty ? data.Qty : 0}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
        </Grid>
      </Paper>
    </>
  );
};

export default Products;
