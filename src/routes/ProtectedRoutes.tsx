import { Route } from "react-router-dom";
import { Redirect, RouteProps } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LoaderIdentifier from "../components/LoaderIdentifier";
import { useEffect, useState } from "react";
import { verifyUser } from "../services/userApi";
import { IUserLogin } from "../interfaces/user";
import { AxiosResponse } from "axios";
import { setUserAction } from "../features/userSlice";
import { clearRememberUserAction } from "../features/userRememberSlice";
import { getCompanyApi } from "../services/companyApi";
import { setCompanyAction } from "../features/companySlice";

interface IPermission {
  permission: "yes" | "no" | "loading";
}
const ProtectedRoutes = ({ ...rest }: RouteProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const rememberUser = useAppSelector((state) => state.userRemember.data);
  const [hasPermission, setHasPermission] = useState<IPermission>({
    permission: "loading",
  });

  // Function to set roles
  const setAuthentication = async ({ UserName, Password }: IUserLogin) => {
    try {
      const response: AxiosResponse<any, any> = await verifyUser({
        UserName: UserName,
        Password: Password,
      });
      dispatch(setUserAction(response.data));
      setHasPermission({ permission: "yes" });
    } catch {
      dispatch(clearRememberUserAction());
      setHasPermission({ permission: "no" });
    }
  };
  const getCompnay = async () => {
    const data = await getCompanyApi();
    if (data !== -1) {
      dispatch(setCompanyAction(data));
    }
  };

  useEffect(() => {
    if (rememberUser.RememberMe) {
      setAuthentication({
        UserName: rememberUser.UserName,
        Password: rememberUser.Password,
      });
    }
    getCompnay();
  }, []);

  if (user.Id.length > 0) {
    return <Route {...rest} />;
  } else if (rememberUser.RememberMe) {
    if (hasPermission.permission === "loading") {
      return <LoaderIdentifier />;
    } else if (hasPermission.permission === "no") {
      return <Redirect to="/login" />;
    } else {
      return <Route {...rest} />;
    }
  } else {
    return <Redirect to="/login" />;
  }
};

export default ProtectedRoutes;
