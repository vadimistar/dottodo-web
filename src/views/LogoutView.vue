<script setup>
import { onMounted } from 'vue'
import { logout } from '@/auth.js'

onMounted(() => logout())
</script>

<template></template>

<style scoped></style>
