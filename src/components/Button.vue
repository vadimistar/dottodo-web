<script setup>
defineProps(['text', 'onclick'])
</script>

<template>
  <button type="submit" class="button" v-on:click="onclick">{{ text }}</button>
</template>

<style scoped>
button {
  background-color: #373e62;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 30px;
}
</style>
