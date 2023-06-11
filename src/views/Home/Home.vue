<template>
  <div>
    <el-table :data="tableData" style="width: 100%" row-key="id" border default-expand-all>
      <el-table-column prop="name" label="菜单名称" width="200px" />
      <el-table-column prop="button" label="权限列表">
        <template #default="{ row }">
          <el-checkbox v-for="(i, iIndex) in row.button" :key="iIndex" v-model="i.isSelected">{{ i.name }}</el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
const tableData = [
  {
    id: 1,
    name: "权限管理",
    button: [],
    children: [
      {
        id: 2,
        name: "权限管理",
        button: [{ name: "菜单权限", value: "1", isSelected: false }]
      }
    ]
  },
  {
    id: 3,
    name: "权限管理",
    button: [{ name: "菜单权限", value: "1", isSelected: true }]
  }
];
</script>
