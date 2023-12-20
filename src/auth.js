import config from '@/config.js'
import axios, { HttpStatusCode } from 'axios'
import router from '@/router/index.js'
import store from '@/store.js'

export async function refreshToken() {
  try {
    const response = await axios.post(config.backend + '/api/auth/refresh_token')

    localStorage.setItem('accessToken', response.data.accessToken)
  } catch (err) {
    if (err.response) {
      if (err.response.status === HttpStatusCode.Unauthorized) {
        await logout()
      }
    }
  }
}

export async function makeAuthRequest(request, onError) {
  return tryMakeAuthRequest(request, onError, false)
}

async function tryMakeAuthRequest(request, onError, isTokenRefreshed) {
  try {
    await request({
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
  } catch (error) {
    if (onError) {
      onError(error)
    }

    if (!error.response) {
      return
    }

    if (error.response.status === HttpStatusCode.Unauthorized) {
      if (isTokenRefreshed) {
        await logout()
        return
      }

      await refreshToken()
      return await tryMakeAuthRequest(request, onError, true)
    }
  }
}

export function isAuthorized() {
  return store.state.isLoggedIn
}

export async function login(username, password) {
  const response = await axios.post(
    config.backend + `/api/auth/login?username=${username}&password=${password}`,
    {},
    {
      withCredentials: true
    }
  )

  localStorage.setItem('accessToken', response.data.accessToken)
  localStorage.setItem('username', username)
  store.commit('setLoggedIn', true)
  store.commit('setUsername', username)
  await router.push('/workspace')
}

export async function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('username')
  store.commit('setLoggedIn', false)
  await router.push('/')
}
