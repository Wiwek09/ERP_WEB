export interface IRoles {
  RoleName: string | null;
  Description: string;
  PermissionList: string;
  Selected: boolean | null;
  IsAdd: boolean | null;
  IsEdit: boolean | null;
  IsDelete: boolean | null;
  IsView: boolean | null;
  CreatedOn: boolean | null;
  CreatedBy: boolean | null;
  LastChangedDate: boolean | null;
  LastChangedBy: boolean | null;
  IsSysAdmin: boolean;
  Id: string;
  Name: string;
}

export interface IUserRolesAssign {
  Claims?: any[];
  Logins?: any[];
  Roles?: Role[];
  FullName?: any;
  UserName?: string;
  Password?: string;
  FirstName?: string;
  LastName?: string;
  RoleName: string;
  Level?: number;
  Email?: string;
  PhoneNumber?: any;
  IsActive?: boolean;
  ResetPassword?: boolean;
  JoinDate?: string;
  Token?: any;
  EmailConfirmed?: boolean;
  PasswordHash?: any;
  SecurityStamp?: any;
  PhoneNumberConfirmed?: boolean;
  TwoFactorEnabled?: boolean;
  LockoutEndDateUtc?: any;
  LockoutEnabled?: boolean;
  AccessFailedCount?: number;
  Id?: string;
}
interface Role {
  UserId: string;
  RoleId: string;
}
