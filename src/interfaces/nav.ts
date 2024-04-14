export interface ISubMenu {
  name: string;
  path: string;
  icon: any;
  permissionClass?: string | null;
}

export interface INavMenu {
  name: string;
  path?: string;
  icon: any;
  permissionClass?: string | null;
  subItem?: ISubMenu[];
}
