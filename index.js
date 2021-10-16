import { effectWatch, reactive } from "./core/reactivity/index.js";

// const { effectWatch, reactive } = require("./core/reactivity/index.js");

const state = reactive({
  a: 1,
  b: 2,
});

effectWatch(() => {
  console.log(state);
});

state.a = 2;
