import { useAppDispatch, useAppSelector } from "../app/hooks";
import LoaderIdentifier from "../components/LoaderIdentifier";
import { useEffect, useState } from "react";
import { getRolesApi } from "../services/userApi";
import { IRoles } from "../interfaces/roles";
import { setUserRoleAction } from "../features/userRolesSlice";
import { Typography } from "@mui/material";

interface ICheckRoles {
  permissionClass: string | null;
  component?: any;
}
interface IPermission {
  permission: "yes" | "no" | "loading";
}

const normalizeRoles = (data: IRoles) => {
  let rolesData = {
    RoleName: data.RoleName,
    Description: data.Description,
    PermissionList: data.PermissionList,
    Selected: data.Selected,
    IsAdd: data.IsAdd,
    IsEdit: data.IsEdit,
    IsDelete: data.IsDelete,
    IsView: data.IsView,
    CreatedOn: data.CreatedOn,
    CreatedBy: data.CreatedBy,
    LastChangedDate: data.LastChangedDate,
    LastChangedBy: data.LastChangedBy,
    IsSysAdmin: data.IsSysAdmin,
    Id: data.Id,
    Name: data.Name,
  };
  return rolesData;
};

const CheckRole = ({ permissionClass, component }: ICheckRoles) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const [hasPermission, setHasPermission] = useState<IPermission>({
    permission: "loading",
  });

  const checkPermission = async () => {
    const response = await getRolesApi(user.Roles[0].RoleId);
    if (response) {
      const data = await normalizeRoles(response[0]);
      dispatch(setUserRoleAction(data));
      let permission = data.PermissionList.split(",");
      let isPermissionSuccess = false;
      if (permissionClass === null) {
        isPermissionSuccess = true;
      }
      for (let index = 0; index < permission.length; index++) {
        const element = permission[index];
        if (permissionClass !== null) {
          if (data.IsView === null || data.IsView === true) {
            setHasPermission({ permission: "yes" });
            isPermissionSuccess = true;
          }
          break;
        }
      }
      if (!isPermissionSuccess) {
        setHasPermission({ permission: "no" });
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [permissionClass]);
  if (hasPermission.permission === "loading") {
    return <LoaderIdentifier />;
  } else if (hasPermission.permission === "no") {
    return (
      <Typography>Sorry, you are not permitted to access this page.</Typography>
    );
  } else {
    return component;
  }
};

export default CheckRole;
