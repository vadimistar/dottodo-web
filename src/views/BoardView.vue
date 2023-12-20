<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import Button from '@/components/Button.vue'
import EditableText from '@/components/EditableText.vue'
import { useRoute } from 'vue-router'
import { makeAuthRequest } from '@/auth.js'
import axios from 'axios'
import config from '@/config.js'
import router from '@/router/index.js'

const route = useRoute()
const boardId = ref(route.params.id)

let title = ref('')
let cards = ref([])
let draggedTask = ref(null)

async function fetchBoardName(boardId) {
  await makeAuthRequest(async (requestConfig) => {
    title.value = ''

    const response = await axios.get(config.backend + `/api/board/${boardId}`, requestConfig)

    title.value = response.data.title
  })
}

async function fetchCards(boardId) {
  await makeAuthRequest(async (requestConfig) => {
    cards.value = []

    const response = await axios.get(config.backend + `/api/board/${boardId}/card`, requestConfig)

    for (let i = 0; i < response.data.length; i++) {
      cards.value.push({
        id: response.data[i].id,
        title: response.data[i].title,
        items: []
      })

      for (let j = 0; j < response.data[i].tasks.length; j++) {
        cards.value[i].items.push({
          id: response.data[i].tasks[j].id,
          title: response.data[i].tasks[j].title
        })
      }
    }
  })
}

async function fetchInfo(boardId) {
  if (!boardId) {
    return
  }

  await fetchBoardName(boardId)
  await fetchCards(boardId)
}

watchEffect(() => {
  if (boardId.value) {
    fetchInfo(boardId.value)
  }
})

onMounted(async () => await fetchInfo())

function dragBegin(task, card) {
  draggedTask.value = { task, card }
}

function dragOver(event) {
  event.dataTransfer.dropEffect = 'move'
}

async function drop(task, targetCard) {
  if (!draggedTask.value) return

  const draggedTaskItem = draggedTask.value.task
  const sourceCard = draggedTask.value.card

  if (sourceCard === targetCard) return

  await makeAuthRequest(async (requestConfig) => {
    await axios.patch(
      config.backend + `/api/board/card/task/${draggedTaskItem.id}?cardId=${targetCard.id}`,
      {},
      requestConfig
    )

    sourceCard.items.splice(sourceCard.items.indexOf(draggedTaskItem), 1)
    targetCard.items.push(draggedTaskItem)

    draggedTask.value = null
  })
}

async function removeTask(taskIndex, taskId, card) {
  await makeAuthRequest(async (requestConfig) => {
    await axios.delete(config.backend + `/api/board/card/task/${taskId}`, requestConfig)

    card.items.splice(taskIndex, 1)
  })
}

async function removeCard(cardIndex, cardId) {
  await makeAuthRequest(async (requestConfig) => {
    await axios.delete(config.backend + `/api/board/card/${cardId}`, requestConfig)

    cards.value.splice(cardIndex, 1)
  })
}

async function updateCardTitle(index, newTitle, cardId) {
  await makeAuthRequest(async (requestConfig) => {
    await axios.patch(
      config.backend + `/api/board/card/${cardId}?title=${newTitle}`,
      {},
      requestConfig
    )

    cards.value[index].title = newTitle
  })
}

async function updateTaskTitle(card, index, newTitle, taskId) {
  await makeAuthRequest(async (requestConfig) => {
    await axios.patch(
      config.backend + `/api/board/card/task/${taskId}?title=${newTitle}`,
      {},
      requestConfig
    )

    card.items[index].title = newTitle
  })
}

async function updateBoardTitle(newTitle, boardId) {
  await makeAuthRequest(async (requestConfig) => {
    await axios.patch(config.backend + `/api/board/${boardId}?title=${newTitle}`, {}, requestConfig)

    title.value = newTitle
  })
}

async function addTask(cardIndex, cardId) {
  await makeAuthRequest(async (requestConfig) => {
    const response = await axios.post(
      config.backend + `/api/board/card/${cardId}/task?title=Новое задание`,
      {},
      requestConfig
    )

    cards.value[cardIndex].items.push({
      id: response.data.id,
      title: 'Новое задание'
    })
  })
}

async function addCard(boardId) {
  await makeAuthRequest(async (requestConfig) => {
    const response = await axios.post(
      config.backend + `/api/board/${boardId}/card?title=Новый список`,
      {},
      requestConfig
    )
    cards.value.push({
      id: response.data.id,
      title: 'Новый список',
      items: []
    })
  })
}

async function returnBack() {
  await router.push('/workspace')
}
</script>

<template>
  <div class="header-container">
    <div class="board-title">
      <EditableText :text="title" @update-text="updateBoardTitle($event, boardId)" />
    </div>
    <Button text="Назад" v-on:click="returnBack" />
    <Button text="Создать список" v-on:click="addCard(boardId)" />
  </div>
  <div class="task-container">
    <div v-for="(card, index) in cards" :key="index" class="card">
      <div class="card-header">
        <EditableText :text="card.title" @update-text="updateCardTitle(index, $event, card.id)" />
        <div class="card-header-buttons">
          <button v-on:click="() => addTask(index, card.id)" class="add-button">+</button>
          <button v-on:click="() => removeCard(index, card.id)" class="remove-button">X</button>
        </div>
      </div>
      <div
        class="card-items"
        :style="{ minHeight: card.items.length > 0 ? 'auto' : '50px' }"
        @dragover.prevent="dragOver"
        @drop="drop(null, card)"
      >
        <div
          v-for="(task, taskIndex) in card.items"
          @dragstart="dragBegin(task, card)"
          @dragover.prevent="dragOver"
          @drop="drop(task, card)"
          @drop.stop
          :key="taskIndex"
          class="task-item"
          draggable="true"
        >
          <EditableText
            :text="task.title"
            @update-text="updateTaskTitle(card, taskIndex, $event, task.id)"
          />
          <button v-on:click="removeTask(taskIndex, task.id, card)" class="remove-button">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-title {
  font-size: 2rem;
  font-weight: bold;
}

.header-container {
  display: flex;
  gap: 20px;
  height: 40px;
  margin-bottom: 30px;
  align-items: center;
}

.task-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
}

.card-items {
  min-height: 100px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-top: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bolder;
  font-size: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-header-buttons {
  display: flex;
  gap: 10px;
}

.task-item {
  margin: 4px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.task-item button,
.card-header button {
  border: none;
  border-radius: 100%;
  cursor: pointer;
  font-weight: bold;
}

.remove-button {
  background-color: #bb9cc0;
}

.add-button {
  background-color: #67729d;
  color: white;
}
</style>
