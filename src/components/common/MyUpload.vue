<script lang="ts" setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";

const props = withDefaults(
  defineProps<{
    type: "one" | "many" | string;
    action: string;
    imageUrl?: string;
    fileData?: {
      fileList: Array<{ name: string; url: string }>;
    };
    fileType?: Array<string>;
    maxMB?: number;
  }>(),
  {
    type: "one",
    action: "",
    imageUrl: "",
    formData: () => {
      return {
        fileList: () => []
      };
    },
    fileType: () => ["image/jpeg", "image/png"],
    maxMB: 2
  }
);

const emit = defineEmits(["update:imageUrl"]);

// 单文件上传 ----------------------------------------------------------------------
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  if (!response) return;
  console.log(URL.createObjectURL(uploadFile.raw!));
  emit("update:imageUrl", URL.createObjectURL(uploadFile.raw!));
};

// 多文件上传 -------------------------------------------------------------------
const isPreviewImg = ref(false);
const previewImgUrl = ref("");

const imagePreview: UploadProps["onPreview"] = uploadFile => {
  previewImgUrl.value = uploadFile.url!;
  isPreviewImg.value = true;
};

// 单文件上传，多文件上传共用 -----------------------------------------------------------
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  console.log(props.fileType);
  if (!props.fileType.includes(rawFile.type)) {
    ElMessage.error(`只支持这些格式：${props.fileType}`);
    return false;
  } else if (rawFile.size / 1024 / 1024 > props.maxMB) {
    ElMessage.error(`不能超过 ${props.maxMB} MB`);
    return false;
  }
  return true;
};

const uploadError: UploadProps["onError"] = () => {
  ElMessage.error(`网络异常，请重新上传`);
};
</script>

<template>
  <el-upload
    v-if="type === 'one'"
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-error="uploadError"
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>

  <el-upload
    v-else-if="type === 'many'"
    v-model:file-list="fileData!.fileList"
    :action="action"
    list-type="picture-card"
    multiple
    :on-error="uploadError"
    :before-upload="beforeAvatarUpload"
    :on-preview="imagePreview"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="isPreviewImg">
    <img w-full :src="previewImgUrl" />
  </el-dialog>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 158px;
  height: 158px;
  text-align: center;
}
</style>
