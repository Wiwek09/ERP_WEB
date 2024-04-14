import { Switch, Route } from "react-router-dom";
import allRoutes from "./Routes";
import NavDrawer from "../components/navbar";
import CheckRole from "../userRoles";
import PageNotFound from "../views/404";
import { useEffect } from "react";

const AdminRoutes = () => {
  const pathname = window.location.pathname;
  const paths = pathname.split("/");
  const hostName = window.location.host;
  const invProData = hostName + "invProData";
  const purchaseProData = hostName + "purchaseProData";

  useEffect(() => {
    if (paths.includes("invoice")) {
      localStorage.removeItem(purchaseProData);
    } else if (paths.includes("purchase")) {
      localStorage.removeItem(invProData);
    } else if (paths.includes("products")) {
    } else {
      localStorage.removeItem(invProData);
      localStorage.removeItem(purchaseProData);
    }
  }, [hostName, invProData, paths, purchaseProData]);

  return (
    <>
      <NavDrawer>
        <Switch>
          {allRoutes.map((data, key) => (
            <Route
              key={key}
              exact
              path={data.path}
              render={() => (
                <CheckRole
                  permissionClass={
                    data.permissionClass ? data.permissionClass : null
                  }
                  component={<data.component />}
                />
              )}
            />
          ))}
          <Route component={PageNotFound} />
        </Switch>
      </NavDrawer>
    </>
  );
};

export default AdminRoutes;
