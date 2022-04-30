import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      fullScreenLoaderShowing: false,
      fullScreenLoaderWidth: 720,
      fullScreenLoaderHeight: 576,
      fullScreenLoaderText: "Loading...",
      user: null,
  },
  mutations: {
      showLoader (state, payload) {
        state.fullScreenLoaderShowing = true;
        if (typeof payload === "string") {
            state.fullScreenLoaderText = payload;
            state.fullScreenLoaderWidth = 720;
            state.fullScreenLoaderHeight = 576;
        } else {
            state.fullScreenLoaderText = payload.message;
            state.fullScreenLoaderWidth = payload.width;
            state.fullScreenLoaderHeight = payload.height;
        }
      },
      hideLoader (state) {
          state.fullScreenLoaderShowing = false;
      },
      setUser (state, payload) {
          state.user = payload;
      }
  },
  actions: {
  },
  modules: {
  }
})
