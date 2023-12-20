import { createStore } from 'vuex'

export default createStore({
  store: {
    isLoggedIn: false,
    username: ''
  },
  mutations: {
    setLoggedIn(state, value) {
      state.isLoggedIn = value
    },
    setUsername(state, value) {
      state.username = value
    }
  }
})
