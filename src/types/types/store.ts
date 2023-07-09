import { MenuDataInterface } from "./authority";
import { RoutesNameInterface } from "./authority";

export interface MenuStoreStateInterface {
  defaultOpen: Array<string>;
  defaultActive: string;
  menuIsCollapse: boolean;
  menuData: Array<MenuDataInterface>;
}

export interface UserStoreStateInterface {
  gxbuy_manager_jwt: string;
  userInfo: any;
  routesName: Array<RoutesNameInterface>;
  button: Array<string>;
}
