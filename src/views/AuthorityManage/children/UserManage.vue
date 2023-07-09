<script setup lang="ts">
import { ref } from "vue";
import type { ResultWithTotal } from "@/types";
import {
  getRoleDataRequest,
  getManagerListRequest,
  createManagerRequest,
  updateManagerRequest,
  deleteManagerRequest
} from "@/api";
import { myMessage } from "@/tools/myMessage";
import { formatDate } from "@/tools/formatDate";
import MySearcher from "@/components/content/MySearcher.vue";
import MyForm from "@/components/common/MyForm.vue";

// 初始化 ----------------------------------------------------------------------
const roleData = ref<Array<any>>([]);
const managerList = ref<ResultWithTotal>({});

const formList = ref<any>({
  formMessage: [
    [
      {
        type: "text",
        formItemLabel: "账号",
        label: "账号",
        model: "managerAccount",
        rules: [
          { type: "required", errorMessage: "请输入用户账号" },
          { type: "reg", errorMessage: "用户账号5-50位", reg: [/.{5,50}/] }
        ]
      }
    ],
    [
      {
        type: "password",
        formItemLabel: "密码",
        label: "密码",
        model: "managerPassword",
        rules: [
          { type: "required", errorMessage: "请输入用户密码" },
          {
            type: "reg",
            errorMessage: "8到30位，至少一个字母，至少一个数字",
            reg: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/]
          }
        ]
      }
    ],
    [
      {
        type: "text",
        formItemLabel: "姓名",
        label: "姓名",
        model: "managerName",
        rules: [
          { type: "required", errorMessage: "请输入用户姓名" },
          {
            type: "reg",
            errorMessage: "用户姓名应该是2-30个字符",
            reg: [/^.{2,30}$/]
          }
        ]
      }
    ],
    [{ type: "checkbox", formItemLabel: "角色列表", label: "角色列表", model: "roleIds", options: [] }]
  ],
  formData: {
    managerAccount: "",
    managerPassword: "",
    managerName: "",
    roleIds: []
  }
});

