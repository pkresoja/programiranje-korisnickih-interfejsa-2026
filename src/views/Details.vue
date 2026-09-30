<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id
</script>

<template>
   ID: {{ id }}
</template>