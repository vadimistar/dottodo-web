<script setup>
import Button from '@/components/Button.vue'
import { onMounted, ref } from 'vue'
import axios, { HttpStatusCode } from 'axios'
import config from '@/config.js'
import { makeAuthRequest, refreshToken } from '@/auth.js'

function getEndpoint(path) {
  return config.backend + '/api/board' + path
}

const items = ref([])

async function fetchBoards() {
  await makeAuthRequest(
    async (requestConfig) => {
      items.value = []

      const response = await axios.get(getEndpoint(''), requestConfig)

      response.data.forEach((board) => {
        items.value.push({
          id: board.id,
          title: board.title,
          lastUpdated: new Date(board.updatedAt)
        })
      })
    },
    (_) => {}
  )
}

onMounted(async () => await fetchBoards())

function formatTimestamp(timestamp) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  return timestamp.toLocaleString('ru-RU', options)
}

async function addBoard() {
  await makeAuthRequest(
    async (requestConfig) => {
      const response = await axios.post(getEndpoint('?title=Новая доска'), {}, requestConfig)

      items.value.push({
        id: response.data.id,
        title: 'Новая доска',
        lastUpdated: formatTimestamp(new Date(Date.now()))
      })
    },
    (_) => {}
  )
}

async function removeBoard(id, index) {
  await makeAuthRequest(
    async (requestConfig) => {
      await axios.delete(getEndpoint(`/${id}`), requestConfig)

      items.value.splice(index, 1)
    },
    (_) => {}
  )
}

function getBoardUrl(item) {
  return `/board/${item.id}`
}
</script>

<template>
  <Button class="create-button" text="Создать доску" :onClick="addBoard" />
  <div class="grid-container">
    <div v-for="(item, index) in items" :key="index" class="grid-item">
      <router-link :key="index" :to="getBoardUrl(item)" class="grid-text">
        <div class="header-container">
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="timestamp">Изменено {{ formatTimestamp(item.lastUpdated) }}</div>
      </router-link>
      <button v-on:click.stop="removeBoard(item.id, index)" class="remove-button">X</button>
    </div>
  </div>
</template>

<style scoped>
.create-button {
  margin-bottom: 20px;
}

.grid-container {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: #373e62;
  padding: 20px 20px 100px;
  display: flex;
  justify-content: space-between;
}

.grid-text {
  color: white;
  cursor: pointer;
  text-decoration: none;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-button {
  border: none;
  border-radius: 100%;
  cursor: pointer;
  font-weight: bold;
  background-color: #bb9cc0;
  height: 20px;
}
</style>
