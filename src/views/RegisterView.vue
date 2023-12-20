<script setup>
import Form from '@/components/Form.vue'
import { onMounted, ref } from 'vue'
import config from '@/config.js'
import axios, { HttpStatusCode } from 'axios'
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
    required: true
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    value: '',
    required: true
  },
  {
    name: 'confirmPassword',
    label: 'Повторить пароль',
    type: 'password',
    value: '',
    required: true
  }
])

const error = ref('')

async function register() {
  const username = items.value[0].value
  const password = items.value[1].value
  const confirmPassword = items.value[2].value

  if (password !== confirmPassword) {
    error.value = 'Пароль и повторенный пароль разные'
    return
  }

  try {
    await axios.post(
      config.backend + `/api/auth/register?username=${username}&password=${password}`
    )
    await login(username, password)
  } catch (err) {
    if (err.response) {
      if (err.response.status === HttpStatusCode.BadRequest) {
        error.value = err.response.data.errors.join('')
      }
    }
  }
}
</script>

<template>
  <Form
    title="Регистрация"
    submit-text="Создать аккаунт"
    :action="register"
    :items="items"
    :error="error"
  />
</template>

<style scoped></style>
