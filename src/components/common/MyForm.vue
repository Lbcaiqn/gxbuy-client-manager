<script setup lang="ts">
import { ref, watch } from "vue";
import MyUpload from "./MyUpload.vue";
import type { FormInstance, FormRules } from "element-plus";

const formRef = ref<FormInstance>();

const props = withDefaults(
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
        hide?: boolean;
        unsigned: boolean;
        integer: boolean;
        options?: Array<{ value: string; text: string }>;
        action?: string;

        rules?: Array<{
          type: "required" | "reg" | "same" | string;
          reg?: Array<RegExp>;
          sameName?: string;
          errorMessage: string;
        }>;
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

defineExpose({
  formRef,
  reset
});

/* 由于vue会对表单进行复用，即使v-if也不会删除表单，这样在使用上会有一个问题，若MyForm组件需要
   显示隐藏，哪么若隐藏之前表单验证了并出现错误提示，哪么隐藏后再次显示错误提示依旧会存在。
   所以这里提供父组件一个清空错误提示的函数
*/
function reset(options: { resetValueToo: boolean }) {
  if (!formRef.value) return;

  const { resetValueToo } = options;
  if (resetValueToo) formRef.value?.resetFields();
  else {
    const temp: any = {};
    for (const key in props.formData) temp[key] = props.formData[key];
    formRef.value?.resetFields();
    for (const key in temp) props.formData[key] = temp[key];
  }
}

// 数字是否限制整数和小数 -----------------------------------------------------------------------------
// input类型本来是用number，但是输入 -和. 的时候input事件不毁掉，为了直接不让输入 -和. ，input类型就设置为了text
function formatNumber(form: any) {
  const { model, unsigned, integer } = form;

  if (props.formData[model] === "") return;
  if (props.formData[model] === "-" && !unsigned) return;

  const num = Number(props.formData[model]);

  if (unsigned && integer) {
    if (!/^\d+$/.test(props.formData[model]) || num === 0) {
      if (/^\d+$/.test(props.formData[model].slice(0, -1))) props.formData[model] = props.formData[model].slice(0, -1);
      else props.formData[model] = "";
    }
  } else if (unsigned && !integer) {
    if (!/^[+]?(\d+\.?\d*|\.\d+)$/.test(props.formData[model])) {
      if (/^[+]?(\d+\.?\d*|\.\d+)$/.test(props.formData[model].slice(0, -1))) {
        props.formData[model] = props.formData[model].slice(0, -1);
      } else props.formData[model] = "";
    }
  } else if (!unsigned && integer) {
    if (!/^[-+]?\d+$/.test(props.formData[model])) {
      if (/^[-+]?\d+$/.test(props.formData[model].slice(0, -1))) {
        props.formData[model] = props.formData[model].slice(0, -1);
      } else props.formData[model] = "";
    }
  } else if (!unsigned && !integer) {
    if (!/^-?\d+(\.\d*)?$/.test(props.formData[model])) {
      if (/^-?\d+(\.\d*)?$/.test(props.formData[model].slice(0, -1))) {
        props.formData[model] = props.formData[model].slice(0, -1);
      } else props.formData[model] = "";
    }
  }
}

// 表单验证 ----------------------------------------------------------
const validatePass = (rule: any, _: any, callback: any) => {
  // if (value) return;

  const formItem = props.formMessage.find((i: any) => i[0].model === rule.field);
  if (!formItem) return true;

  for (const child of formItem) {
    if (!child.rules) return true;

    for (const i of child.rules) {
      const formDataValue = props.formData[child.model];

      switch (i.type) {
        case "required":
          if (!formDataValue || formDataValue?.length === 0) callback(new Error(i.errorMessage));
          break;
        case "reg":
          if (!i.reg!.every(r => r.test(formDataValue))) callback(new Error(i.errorMessage));
          break;
        case "same":
          if (formDataValue !== props.formData[i.sameName || ""]) callback(new Error(i.errorMessage));
          break;
        default:
          break;
      }
    }
  }

  return true;
};

const rules = ref<FormRules>({});

watch(
  () => props.formMessage,
  () => {
    for (const i of props.formMessage) {
      if (!i[0]?.model) continue;
      if (i.filter((child: any) => child.rules?.length > 0).length === 0) continue;

      rules.value[i[0].model] = [{ validator: validatePass, trigger: "blur" }];
    }
  },
  { immediate: true }
);

function submit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      emit("submit");
    } else {
      return false;
    }
  });
}

function resetForm() {
  if (formRef.value) formRef.value.resetFields();
  emit("reset");
}

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
  <div v-if="JSON.stringify(formData) !== '{}'">
    <el-form
      class="el-form"
      ref="formRef"
      label-width="120px"
      :model="formData"
      :rules="rules"
      status-icon
      scroll-to-error
    >
      <el-form-item
        v-show="!i[0]?.hide"
        v-for="(i, iIndex) in formMessage"
        :key="iIndex"
        :prop="i[0]?.model || ''"
        :label="i[0]?.formItemLabel + '：'"
      >
        <div
          v-for="(j, jIndex) in i"
          :key="jIndex"
          :style="{ width: i.length === 1 ? '100%' : 'auto', 'margin-right': i.length === 1 ? '0' : '10px' }"
        >
          <el-input
            v-if="['text', 'password', 'textarea'].includes(j.type)"
            :type="j.type"
            v-model="formData[j.model]"
            :placeholder="'请输入' + j.label"
          />

          <el-input
            v-if="['number'].includes(j.type)"
            type="text"
            v-model="formData[j.model]"
            :placeholder="'请输入' + j.label"
            @input="formatNumber(j)"
            @blur="formData[j.model] = isNaN(Number(formData[j.model])) ? '' : String(Number(formData[j.model]))"
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
        <el-button size="large" @click="resetForm">重置</el-button>
        <el-button type="primary" size="large" @click="submit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.el-form {
  margin: 0 auto;
}
</style>
