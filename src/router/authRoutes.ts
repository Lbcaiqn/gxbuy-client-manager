import router from "./index.ts";
import { RouteRecordRaw } from "vue-router";
import store from "@/store";
import { RoutesNameInterface, MenuDataInterface } from "@/types";
import { deepCopy } from "@/tools/deepCopy";

/* 示例路由
 * 若下面有路由已存在的路由也没关系，动态添加时不影响，放在这里可以方便取出菜单信息
 * 默认路由不能先定义，因为胡无法确定定义的默认路由筛选后还是否存在
 */
const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/authorityManage",
    name: "authorityManage",
    component: () => import("@/views/AuthorityManage/AuthorityManage.vue"),
    meta: {
      useLayout: true,
      jwt: true,
      menuData: {
        title: "权限管理",
        icon: "lock"
      }
    },
    children: [
      {
        path: "roleManage",
        name: "roleManage",
        component: () => import("@/views/AuthorityManage/children/RoleManage.vue"),
        meta: {
          useLayout: true,
          jwt: true,
          menuData: {
            title: "角色管理",
            icon: "CreditCard"
          }
        }
      },
      {
        path: "userManage",
        name: "userManage",
        component: () => import("@/views/AuthorityManage/children/UserManage.vue"),
        meta: {
          useLayout: true,
          jwt: true,
          menuData: {
            title: "用户管理",
            icon: "user-filled"
          }
        }
      }
    ]
  },
  {
    path: "/goodsManage",
    name: "goodsManage",
    component: () => import("@/views/GoodsManage/GoodsManage.vue"),
    meta: {
      useLayout: true,
      jwt: true,
      menuData: {
        title: "商品管理",
        icon: "DocumentCopy"
      }
    }
  }
  // {
  //   path: "/orderManage",
  //   name: "orderManage",
  //   component: () => import("@/views/OrderManage/OrderManage.vue"),
  //   meta: {
  //     useLayout: true,
  //     jwt: true,
  //     menuData: {
  //       title: "订单管理",
  //       icon: "user-filled"
  //     }
  //   },
  //   children: [
  //     {
  //       path: "logisticsManage",
  //       name: "logisticsManage",
  //       component: () => import("@/views/OrderManage/children/LogisticsManage.vue"),
  //       meta: {
  //         useLayout: true,
  //         jwt: true,
  //         menuData: {
  //           title: "物流管理",
  //           icon: "user-filled"
  //         }
  //       }
  //     },
  //     {
  //       path: "commentManage",
  //       name: "commentManage",
  //       component: () => import("@/views/OrderManage/children/CommentManage.vue"),
  //       meta: {
  //         useLayout: true,
  //         jwt: true,
  //         menuData: {
  //           title: "评论管理",
  //           icon: "user-filled"
  //         }
  //       }
  //     }
  //   ]
  // }
];

// 根据后端返回的该用户具有的菜单name，筛选出对应的路由
function filterAuthRoutes(
  routesName: Array<RoutesNameInterface>,
  authRoutesData: Array<RouteRecordRaw> = authRoutes
): Array<RouteRecordRaw> {
  const result: Array<RouteRecordRaw> = [];
  const authRoutesDataCopy = deepCopy(authRoutesData);

  for (const item of routesName) {
    for (let route of authRoutesDataCopy) {
      if (item.name === route.name) {
        if (item?.children?.length! > 0) {
          route.children = filterAuthRoutes(item.children!, route.children);
        } else delete route.children;

        result.push(route);
      }
    }
  }
  return result;
}

// 获取路由meta中的菜单信息，若后端已返回菜单信息可忽略此函数
function getMenuData(routes: Array<RouteRecordRaw>, parentPath: string = ""): Array<MenuDataInterface> {
  const menuData: Array<MenuDataInterface> = [];

  for (let i of routes) {
    if (["", "/"].includes(i.path)) continue;
    if (!i?.meta?.menuData) continue;

    if (i?.children?.length! > 0) {
      menuData.push({
        path: i.path,
        title: (i?.meta?.menuData as any).title,
        icon: (i?.meta?.menuData as any).icon,
        children: getMenuData(i.children!, parentPath + i.path + "/")
      });
    } else menuData.push({ path: parentPath + i.path, ...(i?.meta?.menuData as object) } as MenuDataInterface);
  }

  return menuData;
}

// 如果想给每个子路由都增加默认路由，可使用此函数

function addDefaultRoute(routes: Array<RouteRecordRaw>, parentPath: string = ""): Array<RouteRecordRaw> {
  for (let index in routes) {
    if (index === "0") {
      routes.push({
        path: "",
        name: String(routes[index].name) + "DefaultRoute",
        redirect: parentPath + routes[index].path
      });
    }
    if (routes[index]?.children?.length! > 0) {
      addDefaultRoute(routes[index].children!, parentPath + routes[index].path + "/");
    }
  }
  return routes;
}

export async function addAuthRoutes(routesName: Array<RoutesNameInterface>) {
  // 筛选路由并增加默认路由
  const routes = addDefaultRoute(filterAuthRoutes(routesName));

  // 保证此时router已挂在完毕，再动态添加路由
  await router.isReady();
  for (let i of routes) router.addRoute(i);

  // 菜单信息存储到pinia中
  const menuStore = store.state.value.Menu;
  menuStore.menuData = getMenuData([...router.options.routes, ...routes, routes] as Array<RouteRecordRaw>);
}
