import { effectWatch } from "./reactivity/index.js";
import { mountElement, diff } from "./renderer/index.js";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      let isMounted = false;
      let preSubTree;

      effectWatch(() => {
        const subTree = rootComponent.render(context);

        if (!isMounted) {
          rootContainer.innerHTML = "";
          mountElement(subTree, rootContainer);
          preSubTree = subTree;
          isMounted = true;
        } else {
          diff(preSubTree, subTree);
          preSubTree = subTree;
        }
      });
    },
  };
}
