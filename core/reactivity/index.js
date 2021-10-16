// 响应式库

let currentEffect;
// 依赖
class Dep {
  // 收集依赖
  constructor(val) {
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal;
    this.notice();
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  // 触发依赖
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

export function effectWatch(effect) {
  // 收集依赖
  currentEffect = effect;
  effect();
  dep.depend();
  currentEffect = null;
}

const dep = new Dep();

// let b;

// effectWatch(() => {
//   b = dep.value + 10;
//   // console.log(b);
// });

// dep.value = 20;

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  return dep;
}

let targetMap = new Map();

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    },
  });
}

// let user = reactive({
//   age: 19,
// });

// let double;
// effectWatch(() => {
//   double = user.age;
//   console.log(double);
// });

// user.age += 1;
