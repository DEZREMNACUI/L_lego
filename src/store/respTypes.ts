import { ActionPayload } from ".";
import { PageData } from "./editorStore";

export interface RespData<T = {}> {
  errno: number,
  data: T,
  message?: string,
  payload?: ActionPayload
}
export interface ListData<T> {
  list: T[];
  count: number;
}
// export interface WorkData extends Omit<PageData,"props"> {
//   content:{
//     components:[];
//   }
// }
export interface UploadData {
  urls: string[];
}
export type RespUploadData = RespData<UploadData>