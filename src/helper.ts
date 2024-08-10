import { message } from "ant-design-vue";

interface CheckCondition {
  format?: string[];
  size?: number
}
type ErrorType = "size" | "format" | null;
export const beforeUploadCheck = (file: File, condition: CheckCondition) => {
  const { format, size } = condition;
  const isValiedFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true;
  let error = null as ErrorType;
  if (!isValiedFormat) error = "format";
  if (!isValidSize) error = "size";
  return {
    passed: isValidSize && isValiedFormat,
    error
  }
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ["image/jpeg", "image/png","image/jpg"] });
  const { passed, error } = result;
  if (error === "format") message.error("上传图片只能是JPG/PNG格式!");
  if (error === "size") message.error("上传图片大小不能超过1Mb");
  return passed
}

export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src = typeof url === "string" ? url : URL.createObjectURL(url);
    img.addEventListener("load", () => {
      const { naturalHeight: height, naturalWidth: width } = img;
      resolve({ width, height });
    });
    img.addEventListener("error", () => {
      reject(new Error("There was some problem with the image"));
    })
  });
}