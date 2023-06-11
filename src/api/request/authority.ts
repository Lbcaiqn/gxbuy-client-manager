import request from "../config";
import {
  GetRoleListParameter,
  CreateRoleParameter,
  UpdateRoleParameter,
  GetManagerListParameter,
  CreateManagerParameter,
  UpdateManagerParameter
} from "@/types";

export function getAuthorityDataRequest() {
  return request({
    url: "/authority/getAuthorityData"
  });
}

export function getRoleListRequest(parameter: GetRoleListParameter) {
  return request({
    url: "/authority/jwt/getRoleList",
    params: parameter
  });
}

export function createRoleRequest(parameter: CreateRoleParameter) {
  return request({
    url: "/authority/jwt/addRole",
    method: "post",
    data: parameter
  });
}

export function updateRoleRequest(parameter: UpdateRoleParameter) {
  return request({
    url: "/authority/jwt/updateRole",
    method: "patch",
    data: parameter
  });
}

export function deleteRoleRequest(roleId: string) {
  return request({
    url: "/authority/jwt/deleteRole/" + roleId,
    method: "delete"
  });
}

export function getRoleDataRequest() {
  return request({
    url: "/authority/jwt/getRoleData"
  });
}

export function getManagerListRequest(parameter: GetManagerListParameter) {
  return request({
    url: "/authority/jwt/getManagerList",
    params: parameter
  });
}

export function createManagerRequest(parameter: CreateManagerParameter) {
  return request({
    url: "/authority/jwt/addManager",
    method: "post",
    data: parameter
  });
}

export function updateManagerRequest(parameter: UpdateManagerParameter) {
  return request({
    url: "/authority/jwt/updateManager",
    method: "patch",
    data: parameter
  });
}

export function deleteManagerRequest(managerId: string) {
  return request({
    url: "/authority/jwt/deleteManager/" + managerId,
    method: "delete"
  });
}
