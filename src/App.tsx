import { ThemeProvider, createTheme } from "@mui/material/styles";
import getDesignTokens from "./theme";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { useAppSelector } from "./app/hooks";

function App() {
  const currentTheme = useAppSelector((state) => state.theme.value);
  const theme = createTheme(
    getDesignTokens(currentTheme === "dark" ? "dark" : "light")
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ToastContainer autoClose={1500} />
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
