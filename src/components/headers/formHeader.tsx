import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconButton, Paper, Tooltip } from "@mui/material";
import { BiLeftArrowCircle } from "react-icons/bi";
import { useHistory } from "react-router";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
interface IProps {
  headerName: string;
  path?: string;
}

const FormHeader = ({ headerName, path }: IProps) => {
  const history = useHistory();

  return (
    <>
      <Paper
        sx={{
          position:"sticky",
          mx: "auto",
          top: 65,
          flexGrow: 1,
          py: 1,
          borderRadius: 1,
          boxShadow: 3,
          zIndex: 3,
        }}
      >
        <Grid
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            px: { xs: 1, md: 2, lg: 3 },
          }}
          container
        >
          <Grid
            item
            xs={10}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Item
              sx={{
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              {headerName}
            </Item>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Item
              sx={{
                fontSize: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Tooltip title="Go Back" followCursor={true}>
                <IconButton
                  sx={{ fontSize: "2.1rem" }}
                  color="primary"
                  onClick={() => (path ? history.push(path) : history.goBack())}
                >
                  <BiLeftArrowCircle style={{ cursor: "pointer" }} />
                </IconButton>
              </Tooltip>
            </Item>
          </Grid>
        </Grid>
      </Paper>
      <br />
    </>
  );
};
export default FormHeader;
