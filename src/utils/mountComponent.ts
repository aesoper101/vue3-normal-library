import { createApp, reactive, Component, nextTick } from "vue";
import { assign } from "lodash-es";
import { useExpose } from "../hooks/useExpose";

export function usePopupState() {
  const state = reactive({
    visible: false,
  });

  const toggle = (visible: boolean) => {
    state.visible = visible;
  };

  const open = (props: Record<string, any>) => {
    assign(state, props);
    nextTick(() => toggle(true)).then();
  };

  const close = () => toggle(false);

  useExpose({ open, close, toggle });

  return {
    open,
    close,
    state,
    toggle,
  };
}

export function mountComponent(RootComponent: Component) {
  const app = createApp(RootComponent);
  const root = document.createElement("div");

  document.body.appendChild(root);
  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}
