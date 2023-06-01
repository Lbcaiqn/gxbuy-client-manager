import request from "../config";
import { UserLoginParameter } from "@/types";

// export function userRegisterRequest(registerInfo: {
//   user_account: string;
//   user_name: string;
//   user_password: string;
//   code: string;
// }) {
//   return request({
//     url: "/user/register",
//     method: "post",
//     data: registerInfo,
//     withCredentials: true
//   });
// }

export function userLoginRequest(loginInfo: UserLoginParameter) {
  return request({
    url: "/user/login",
    method: "post",
    data: loginInfo
  });
}

export function getUserInfoRequest() {
  return request({
    url: "/user/jwt/getUserInfo"
  });
}
