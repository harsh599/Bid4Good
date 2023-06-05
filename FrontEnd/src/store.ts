import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  // store configuration goes here
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    currentRoute: null,
    sessionId: null,
    userDetails: null,
  },
  mutations: {
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },
    setSessionId(state, sessionId) {
      state.sessionId = sessionId;
    },
    setCurrentUserDetails(state, userDetails) {
      state.userDetails = userDetails;
    },
  },
  getters: {
    getCurrentRoute(state) {
      return state.currentRoute;
    },
    getSessionId(state) {
      return state.sessionId;
    },
    getCurrentUserDetails(state) {
      return state.userDetails;
    },
  },
});

export default store;
