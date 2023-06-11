<script setup lang="ts">
import { ref, nextTick } from "vue";
import { ElMessage, ElInput } from "element-plus";

const props = withDefaults(
  defineProps<{
    tableData: Array<{ name: string; values: Array<string> }>;
  }>(),
  {
    tableData: () => []
  }
);

const attrName = ref("");

function addItem() {
  if (attrName.value === "") return;

  if (props.tableData.map((i: any) => i.name).includes(attrName.value)) {
    ElMessage.error("销售属性名已存在");
    return;
  }

  props.tableData.push({
    name: attrName.value,
    values: []
  });

  attrName.value = "";

  ElMessage.success("添加成功");
}

function deleteItem(index: number) {
  props.tableData.splice(index, 1);
  ElMessage.success("删除成功");
}

// value --------------------------------------------------------------------
const newValueInputRef = ref<InstanceType<typeof ElInput>>();
const isAddingValue = ref(false);
const isAddingItemIndex = ref(-1);
const attrValue = ref("");

async function startAddValue(itemIndex: number) {
  isAddingItemIndex.value = itemIndex;
  isAddingValue.value = true;

  await nextTick();
  newValueInputRef.value!.focus();
}

function addValue(index: number) {
  const newValue = attrValue.value;

  attrValue.value = "";
  isAddingValue.value = false;
  isAddingItemIndex.value = -1;

  if (newValue === "") return;

  if (props.tableData[index].values.includes(newValue)) {
    ElMessage.error("属性值已存在");
    return;
  }

  props.tableData[index].values.push(newValue);
  ElMessage.success("添加成功");
}

function deleteValue(itemIndex: number, valueIndex: number) {
  props.tableData[itemIndex].values.splice(valueIndex, 1);
  ElMessage.success("删除成功");
}
</script>

<template>
  <div style="display: flex">
    <el-input v-model="attrName" :placeholder="'请输入销售属性'"></el-input>
    <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus" @click="addItem">添加</el-button>
  </div>
  <el-table :border="true" style="margin: 10px 0px" :data="tableData">
    <el-table-column label="序号" type="index" :align="'center'" width="80px"></el-table-column>
    <el-table-column label="销售属性名" width="120px" prop="name"></el-table-column>
    <el-table-column label="销售属性值" prop="value">
      <template #default="{ row, $index }">
        <div class="attr-value">
          <el-tag
            v-for="(value, valueIndex) in row.values"
            :key="valueIndex"
            style="margin: 2px 5px 2px 0"
            class="mx-1"
            closable
            @close="deleteValue($index, valueIndex)"
          >
            {{ value }}
          </el-tag>

          <el-input
            v-if="isAddingValue && $index === isAddingItemIndex"
            ref="newValueInputRef"
            v-model="attrValue"
            style="margin: 4px 0"
            class="ml-1 w-10"
            size="small"
            placeholder="属性值"
            @keyup.enter="addValue($index)"
            @blur="addValue($index)"
          />
          <el-button
            v-else
            type="primary"
            style="margin: 4px 0"
            class="button-new-tag ml-1"
            size="small"
            icon="Plus"
            @click="startAddValue($index)"
          ></el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120px">
      <template #default="{ $index }">
        <el-button
          style="margin: 4px 0"
          type="danger"
          size="small"
          icon="Delete"
          title="删除此销售属性"
          @click="deleteItem($index)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="less" scoped>
.attr-value {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
