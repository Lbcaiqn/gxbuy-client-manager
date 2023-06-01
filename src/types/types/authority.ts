export interface RoutesNameInterface {
  name: string;
  children?: Array<RoutesNameInterface>;
}

export interface MenuDataInterface {
  path: string;
  title: string;
  icon: string;
  children?: Array<MenuDataInterface>;
}
