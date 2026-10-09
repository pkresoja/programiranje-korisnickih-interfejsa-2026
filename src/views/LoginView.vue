<script lang="ts" setup>
import { UserService } from '@/services/user.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref<string>('')
const password = ref<string>('')
const router = useRouter()

function login() {
    if (UserService.login(email.value, password.value)) {
        const to = sessionStorage.getItem('to')
        sessionStorage.removeItem('to')
        router.push(to ?? '/user')
        return
    }

    alert('Bad username or password!')
}
</script>

<template>
    <div class="row auth-row">
        <div class="col-12 col-md-6 d-none d-md-block">
            <img src="@/assets/login.jpg" class="img-fluid">
        </div>
        <div class="col-12 col-md-6">
            <div class="card h-100">
                <div class="card-header fw-bold">Login</div>
                <div class="card-body">
                    <form @submit.prevent="login">
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
        </div>
    </div>
</template>