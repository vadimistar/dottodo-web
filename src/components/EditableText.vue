<script setup>
import { ref } from 'vue'

const props = defineProps(['text', 'elementClass'])
const emit = defineEmits(['update-text'])

const editing = ref(false)
const editText = ref(props.text)

function startEditing() {
  editing.value = true
}

function finishEditing() {
  if (editText.value.length === 0) {
    return
  }
  editing.value = false
  emit('update-text', editText.value)
}
</script>

<template>
  <div v-if="editing">
    <input v-model="editText" v-on:keyup.enter="finishEditing()" />
  </div>
  <div v-else>
    <a style="text-decoration: none" @click="startEditing()">{{ text }}</a>
  </div>
</template>

<style scoped></style>
