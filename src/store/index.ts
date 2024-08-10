import { createPinia } from "pinia";

export interface ActionPayload {
  urlParams?: { [key: string]: any }
  data?: any
  searchParams?: { [key: string]: any }
}

export const pinia = createPinia();