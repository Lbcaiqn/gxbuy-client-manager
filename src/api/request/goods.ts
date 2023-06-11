import request from "../config";
import {
  GetGoodsSpuListParameter,
  GetGoodsSkuListParameter,
  CreateGoodsSpuParameter,
  CreateGoodsSkuParameter,
  UpdateGoodsSpuParameter,
  UpdateGoodsSkuParameter,
  GroundGoodsParameter
} from "@/types";

export function getCategoryDataRequest() {
  return request({
    url: "/goods/getCategoryData"
  });
}

export function getGoodsSpuListRequest(parameter: GetGoodsSpuListParameter) {
  return request({
    url: "/goods/jwt/getGoodsSpuList",
    params: parameter
  });
}

export function getGoodsSkuListRequest(parameter: GetGoodsSkuListParameter) {
  return request({
    url: "/goods/jwt/getGoodsSkuList",
    params: parameter
  });
}

export function createGoodsSpuRequest(parameter: CreateGoodsSpuParameter) {
  return request({
    url: "/goods/jwt/createGoodsSpu",
    method: "post",
    data: parameter
  });
}

export function createGoodsSkuRequest(parameter: CreateGoodsSkuParameter) {
  return request({
    url: "/goods/jwt/createGoodsSku",
    method: "post",
    data: parameter
  });
}

export function updateGoodsSpuRequest(parameter: UpdateGoodsSpuParameter) {
  return request({
    url: "/goods/jwt/updateGoodsSpu",
    method: "patch",
    data: parameter
  });
}

export function updateGoodsSkuRequest(parameter: UpdateGoodsSkuParameter) {
  return request({
    url: "/goods/jwt/updateGoodsSku",
    method: "patch",
    data: parameter
  });
}

export function deleteGoodsSpuRequest(goodsSpuId: string) {
  return request({
    url: "/goods/jwt/deleteGoodsSpu/" + goodsSpuId,
    method: "delete"
  });
}

export function deleteGoodsSkuRequest(goodsSkuId: string) {
  return request({
    url: "/goods/jwt/deleteGoodsSku/" + goodsSkuId,
    method: "delete"
  });
}

export function groundGoodsRequest(parameter: GroundGoodsParameter) {
  return request({
    url: "/goods/jwt/groundGoods",
    method: "patch",
    data: parameter
  });
}
