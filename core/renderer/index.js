export function diff(n1, n2) {
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag));
  } else {
    const el = (n2.el = n1.el);
    const { props: newProps } = n2;
    const { props: oldProps } = n1;

    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        const oldVal = oldProps[key];
        if (newVal !== oldVal) {
          el.setAttribute(key, newVal);
        }
      });
    }

    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          el.removeAttribute(key);
        }
      });
    }

    const { children: newChildren } = n2;
    const { children: oldChildren } = n1;

    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else if (Array.isArray(oldChildren)) {
        el.textContent = newChildren;
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === "string") {
        el.innerText = "";
        mountElement(n2, el);
      } else if (Array.isArray(oldChildren)) {
        const length = Math.min(newChildren.length, oldChildren.length);
        for (let index = 0; index < length; index++) {
          const newVnode = newChildren[index];
          const oldVnode = oldChildren[index];
          diff(oldVnode, newVnode);
        }

        if (newChildren.length > length) {
          for (let index = length; index < newChildren.length; index++) {
            const newVnode = newChildren[index];
            mountElement(newVnode, el);
          }
        }

        if (oldChildren.length > length) {
          for (let index = 0; index < oldChildren.length; index++) {
            const oldVnode = oldChildren[index];
            oldVnode.el.parent.removeChild(oldVnode.el);
          }
        }
      }
    }
  }
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode;

  const el = (vnode.el = document.createElement(tag));

  if (props) {
    for (const key in props) {
      const val = props[key];
      el.setAttribute(key, val);
    }
  }

  if (typeof children === "string") {
    const textNode = document.createTextNode(children);
    el.append(textNode);
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      mountElement(v, el);
    });
  }

  container.append(el);
}
