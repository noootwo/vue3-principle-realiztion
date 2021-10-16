import { reactive } from "./core/reactivity/index.js";
import { h } from "./core/h.js";

export default {
  render(context) {
    return h("div", { id: "p" + context.state.count }, [
      h("p", null, String(context.state.count)),
      h("p", null, String(context.state.count + 1)),
    ]);
  },
  setup() {
    const state = reactive({
      count: 0,
    });

    window.state = state;

    return {
      state,
    };
  },
};
