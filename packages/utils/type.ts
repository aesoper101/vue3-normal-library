import { PropType, VNodeChild } from "vue";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;

export const tupleNum = <T extends number[]>(...args: T) => args;

export type VueNode = VNodeChild | JSX.Element;

export type LiteralUnion<T extends U, U> = T | (U & Record<string, unknown>);

export type Data = Record<string, unknown>;

export type Key = string | number;

type DefaultFactory<T> = (props: Data) => T | null | undefined;

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null;
  required?: boolean;
  default?: D | DefaultFactory<D> | null | undefined | Record<string, unknown>;
  validator?(value: unknown): boolean;
}
