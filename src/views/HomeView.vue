<script setup>
import { onMounted } from 'vue'
import router from '@/router/index.js'
import { isAuthorized } from '@/auth.js'

onMounted(() => {
  if (isAuthorized()) {
    router.push('/workspace')
  }
})
</script>

<template>
  <main class="invite">
    <div class="invite-logo">dottodo</div>
    <div class="invite-text">Для начала работы войдите в аккаунт.</div>
    <div class="invite-buttons">
      <router-link to="/login" class="nav-link">Вход</router-link>
      <router-link to="/register" class="nav-link">Регистрация</router-link>
    </div>
  </main>
</template>

<style scoped>
.invite {
  text-align: center;
  margin: 4rem;
}

.invite-logo {
  font-size: 4rem;
  font-weight: bold;
}

.invite-text {
  margin-top: 1rem;
  font-size: 2rem;
  font-weight: bolder;
}

.invite-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.5rem;
  font-weight: bolder;
}

.nav-link {
  color: white;
  background-color: #373e62;
  padding: 20px;
  text-decoration: none;
  border-radius: 20px;
}
</style>
