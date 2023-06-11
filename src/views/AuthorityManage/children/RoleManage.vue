<script setup lang="ts">
import { ref } from "vue";
import type { ResultWithTotal, RoleAuthorityInterface } from "@/types";
import {
  getAuthorityDataRequest,
  getRoleListRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest
} from "@/api";
import { myMessage } from "@/tools/myMessage";
import { formatDate } from "@/tools/formatDate";
import { deepCopy } from "@/tools/deepCopy";
import { arrayObjectToObject, objectToArrayObject } from "@/tools/treeChange";
import MyForm from "@/components/common/MyForm.vue";
import TreeTable from "@/components/common/TreeTable.vue";
import { merge } from "lodash";

// 初始化 ----------------------------------------------------------------------
const authorityData = ref<Array<any>>([]);
const authorityDataCopy = ref<Array<any>>([]);
const roleList = ref<ResultWithTotal>({});

async function init() {
  try {
    authorityData.value = (await getAuthorityDataRequest()).data;
    authorityDataCopy.value = deepCopy(authorityData.value);
    roleList.value = (await getRoleListRequest({ pageSize: 20, page: 1 })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

init();

// 分页 --------------------------------------------------------------------------
const pageSize = ref(20);
const currentPage = ref(1);

async function currentChange() {
  try {
    roleList.value = (await getRoleListRequest({ pageSize: 20, page: 1 })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}
// CRUD -------------------------------------------------------------------
const showDialog = ref(false);
const dialogTitle = ref("");
const crud = ref<"add" | "update">("add");
const updateRoleId = ref("");

const formList = ref<any>({
  formMessage: [[{ type: "text", formItemLabel: "角色名", label: "角色名", model: "shopManagerRoleName" }]],
  formData: {
    shopManagerRoleName: ""
  }
});

function clearRoleFormData() {
  formList.value.formData = { shopManagerRoleName: "" };
  authorityData.value = deepCopy(authorityDataCopy.value);
}

function addRole() {
  clearRoleFormData();
  crud.value = "add";
  showDialog.value = true;
  dialogTitle.value = "新增角色";
}

function updateRole(role: any) {
  crud.value = "update";
  updateRoleId.value = role._id;

  formList.value.formData.shopManagerRoleName = role.shop_manager_role_name;

  authorityData.value = objectToArrayObject(
    merge(
      arrayObjectToObject(deepCopy(authorityDataCopy.value)),
      arrayObjectToObject(deepCopy(role.shop_manager_role_authority))
    )
  );

  showDialog.value = true;
  dialogTitle.value = "新增角色";
}

function getSubmitAuthority(data: Array<any>): Array<RoleAuthorityInterface> {
  const dataCopy = deepCopy(data);
  const result: Array<RoleAuthorityInterface> = [];

  for (const i of dataCopy) {
    if (i?.children?.length > 0) {
      const subResult = getSubmitAuthority(i.children);
      if (subResult.length !== 0) {
        i.children = subResult;
        result.push(i);
      }
    } else {
      if (i?.button?.find((btn: any) => btn.name === "菜单权限")?.isSelected) {
        i.button = i?.button?.filter((btn: any) => btn.isSelected && btn.name !== "菜单权限");
        for (const btn of i.button) delete btn.isSelected;
        result.push(i);
      }
    }
  }

  return result;
}

async function submit() {
  if (crud.value === "add") {
    console.log(getSubmitAuthority(authorityData.value));
    try {
      const res = await createRoleRequest({
        roleName: formList.value.formData.shopManagerRoleName,
        authority: getSubmitAuthority(authorityData.value)
      });
      myMessage(res.data, "success");
      showDialog.value = false;
      roleList.value = (await getRoleListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  } else if (crud.value === "update") {
    try {
      const res = await updateRoleRequest({
        roleName: formList.value.formData.shopManagerRoleName,
        authority: getSubmitAuthority(authorityData.value),
        roleId: updateRoleId.value
      });
      myMessage(res.data, "success");
      showDialog.value = false;
      roleList.value = (await getRoleListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  }
}

const showDeleteDialog = ref(false);
const deleteRoleId = ref("");

function deleteRole(roleId: string) {
  deleteRoleId.value = roleId;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  try {
    const res = await deleteRoleRequest(deleteRoleId.value);
    myMessage(res.data, "success");
    showDeleteDialog.value = false;
    roleList.value = (await getRoleListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}
</script>

<template>
  <el-card v-if="JSON.stringify(roleList) !== '{}'" style="amrgin: 10px 0">
    <div>
      <el-button v-auth-btn="'role-add-role'" type="primary" size="default" icon="Plus" @click="addRole">
        新增角色
      </el-button>

      <el-table style="margin: 10px 0px" :border="true" :data="roleList.data">
        <el-table-column label="序号" type="index" :align="'center'" width="80px">
          <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="角色名称" prop="shop_manager_role_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="修改时间" prop="update_time" show-overflow-tooltip>
          <template #default="{ row }">{{ formatDate(new Date(row.update_time), "yyyy-0M-0d 0h:0m:0s") }}</template>
        </el-table-column>

        <el-table-column label="角色操作">
          <template #default="{ row }">
            <el-button
              v-auth-btn="'role-update-role'"
              type="primary"
              size="small"
              icon="Edit"
              title="修改角色"
              :disabled="row.shop_manager_role_name === 'admin'"
              @click="updateRole(row)"
            ></el-button>
            <el-button
              v-auth-btn="'role-delete-role'"
              type="danger"
              size="small"
              icon="Delete"
              title="删除角色"
              :disabled="row.shop_manager_role_name === 'admin'"
              @click="deleteRole(row._id)"
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
          :total="roleList.total"
          @currentChange="currentChange"
        />
      </div>
    </div>
  </el-card>

  <el-dialog v-model="showDialog" :title="dialogTitle" width="80%" center>
    <MyForm
      :formMessage="formList.formMessage"
      :formData="formList.formData"
      :useExtraFormItem="true"
      :extraFormItemLabel="'权限列表'"
      @cancel="showDialog = false"
      @reset="clearRoleFormData"
      @submit="submit"
    >
      <template #extraFormItem>
        <TreeTable :tableData="authorityData" />
      </template>
    </MyForm>
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
