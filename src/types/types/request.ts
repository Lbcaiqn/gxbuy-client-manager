export interface UserLoginParameter {
  shopAccount: string;
  shopPassword: string;
  userAccount: string;
  userPassword: string;
}

export interface GetGoodsSpuListParameter {
  pageSize?: number;
  page?: number;
}

export interface GetGoodsSkuListParameter {
  goodsSpuId: string;
}

export interface CreateGoodsSpuParameter {
  goodsSpuName: string;
  goodsSpuMainImg: string;
  bannerImgList: Array<string>;
  detailImgList: Array<string>;
  c1id: number;
  c2id: number;
  c3id: number;
  spuSalesAttrs: Array<{ name: string; values: Array<string> }>;
}

export interface CreateGoodsSkuParameter {
  goodsSkuName: string;
  goodsSkuImg: string;
  goodsSkuPrice: string;
  goodsSkuStock: number;
  skuSalesAttrs: Array<{ name: string; value: string }>;
  goodsSpuId: string;
}

export interface UpdateGoodsSpuParameter extends CreateGoodsSpuParameter {
  goodsSpuId: string;
}

export interface UpdateGoodsSkuParameter extends CreateGoodsSkuParameter {
  goodsSkuId: string;
}

export interface GroundGoodsParameter {
  goodsSkuId?: string;
  goodsSpuId?: string;
  ground: boolean;
}

export interface ResultWithTotal {
  total?: number;
  data?: Array<any>;
}

export interface GetRoleListParameter {
  pageSize?: number;
  page?: number;
  goodsSpuId?: string;
}

export interface RoleAuthorityInterface {
  _id: number;
  name: string;
  title: string;
  button?: { name: string; value: string };
  children?: Array<CreateRoleParameter>;
}

export interface CreateRoleParameter {
  roleName: string;
  authority: Array<RoleAuthorityInterface>;
}

export interface UpdateRoleParameter extends CreateRoleParameter {
  roleId: string;
}

export interface GetManagerListParameter {
  pageSize?: number;
  page?: number;
  goodsSpuId?: string;
}

export interface CreateManagerParameter {
  managerAccount: string;
  managerPassword: string;
  managerName: string;
  roleIds: Array<string>;
}

export interface UpdateManagerParameter {
  managerAccount: string;
  managerName: string;
  roleIds: Array<string>;
  managerId: string;
}
