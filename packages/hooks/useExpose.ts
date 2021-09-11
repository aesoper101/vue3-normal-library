import { getCurrentInstance } from "vue";
import { assign } from "lodash-es";

// expose public api
export function useExpose(apis: Record<string, any>) {
  const instance = getCurrentInstance();
  if (instance) {
    assign(instance.proxy, apis);
  }
}
