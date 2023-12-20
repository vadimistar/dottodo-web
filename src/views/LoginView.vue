<script setup>
import Form from '@/components/Form.vue'
import { onMounted, ref } from 'vue'
import { HttpStatusCode } from 'axios'
import { isAuthorized, login } from '@/auth.js'
import router from '@/router/index.js'

onMounted(() => {
  if (isAuthorized()) {
    router.push('/')
  }
})

const items = ref([
  {
    name: 'username',
    label: 'Имя пользователя',
    type: 'text',
    value: '',
    required: true,
    error: ''
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    value: '',
    required: true,
    error: ''
  }
])

const error = ref('')

async function loginAction() {
  const username = items.value[0].value
  const password = items.value[1].value

  try {
    await login(username, password)
  } catch (err) {
    if (err.response) {
      if (err.response.status === HttpStatusCode.Unauthorized) {
        error.value = 'Неверный логин и (или) пароль'
      }
    }
  }
}
</script>

<template>
  <Form title="Вход" submit-text="Войти" :action="loginAction" :items="items" :error="error" />
</template>

<style scoped></style>
