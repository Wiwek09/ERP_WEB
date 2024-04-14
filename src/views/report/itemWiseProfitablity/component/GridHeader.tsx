import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { AddPageBtn, ExcelBtn, PDFBtn, PdfBtn } from "../../../../utils/buttons";
import { IProduct } from "../../../../interfaces/invoice";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";

interface ISmallTableHeader {
  itemId?: any;
  // setItemId?: any;
  setItemId: (value: any) => void;
  products: IProduct[];
  onClickHandler: (name: string, value: number | 0) => void;
  headerName?: string;
  pdf?: string;
  excel?: string;
  path?: string;
  print?: string;
  addDisable?: boolean;
  dateChoose: any;
  setDateChoose: any;
  getDataInSearch: any;
  fileName?: string;
  PDF?: string;
}

interface ISelect {
  label: string;
  value: number;
}
interface INormalizedProduct {
  id: number | null;
  label: string | null;
}

const GridHeader = ({
  itemId,
  setItemId,
  products,
  onClickHandler,
  headerName,
  pdf,
  excel,
  path,
  addDisable,
  dateChoose,
  setDateChoose,
  getDataInSearch,
  fileName,
  PDF,
}: ISmallTableHeader) => {
  const [productsData, setProductsData] = useState<INormalizedProduct[]>([]);
  const companyID = useAppSelector((state) => state.company.data.Id);

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

  return (
    <>
      <Paper
        sx={{
          position:"sticky",
          top: 60,
          mx: "auto",
          flexGrow: 1,
          p: 1,
          boxShadow: 2,
          zIndex: 3
        }}
        component="form"
        onSubmit={getDataInSearch}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
            marginBottom: 2,
          }}
          container
        >
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            {/* {headerName} */}
          </Typography>
        </Grid>
        <Grid
          spacing={2}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            px: 1,
            marginBottom: 1,
          }}
          container
        >
          <Grid
            item
            xs={12}
            md={3}
            lg={3}
            xl={2}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <TextField
              helperText="format: YYYY.MM.DD"
              label="Select From Date"
              required
              name="StartDate"
              size="small"
              inputProps={{
                pattern:
                  "((?:19|20)[0-9][0-9]).(0?[1-9]|1[012]).(0?[1-9]|[12][0-9]|3[02])",
              }}
              fullWidth
              value={dateChoose.StartDate ? dateChoose.StartDate : ""}
              onChange={(e) =>
                setDateChoose({
                  ...dateChoose,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            lg={3}
            xl={2}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <TextField
              helperText="format: YYYY.MM.DD"
              label="Select To Date"
              required
              name="EndDate"
              size="small"
              inputProps={{
                pattern:
                  "((?:19|20)[0-9][0-9]).(0?[1-9]|1[012]).(0?[1-9]|[12][0-9]|3[02])",
              }}
              fullWidth
              value={dateChoose.EndDate}
              onChange={(e) =>
                setDateChoose({
                  ...dateChoose,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            lg={3}
            xl={3}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={productsData}
              isOptionEqualToValue={(
                option: INormalizedProduct,
                value: INormalizedProduct
              ) => option.id === value.id}
              value={getSelectedProductData(itemId.ItemId)}
              renderInput={(params) => (
                <TextField {...params} label="Item name" />
              )}
              onChange={(
                event: any,
                newValue: INormalizedProduct | null
              ) => {
                setItemId( newValue && newValue.id);
              }}
              renderOption={handleRenderOption}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            lg={2}
            xl={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="success"
                startIcon={<BiSearch />}
              >
                GO
              </Button>
            </Box>
          </Grid>
          <Grid item lg={12} xl={4}>
            <Box
              sx={{
                display: "flex",
                marginX: 2,
                justifyContent: {
                  xs: "center",
                },
              }}
            >
              <ButtonGroup
                orientation="horizontal"
                aria-label="horizontal outlined button group"
              >
                {addDisable ? "" : <AddPageBtn path = {path} />}
                {pdf && <PdfBtn />}
                {excel && <ExcelBtn fileName={fileName} />}
                {PDF && <PDFBtn />}
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <br />
    </>
  );
};
export default GridHeader;
