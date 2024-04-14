import {
  DataGrid,
  GridOverlay,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";
import { makeStyles } from "@mui/styles";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const StyledDataGrid = styled(DataGrid)`
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus {
    outline: none;
  }
`;

const useStyles = makeStyles({
  root: {
    "& .super-app-theme--header": {
      fontSize: "1rem",
    },
  },
});

export default function SmallTableContainer({
  loading,
  Rows,
  Columns,
}: {
  loading: boolean;
  Rows: any[];
  Columns: any[];
}) {
  const classes = useStyles();
  return (
    <Paper>
      <div
        style={{
          height: "auto",
          margin: "auto",
        }}
        className={classes.root}
      >
        <StyledDataGrid
          disableRowSelectionOnClick
          disableColumnSelector
          scrollbarSize={17}
          hideFooterPagination
          components={{
            Toolbar: CustomToolbar,
            LoadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
          columns={Columns}
          rows={Rows && Rows}
        />
      </div>
    </Paper>
  );
}
