import { ComponentPublicInstance, PropType } from "vue";

export function noop() {}

export const inBrowser = typeof window !== "undefined";

// unknown type for Vue prop
export const UnknownProp = null as unknown as PropType<unknown>;
export const truthProp = {
  type: Boolean,
  default: true as const,
};

// eslint-disable-next-line
export type ComponentInstance = ComponentPublicInstance<{}, any>;
