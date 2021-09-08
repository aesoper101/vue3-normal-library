import { PropType } from "vue";
import { VueTypeValidableDef, VueTypeDef } from "vue-types";

const initDefaultProps = <T>(
  types: T,
  defaultProps: {
    [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U>
      ? U
      : T[K] extends VueTypeDef<infer U>
      ? U
      : T[K] extends { type: PropType<infer U> }
      ? U
      : any;
  }
): T => {
  const propTypes: T = { ...types } as T;
  Object.keys(defaultProps).forEach((k) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const prop = propTypes[k] as VueTypeValidableDef;
    if (prop) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prop.default = defaultProps[k];
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

export default initDefaultProps;
