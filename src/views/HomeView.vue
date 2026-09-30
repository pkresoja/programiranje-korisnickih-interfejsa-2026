<script setup lang="ts">
import { QuestionService } from '@/services/question.service';
import { ref } from 'vue';

const questions = ref<any[]>()

QuestionService.getAll()
  .then(rsp => questions.value = rsp.data)
</script>

<template>
  <ul>
    <li>ID - Pitanje</li>
    <!-- <li v-for="q in questions" :class="q.questionId % 2 === 0 ? 'yellow' : 'blue'">
      {{ q.questionId }} - {{ q.text }}</li> -->

       <li v-for="q in questions">
        <span class="yellow" v-if="q.questionId % 2 === 0">
          {{ q.questionId }} - {{ q.text }}
        </span>
        <span class="blue" v-else>
          {{ q.questionId }} - {{ q.text }}
        </span>
       </li>
  </ul>
  <pre>{{ questions }}</pre>
</template>

<style>
.yellow {
  color: yellow;
}

.blue {
  color: aquamarine;
}
</style>
