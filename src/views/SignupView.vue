<script lang="ts" setup>
import { FlightService } from '@/services/flight.service';
import { UserService } from '@/services/user.service';
import { showError } from '@/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref<string>('')
const password = ref<string>('')
const confirm = ref<string>('')
const selected = ref<string>()
const destinations = ref<string[]>()
const router = useRouter()

FlightService.getDestinations()
    .then(rsp => {
        destinations.value = rsp.data
        selected.value = rsp.data[0]
    })

function signup() {
    if (email.value == '') {
        showError('Email cant be empty!')
    }

    if (selected.value == '') {
        showError('Destination cant be empty!')
    }

    if (password.value != confirm.value) {
        showError('Passwords dont match!')
    }

    const err = UserService.createUser(email.value, password.value, selected.value!)

    if (err == null) {
        router.push('/login')
        return
    }

    showError(err)
}
</script>

<template>
    <div class="row auth-row" v-if="destinations">
        <div class="col-12 col-md-6 d-none d-md-block">
            <img src="@/assets/signup.jpg" class="img-fluid">
        </div>
        <div class="col-12 col-md-6">
            <div class="card h-100">
                <div class="card-header fw-bold">Create account</div>
                <div class="card-body">
                    <form @submit.prevent="signup">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" v-model="email">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Favourite Destination</label>
                            <select class="form-select" v-model="selected">
                                <option v-for="item in destinations" :value="item">{{ item }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="password">
                        </div>
                        <div class="mb-3">
                            <label for="confirm" class="form-label">Repeat Password</label>
                            <input type="password" class="form-control" id="confirm" v-model="confirm">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>