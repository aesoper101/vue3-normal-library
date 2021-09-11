/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

export type Modifier = string | Record<string, any>;
export type Modifiers = Modifier | Modifier[];

const parseBemParams = (name: string, mods?: Modifiers): string => {
  if (!mods) {
    return "";
  }

  if (typeof mods === "string") {
    return ` ${name}--${mods}`;
  }

  if (Array.isArray(mods)) {
    return mods.reduce<string>((ret, item) => ret + parseBemParams(name, item), "");
  }

  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? parseBemParams(name, key) : ""),
    ""
  );
};

const createBlock = (name: string) => {
  return function (element?: Modifiers, mods?: Modifiers): Modifiers {
    if (element && typeof element !== "string") {
      mods = element;
      element = "";
    }

    element = element ? `${name}__${element}` : name;

    return `${element}${parseBemParams(element, mods)}`;
  };
};

export const block = (blockName: string, ns = "bee-") => {
  return createBlock(ns + blockName);
};
