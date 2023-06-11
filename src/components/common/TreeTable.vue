<script lang="ts" setup>
withDefaults(
  defineProps<{
    tableData: Array<any>;
  }>(),
  {
    tableData: () => []
  }
);

function checkboxClick(row: any, name: string) {
  if (name === "菜单权限" && !row.button.find((btn: any) => btn.name === "菜单权限").isSelected) {
    for (const btn of row.button) btn.isSelected = false;
  }
}
</script>

<template>
  <el-table
    v-if="JSON.stringify(tableData) !== '{]}'"
    class="aaa"
    :data="tableData"
    style="width: 100%"
    row-key="_id"
    border
    default-expand-all
  >
    <el-table-column prop="title" label="菜单名称" width="150px" />
    <el-table-column prop="button" label="权限列表">
      <template #default="{ row }">
        <el-checkbox
          v-for="(i, iIndex) in row.button"
          :key="iIndex"
          v-model="i.isSelected"
          :disabled="i.name !== '菜单权限' && !row.button.find((btn:any)=>btn.name === '菜单权限')?.isSelected"
          @change="checkboxClick(row, i.name)"
        >
          {{ i.name }}
        </el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>
