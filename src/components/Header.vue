<script setup>
import { useStore } from 'vuex'

const store = useStore()

const username = localStorage.getItem('username') || ''

if (username) {
  store.commit('setLoggedIn', true)
  store.commit('setUsername', username)
}
</script>

<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/" class="nav-link">dottodo</router-link>
    </div>

    <div v-if="!store.state.isLoggedIn" class="user-section">
      <router-link to="/login" class="nav-link">вход</router-link>
      <router-link to="/register" class="nav-link">регистрация</router-link>
    </div>
    <div v-else class="user-section">
      <div style="font-weight: normal">
        {{ store.state.username }}
      </div>
      <router-link to="/logout" class="nav-link">выйти</router-link>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
}

.user-section {
  display: flex;
  gap: 1rem;
  font-weight: bolder;
}

.nav-link {
  color: #373e62;
  text-decoration: none;
}
</style>
