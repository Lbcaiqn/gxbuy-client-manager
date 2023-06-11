<script setup lang="ts">
import { ref, nextTick } from "vue";
import { getCategoryDataRequest, getGoodsSpuListRequest, deleteGoodsSpuRequest } from "@/api";
import { ResultWithTotal } from "@/types";
import { myMessage } from "@/tools/myMessage";
import { formatDate } from "@/tools/formatDate";
import SpuForm from "./childrenComponents/SpuForm.vue";
import SkuForm from "./childrenComponents/SkuForm.vue";
import SkuList from "./childrenComponents/SkuList.vue";

// 初始化 ---------------------------------------------------------------------
const currentPage = ref(1);
const pageSize = ref(20);

const showOperateDialog = ref(false);
const operateDialogTitle = ref("");

const spuList = ref<ResultWithTotal>({});
const categoryData = ref<Array<any>>([]);

const statu = ref<"none" | "spu" | "sku" | "viewSku">("none");

async function init() {
  try {
    categoryData.value = (await getCategoryDataRequest()).data;
    spuList.value = (await getGoodsSpuListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

init();

// 分页 --------------------------------------------------------------------------
async function currentChange() {
  try {
    spuList.value = (await getGoodsSpuListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

// SPU CRUD ----------------------------------------------------------------------
const currentUpdateSpu = ref<any>({});
const showDeleteDialog = ref(false);
const currentDeleteSpuId = ref("");

function addSpu() {
  currentUpdateSpu.value = {};
  statu.value = "spu";
  showOperateDialog.value = true;
  operateDialogTitle.value = "新增SPU";
}

async function updateSpu(index: number) {
  currentUpdateSpu.value = {};
  await nextTick();
  currentUpdateSpu.value = spuList.value.data![index];
  statu.value = "spu";
  showOperateDialog.value = true;
  operateDialogTitle.value = "修改SPU";
}

function deleteSpu(index: number) {
  showDeleteDialog.value = true;
  currentDeleteSpuId.value = spuList.value.data![index]._id;
}

async function confirmDelete() {
  try {
    const res = await deleteGoodsSpuRequest(currentDeleteSpuId.value);
    myMessage(res.data, "success");
    showDeleteDialog.value = false;

    spuList.value = (await getGoodsSpuListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

// SKU CRUD --------------------------------------------------------------------
const currentOperateSpu = ref<any>({});

function addSku(index: number) {
  currentOperateSpu.value = spuList.value.data![index];
  statu.value = "sku";
  showOperateDialog.value = true;
  operateDialogTitle.value = "修改SKU";
}

const currentViewSkuSpu = ref<any>({});

function viewSku(index: number) {
  currentViewSkuSpu.value = spuList.value.data![index];
  statu.value = "viewSku";
}

// cancel -------------------------------------------------------------
function cancel() {
  statu.value = "none";
  showOperateDialog.value = false;
}

// refreshData -----------------------------------------------------
async function refreshData() {
  statu.value = "none";
  showOperateDialog.value = false;
  spuList.value = (await getGoodsSpuListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
}
</script>

<template>
  <el-card v-if="JSON.stringify(spuList) !== '{}'" v-show="statu !== 'viewSku'" style="amrgin: 10px 0">
    <div>
      <el-button v-auth-btn="'goods-add-spu'" type="primary" size="default" icon="Plus" @click="addSpu">
        新增SPU
      </el-button>

      <el-table style="margin: 10px 0px" :border="true" :data="spuList.data">
        <el-table-column label="序号" type="index" :align="'center'" width="80px">
          <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="SPU名称" prop="goods_spu_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="修改时间" prop="update_time" show-overflow-tooltip>
          <template #default="{ row }">{{ formatDate(new Date(row.update_time), "yyyy-0M-0d 0h:0m:0s") }}</template>
        </el-table-column>

        <el-table-column label="SPU操作">
          <template #default="{ $index }">
            <el-button
              v-auth-btn="'goods-add-sku'"
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
              @click="addSku($index)"
            ></el-button>
            <el-button
              v-auth-btn="'goods-view-sku'"
              type="primary"
              size="small"
              icon="View"
              title="查看SKU列表"
              @click="viewSku($index)"
            ></el-button>
            <el-button
              v-auth-btn="'goods-update-spu'"
              type="primary"
              size="small"
              icon="Edit"
              title="修改SPU"
              @click="updateSpu($index)"
            ></el-button>
            <el-button
              v-auth-btn="'goods-delete-spu'"
              type="danger"
              size="small"
              icon="Delete"
              title="删除SPU"
              @click="deleteSpu($index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :background="true"
          layout="prev, pager, next, jumper, ->, total"
          :total="spuList.total"
          @currentChange="currentChange"
        />
      </div>
    </div>
  </el-card>

  <el-card style="amrgin: 10px 0" v-show="statu === 'viewSku'">
    <SkuList v-show="statu === 'viewSku'" :spu="currentViewSkuSpu" @back="statu = 'none'" />
  </el-card>

  <el-dialog v-model="showOperateDialog" :title="operateDialogTitle" width="70%" center>
    <SpuForm
      v-show="statu === 'spu'"
      :currentUpdateSpu="currentUpdateSpu"
      :categoryData="categoryData"
      @cancel="cancel"
      @refreshData="refreshData"
    />
    <SkuForm
      v-show="statu === 'sku'"
      :currentOperateSpu="currentOperateSpu"
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
</template>

<style lang="less" scoped></style>