async function init() {
  try {
    roleData.value = (await getRoleDataRequest()).data;
    managerList.value = (await getManagerListRequest({ pageSize: 20, page: 1 })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }

  formList.value.formMessage[3][0].options = roleData.value.map((i: any) => {
    return {
      value: i._id,
      text: i.roleName
    };
  });
  console.log(formList.value.formMessage[3]);
}

init();

// 搜索 -----------------------------------------------------------------------
const isSearching = ref(false);
const isAllSearching = ref(false);

async function search(payload: any) {
  const { type, keyword } = payload;

  if (type === "search") isSearching.value = true;
  else if (type === "all") isAllSearching.value = true;

  try {
    roleData.value = (await getRoleDataRequest()).data;
    managerList.value = (await getManagerListRequest({ keyword, pageSize: 20, page: 1 })).data;
    currentPage.value = 1;
  } catch (err: any) {
    myMessage(err, "error", true);
  }

  if (type === "search") isSearching.value = false;
  else if (type === "all") isAllSearching.value = false;
}

// 分页 --------------------------------------------------------------------------
const pageSize = ref(20);
const currentPage = ref(1);

async function currentChange() {
  try {
    managerList.value = (await getManagerListRequest({ pageSize: 20, page: 1 })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}
// CRUD -------------------------------------------------------------------
const myFormRef = ref<any>(null);
const showDialog = ref(false);
const dialogTitle = ref("");
const crud = ref<"add" | "update">("add");
const updateManagerId = ref("");

function clearManagerFormData() {
  formList.value.formData.managerAccount = "";
  formList.value.formData.managerPassword = "";
  formList.value.formData.managerName = "";
  formList.value.formData.roleIds = [];
  if (myFormRef.value) myFormRef.value.reset({ resetValueToo: false });
}

function addManager() {
  clearManagerFormData();
  crud.value = "add";
  formList.value.formMessage[1][0].hide = false;
  showDialog.value = true;
  dialogTitle.value = "新增用户";
}

function updateManager(manager: any) {
  if (myFormRef.value) myFormRef.value.reset({ resetValueToo: false });

  crud.value = "update";
  formList.value.formMessage[1][0].hide = true;
  updateManagerId.value = manager._id;

  formList.value.formData.managerAccount = manager.shop_manager_account;
  formList.value.formData.managerPassword = "";
  formList.value.formData.managerName = manager.shop_manager_name;
  formList.value.formData.roleIds = manager.shop_manager_role.map((i: any) => i._id);

  showDialog.value = true;
  dialogTitle.value = "新增角色";
}

async function submit() {
  if (crud.value === "add") {
    try {
      const res = await createManagerRequest({
        managerAccount: formList.value.formData.managerAccount,
        managerPassword: formList.value.formData.managerPassword,
        managerName: formList.value.formData.managerName,
        roleIds: formList.value.formData.roleIds
      });
      myMessage(res.data, "success");
      showDialog.value = false;
      managerList.value = (await getManagerListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  } else if (crud.value === "update") {
    try {
      const res = await updateManagerRequest({
        managerAccount: formList.value.formData.managerAccount,
        managerName: formList.value.formData.managerName,
        roleIds: formList.value.formData.roleIds,
        managerId: updateManagerId.value
      });
      myMessage(res.data, "success");
      showDialog.value = false;
      managerList.value = (await getManagerListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  }
}

const showDeleteDialog = ref(false);
const deleteManagerId = ref("");

function deleteManager(managerId: string) {
  deleteManagerId.value = managerId;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  try {
    const res = await deleteManagerRequest(deleteManagerId.value);
    myMessage(res.data, "success");
    showDeleteDialog.value = false;
    managerList.value = (await getManagerListRequest({ pageSize: pageSize.value, page: currentPage.value })).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}
</script>

<template>
  <div>
    <MySearcher
      :placeholder="'请输入用户名称'"
      :isSearching="isSearching"
      :isAllSearching="isAllSearching"
      @search="search"
      @allSearch="search"
    />

    <el-card v-if="JSON.stringify(managerList) !== '{}'" style="amrgin: 10px 0">
      <div>
        <el-button v-auth-btn="'user-add-user'" type="primary" size="default" icon="Plus" @click="addManager">
          新增用户
        </el-button>

        <el-table style="margin: 10px 0px" :border="true" :data="managerList.data">
          <el-table-column label="序号" type="index" :align="'center'" width="80px">
            <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
          </el-table-column>
          <el-table-column label="用户账号" prop="shop_manager_account" show-overflow-tooltip></el-table-column>
          <el-table-column label="姓名" prop="shop_manager_name" show-overflow-tooltip></el-table-column>
          <el-table-column label="修改时间" prop="update_time" show-overflow-tooltip>
            <template #default="{ row }">{{ formatDate(new Date(row.update_time), "yyyy-0M-0d 0h:0m:0s") }}</template>
          </el-table-column>

          <el-table-column label="角色操作">
            <template #default="{ row }">
              <el-button
                v-auth-btn="'user-update-user'"
                type="primary"
                size="small"
                icon="Edit"
                title="修改用户"
                @click="updateManager(row)"
              ></el-button>
              <el-button
                v-auth-btn="'user-delete-user'"
                type="danger"
                size="small"
                icon="Delete"
                title="删除用户"
                @click="deleteManager(row._id)"
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
            :total="managerList.total"
            @currentChange="currentChange"
          />
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showDialog" :title="dialogTitle" width="50%" center>
      <MyForm
        ref="myFormRef"
        :formMessage="formList.formMessage"
        :formData="formList.formData"
        @cancel="showDialog = false"
        @reset="clearManagerFormData"
        @submit="submit"
      ></MyForm>
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
