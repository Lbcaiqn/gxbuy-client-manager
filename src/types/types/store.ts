import { MenuDataInterface } from "./authority";
import { RoutesNameInterface } from "./authority";

export interface MenuStoreStateInterface {
  menuIsCollapse: boolean;
  menuData: Array<MenuDataInterface>;
}

export interface HeaderStoreStateInterface {
  breadCrumb: Array<string>;
}

export interface UserStoreStateInterface {
  gxbuy_manager_jwt: string;
  userInfo: any;
  routesName: Array<RoutesNameInterface>;
  button: Array<string>;
}
