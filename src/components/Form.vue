<script setup>
import Button from '@/components/Button.vue'

defineProps(['title', 'items', 'submitText', 'action', 'error'])
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="action" method="post" action="">
      <h2>{{ title }}</h2>
      <div v-for="(item, index) in items" :key="index">
        <label :for="item.name">{{ item.label }}</label>
        <input :type="item.type" :id="item.name" v-model="item.value" :required="item.required" />
      </div>
      <div class="error-text">{{ error }}</div>
      <div class="button-container">
        <Button :text="submitText" />
      </div>
    </form>
  </div>
</template>
<style scoped>
.error-text {
  color: #835c72;
  font-weight: bolder;
  margin-bottom: 15px;
}

.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  width: 300px;
  padding: 20px;
}

h2 {
  text-align: center;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

button {
  background-color: #373e62;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 30px;
}

.button-container {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>
