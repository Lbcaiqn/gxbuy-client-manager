<script setup lang="ts">
import MyUpload from "./MyUpload.vue";

withDefaults(
  defineProps<{
    formMessage: Array<
      Array<{
        type:
          | "text"
          | "password"
          | "textarea"
          | "number"
          | "radio"
          | "checkbox"
          | "select"
          | "date-picker"
          | "upload-one"
          | "upload-many"
          | string;
        model: string;
        formItemLabel?: string;
        label?: string;
        options?: Array<{ value: string; text: string }>;
        action?: string;
        hide?: boolean;
      }>
    >;
    formData: any;
    useExtraFormItem?: boolean;
    extraFormItemLabel?: string;
  }>(),
  {
    formMessage: () => [],
    formData: () => {
      return {};
    },
    useExtraFormItem: false,
    extraFormItemLabel: ""
  }
);

const emit = defineEmits(["selectChange", "cancel", "reset", "submit"]);

// 例子
// const example = {
//   title: "新增SPU",
//   formMessage: [
//     [{ type: "text", formItemLabel: "工号", label: "工号", model: "username" }],
//     [{ type: "password", formItemLabel: "初始密码", label: "初始密码", model: "password" }],
//     [
//       {
//         type: "select",
//         formItemLabel: "国家",
//         label: "国家",
//         model: "area",
//         options: [
//           { value: "s1", text: "opt2" },
//           { value: "s2", text: "opt2" }
//         ]
//       }
//     ],
//     [
//       {
//         type: "select",
//         formItemLabel: "分类",
//         label: "一级分类",
//         model: "c1",
//         options: [
//           { value: "s1", text: "opt1" },
//           { value: "s2", text: "opt2" }
//         ]
//       },
//       {
//         type: "select",
//         label: "二级分类",
//         model: "c2",
//         options: [
//           { value: "s1", text: "opt1" },
//           { value: "s2", text: "opt2" }
//         ]
//       }
//     ],
//     [
//       {
//         type: "radio",
//         formItemLabel: "性别",
//         model: "sex",
//         options: [
//           { value: "male", text: "男" },
//           { value: "remale", text: "女" }
//         ]
//       }
//     ],
//     [
//       {
//         type: "checkbox",
//         formItemLabel: "角色",
//         model: "role",
//         options: [
//           { value: "role1", text: "前端" },
//           { value: "role2", text: "后端" }
//         ]
//       }
//     ],
//     [{ type: "date-picker", formItemLabel: "出生日期", model: "birthday" }],
//     [
//       {
//         type: "upload-one",
//         formItemLabel: "图",
//         action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
//         model: "mainImage"
//       }
//     ],
//     [
//       {
//         type: "upload-many",
//         formItemLabel: "轮播图",
//         action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
//         model: "banner"
//       }
//     ]
//   ],
//   formData: {
//     username: "",
//     password: "123456",
//     area: "",
//     c1: "",
//     c2: "",
//     sex: "",
//     role: [],
//     birthday: "",
//     mainImage: "",
//     banner: {
//       fileList: [
//         {
//           name: "food.jpeg",
//           url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
//         }
//       ]
//     }
//   }
// };
</script>

<template>
  <el-form class="el-form" :model="formData" label-width="120px">
    <el-form-item
      v-show="!i[0]?.hide"
      v-for="(i, iIndex) in formMessage"
      :key="iIndex"
      :label="i[0]?.formItemLabel + '：'"
    >
      <div
        v-for="(j, jIndex) in i"
        :key="jIndex"
        :style="{ width: i.length === 1 ? '100%' : 'auto', 'margin-right': i.length === 1 ? '0' : '10px' }"
      >
        <el-input
          v-if="['text', 'password', 'textarea', 'number'].includes(j.type)"
          :type="j.type"
          v-model="formData[j.model]"
          :placeholder="'请输入' + j.label"
        />

        <el-select
          v-if="j.type == 'select'"
          v-model="formData[j.model]"
          :placeholder="'请选择' + j.label"
          @change="emit('selectChange', { rowIndex: iIndex, columnIndex: jIndex })"
        >
          <el-option v-for="opt in j?.options" :key="opt" :value="opt.value" :label="opt.text"></el-option>
        </el-select>

        <el-radio-group v-if="j.type == 'radio'" v-model="formData[j.model]">
          <el-radio v-for="(opt, optIndex) in j.options" :key="optIndex" :label="opt.value" size="large">
            {{ opt.text }}
          </el-radio>
        </el-radio-group>

        <el-checkbox-group v-if="j.type == 'checkbox'" v-model="formData[j.model]">
          <el-checkbox v-for="(opt, optIndex) in j.options" :key="optIndex" :label="opt.value" size="large">
            {{ opt.text }}
          </el-checkbox>
        </el-checkbox-group>

        <el-date-picker
          v-if="j.type == 'date-picker'"
          v-model="formData[j.model]"
          type="date"
          :placeholder="'请选择' + j.label"
          style="width: 100%"
        />

        <MyUpload v-if="j.type == 'upload-one'" type="one" :action="j.action" v-model:imageUrl="formData[j.model]" />

        <MyUpload
          v-if="j.type == 'upload-many'"
          type="many"
          :action="j.action"
          :fileData="formData[j.model]"
        ></MyUpload>
      </div>
    </el-form-item>

    <el-form-item :label="extraFormItemLabel + '：'" v-if="useExtraFormItem">
      <slot name="extraFormItem"></slot>
    </el-form-item>

    <el-form-item>
      <el-button size="large" @click="emit('cancel')">取消</el-button>
      <el-button size="large" @click="emit('reset')">清空</el-button>
      <el-button type="primary" size="large" @click="emit('submit')">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less" scoped>
.el-form {
  margin: 0 auto;
}
</style>
