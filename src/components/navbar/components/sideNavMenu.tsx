import { List } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { INavMenu, ISubMenu } from "../../../interfaces/nav";
import menuItem from "./menuList";
import NavDrawer from "./navDrawer";

const getNormalizedPermissionList = (data: string) => {
  let permissionList = data?.split(",");
  return permissionList;
};

const SideNavMenu = () => {
  const userRoles = useAppSelector((state) => state.userRoles.data);
  const checkPermission = ({
    name,
    path,
    icon,
    permissionClass,
    subItem = [],
  }: INavMenu) => {
    let permissionList = getNormalizedPermissionList(userRoles?.PermissionList);
    if (permissionClass === null && subItem.length === 0) {
      return {
        name: name,
        path: path,
        icon: icon,
        permissionClass: permissionClass,
      };
    }
    if (permissionClass && subItem.length === 0) {
      for (let index = 0; index < permissionList?.length; index++) {
        const element = permissionList[index];

        if (permissionClass?.toLowerCase() === element.toLowerCase()) {
          return {
            name: name,
            path: path,
            icon: icon,
            permissionClass: permissionClass,
          };
        }
      }
      return false;
    }
    let navSubHolder: ISubMenu[] = [];
    subItem.forEach((element) => {
      if (element.name !== null) {
        if (permissionList?.find((data) => data === element.name)) {
          navSubHolder.push(element);
        }
      }
    });
    if (navSubHolder.length > 0) {
      return {
        name: name,
        path: path,
        icon: icon,
        subItem: navSubHolder,
      };
    }
    return false;
  };

  const permittedNavMenus: INavMenu[] = [];
  let permissionList = getNormalizedPermissionList(userRoles?.PermissionList);
  menuItem.forEach((element) => {
    const permittedNav = checkPermission({
      name: element.name,
      path: element.path,
      icon: element.icon,
      permissionClass: element.permissionClass ? element.permissionClass : null,
      subItem: element.subItem,
    });
    if (permittedNav !== false) {
      permittedNavMenus.push(permittedNav);
    }
  });

  return (
    <>
      <List
        sx={{ maxWidth: 360 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {permittedNavMenus.map((list) => (
          <NavDrawer
            key={list.name}
            name={list.name}
            icon={list.icon}
            path={list.path}
            subItem={list.subItem}
          />
        ))}
      </List>
    </>
  );
};

export default SideNavMenu;
