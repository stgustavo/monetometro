import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    counter: 0,
    parameters: {
      DTE: null,
      DTI: null,
      CMH: null,
      ID: null,
    },
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
