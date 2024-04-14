interface IRole {
  UserId: string;
  RoleId: string;
}

export interface IUser {
  Claims: any[];
  Logins: any[];
  Roles: IRole[];
  FullName: string;
  UserName: string;
  Password: string;
  FirstName: string;
  LastName: string;
  RoleName: string;
  Level: number;
  Email: string;
  PhoneNumber?: any;
  IsActive: boolean;
  ResetPassword: boolean;
  JoinDate: string;
  Token?: any;
  EmailConfirmed: boolean;
  PasswordHash?: any;
  SecurityStamp?: any;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEndDateUtc?: any;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
  Id: string;
}

export interface IUserLogin {
  UserName: string;
  Password: string;
  RememberMe?: boolean;
  showPassword?: boolean;
  financialYearValue?: number;
}
