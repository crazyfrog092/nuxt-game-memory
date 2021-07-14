export default {
  setResult(state, result) {
    state.results.push({
      name: state.userName,
      result,
    });
  },
  setUserName(state, name) {
    state.userName = name || '';
  },
};
