// export const state = () => ({
//   auth: {},
// });

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedIn(state) {
    return state.auth.user;
  },
};
