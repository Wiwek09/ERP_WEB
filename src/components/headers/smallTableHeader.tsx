import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TextField, ButtonGroup, Paper } from "@mui/material";
import { AddPageBtn, ExcelBtn, PDFBtn, PdfBtn } from "../../utils/buttons";
import handleRenderOption from "../../utils/autoSuggestHighlight";
import { setDefaultDateAction } from "../../features/defaultDateSlice";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface ISmallTableHeader {
  headerName: string;
  pdf?: string;
  excel?: string;
  path?: string;
  PDF?: string;
  addDisable?: boolean;
  searchData? : any;
  setData?: any;
}

const SmallGridHeader = ({
  headerName,
  pdf,
  PDF,
  excel,
  path,
  addDisable,
  searchData,
  setData
}: ISmallTableHeader) => {
  return (
    <>
      <Paper
        sx={{
          position:'sticky',
          top:65,
          mx: "auto",
          flexGrow: 1,
          py: 1,
          boxShadow: 2,
          zIndex:3
        }}
      >
        <Grid
          spacing={2}
          sx={{ display: "flex", alignItems: "center", px: 1 }}
          container
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={3}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <Item
              sx={{
                fontSize: "1.4rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                color: "text.primary",
              }}
            >
              {headerName}
            </Item>
          </Grid>
          {searchData
          ?(
            <Grid item xs>
              <TextField
                label="Search By Product Name"
                name="Product"
                size="small"
                fullWidth
                onChange={(e) => {
                  const filteredData = searchData.filter((data:any)=>{
                    return data.Name.toLowerCase().includes(e.target.value.toLowerCase());
                  })
                  setData(filteredData);
                }
                }
              />
            </Grid>
          )
          :''}
          <Grid item xs>
            <Item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "center",
                    lg: "flex-end",
                  },
                }}
              >
                <ButtonGroup
                  orientation="horizontal"
                  aria-label="horizontal outlined button group"
                >
                  {addDisable ? "" : <AddPageBtn path={path} />}
                  {pdf && <PdfBtn />}
                  {excel && <ExcelBtn />}
                  {PDF && <PDFBtn />}
                </ButtonGroup>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Paper>
      <br />
    </>
  );
};
export default SmallGridHeader;
