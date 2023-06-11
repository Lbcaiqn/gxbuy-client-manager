<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { getGoodsSkuListRequest, deleteGoodsSkuRequest, groundGoodsRequest } from "@/api";
import { formatDate } from "@/tools/formatDate";
import { myMessage } from "@/tools/myMessage";
import SkuForm from "./SkuForm.vue";

const props = withDefaults(defineProps<{ spu: any }>(), {
  spu: () => {
    return {};
  }
});

const emit = defineEmits(["back"]);

const skuList = ref<any>({});
const showOperateDialog = ref(false);
const operateDialogTitle = ref("");

async function init() {
  try {
    skuList.value = (
      await getGoodsSkuListRequest({
        goodsSpuId: props.spu._id
      })
    ).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

watch(
  () => props.spu,
  () => {
    if (props.spu._id) init();
  }
);

const currentOperateSku = ref<any>({});

function addSku() {
  currentOperateSku.value = {};
  showOperateDialog.value = true;
  operateDialogTitle.value = "新增SKU";
}

async function updateSku(sku: any) {
  currentOperateSku.value = {};
  await nextTick();
  currentOperateSku.value = sku;
  showOperateDialog.value = true;
  operateDialogTitle.value = "修改SKU";
}

// cancel -------------------------------------------------------------
function cancel() {
  showOperateDialog.value = false;
}

// refreshData -----------------------------------------------------
async function refreshData() {
  showOperateDialog.value = false;
  try {
    skuList.value = (
      await getGoodsSkuListRequest({
        goodsSpuId: props.spu._id
      })
    ).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

// 删除 -----------------------------------------------------------------
const showDeleteDialog = ref(false);
const currentDeleteSkuId = ref("");

function deleteSku(sku: any) {
  showDeleteDialog.value = true;
  currentDeleteSkuId.value = sku._id;
}

async function confirmDelete() {
  try {
    const res = await deleteGoodsSkuRequest(currentDeleteSkuId.value);
    myMessage(res.data, "success");
    showDeleteDialog.value = false;
    init();
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

// 上下架 ------------------------------------------------------------------
async function groundGoods(type: "all" | "single", ground: boolean, goodsSkuId?: string) {
  if (type === "all") {
    try {
      const res = await groundGoodsRequest({ goodsSpuId: props.spu._id, ground });
      myMessage(res.data, "success");
      init();
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  } else if (type === "single") {
    try {
      const res = await groundGoodsRequest({ goodsSkuId, ground });
      myMessage(res.data, "success");
      init();
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  }
}
</script>

<template>
  <div>
    <el-button type="primary" size="default" icon="arrow-left" @click="emit('back')">返回</el-button>
    <el-button v-auth-btn="'goods-add-sku'" type="primary" size="default" icon="Plus" @click="addSku">
      新增SKU
    </el-button>
    <el-button
      v-auth-btn="'goods-ground-sku'"
      type="primary"
      size="default"
      icon="Top"
      @click="groundGoods('all', true)"
    >
      全部上架
    </el-button>
    <el-button
      v-auth-btn="'goods-ground-sku'"
      type="primary"
      size="default"
      icon="Bottom"
      @click="groundGoods('all', false)"
    >
      全部下架
    </el-button>

    <el-table :border="true" :data="skuList.data" style="margin: 20px 0">
      <el-table-column label="序号" type="index" :align="'center'" width="80px"></el-table-column>
      <el-table-column label="销售属性" prop="sku_sales_attrs" show-overflow-tooltip>
        <template #default="{ row }">
          {{
            row.sku_sales_attrs.reduce((str: string, item: any) => (str += item.name + ": " + item.value + "  "), "")
          }}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template #default="{ row }">
          <span style="color: red">￥{{ Number(row.goods_sku_price).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="goods_sku_stock"></el-table-column>
      <el-table-column label="SKU图片" width="126px">
        <template #default="{ row }">
          <el-image style="width: 100px; height: 100px" :src="row.goods_sku_img">
            <template #error>
              <p style="line-height: 100px; text-align: center; font-size: 20px">图片已失效</p>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="update_time" show-overflow-tooltip>
        <template #default="{ row }">{{ formatDate(new Date(row.update_time), "yyyy-0M-0d 0h:0m:0s") }}</template>
      </el-table-column>
      <el-table-column label="SPU操作">
        <template #default="{ row }">
          <el-button
            v-auth-btn="'goods-ground-sku'"
            v-if="!row.isGrounding"
            type="primary"
            size="small"
            icon="Top"
            title="上架"
            @click="groundGoods('single', true, row._id)"
          ></el-button>
          <el-button
            v-auth-btn="'goods-ground-sku'"
            v-else
            type="primary"
            size="small"
            icon="Bottom"
            title="下架"
            @click="groundGoods('single', false, row._id)"
          ></el-button>
          <el-button
            v-auth-btn="'goods-update-sku'"
            type="primary"
            size="small"
            icon="Edit"
            title="修改SKU"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            v-auth-btn="'goods-delete-sku'"
            type="danger"
            size="small"
            icon="Delete"
            title="删除SKU"
            @click="deleteSku(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showOperateDialog" :title="operateDialogTitle" width="70%" center>
      <SkuForm
        v-if="JSON.stringify(spu) !== '{}'"
        :currentOperateSpu="spu"
        :currentOperateSku="currentOperateSku"
        @cancel="cancel"
        @refreshData="refreshData"
      />
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="温馨提示" center>
      <p style="text-align: center; font-size: 25px">确定删除吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped></style>
