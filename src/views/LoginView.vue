<script lang="ts" setup>
import { ref } from 'vue';

const email = ref<string>('')
const password = ref<string>('')
</script>

<template>
    <p>Input: {{ email }} {{ password }}</p>
    <div class="card auth-card">
        <div class="card-header fw-bold">Login</div>
        <div class="card-body">
            <form>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" v-model="email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>