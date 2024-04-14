import { Switch, Route } from "react-router-dom";
import PageNotFound from "../views/404";
import Login from "../views/authentication/Login";
import AdminRoutes from "./AdminRoute";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoutes path="/" component={AdminRoutes} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
};

export default AppRoutes;
