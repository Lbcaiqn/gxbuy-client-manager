import request from "../config";

export function getSalesDataRequest() {
  return request({
    url: "/order/jwt/getSalesData"
  });
}
