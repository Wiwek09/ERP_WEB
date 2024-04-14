export interface IRoute {
  name: string;
  path: string;
  component: any;
  exact: boolean;
  permissionClass?: string | null;
}
