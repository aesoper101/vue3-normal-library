import { App } from "vue";
import { camelCase } from "lodash-es";

export type WithInstall<T> = T & {
  install(app: App): void;
};

export function withInstall<T>(options: any): WithInstall<T> {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options as any;
    app.component(name, options);
    app.component(camelCase(`-${name}`), options);
  };

  return options;
}
