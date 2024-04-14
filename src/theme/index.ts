import { PaletteMode } from "@mui/material";
const getDesignTokens = (mode: PaletteMode) => ({
  components:{
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: "solid",
          borderColor: "#d9d9d9",
          borderWidth:'1px',
        }
      }
    }
  },
  palette: {
    mode,
    // This is for light mode
    ...(mode === "light"
      ? {
          background: {
            default: "#F7F7F7",
            paper: "#EEEEEE",
            navBar: "#002884",
          },
          primary: {
            light: "#757ce8",
            main: "#3f50b5",
            dark: "#002884",
            contrastText: "#fff",
            dashboard: "#fff",
            mainTableHeader:'#D0D0D0',
            mainTableContent:'#E0E0E0',
            mainTableSubContent:'#E7E7E7',
            tableHeader: "#f5f5f5",//items Table Header
            tableContent: "#fff"//items Table Content
          },
          divider: "#d9d9d9",
          text: {
            primary: "#36454F",
            secondary: "#404040",
            light: "#fff",
            dashboard: "#fff",
          },
        }
      : // This is for dark mode
        {
          primary: {
            main: "#ff7400",
            light: "#ffbc8c",
            dark: "#ff7400",
            contrastText: "#fff",
            mainTableHeader:'#242936',
            mainTableContent:'#2e313d',
            mainTableSubContent:'#373b49',
            tableHeader: "#242936",
            tableContent: "#2E313D"
          },

          divider: "#000",
          background: {
            default: "#242936",
            paper: "#2c313f",
          },
          text: {
            primary: "#d6d6d6",
            secondary: "#d6d6d6",
            light: "#d6d6d6",
            dashboard: "#fff",
          },
        }),
  },
});

export default getDesignTokens;
