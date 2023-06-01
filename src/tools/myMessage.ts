import { ElMessage } from "element-plus";
import "element-plus/dist/index.css";

export function myMessage(message: string | any, type: any, messageIsErrorType: boolean = false) {
  if (type === "error" && messageIsErrorType) {
    message = message?.response ? message?.response?.data?.errorMessage || "网络异常" : "请重新登录";
  }

  ElMessage({
    customClass: "my-el-message",
    showClose: true,
    message,
    type
  });
}
