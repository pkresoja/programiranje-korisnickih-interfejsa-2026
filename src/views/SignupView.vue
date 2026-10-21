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
    if (email.value.trim() === '') {
        showError('Email cannot be empty!')
        return
    }

    if (!selected.value) {
        showError('Destination cannot be empty!')
        return
    }

    if (password.value !== confirm.value) {
        showError('Passwords don\'t match!')
        return
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
    <div class="signup-wrapper d-flex align-items-center justify-content-center py-5" v-if="destinations">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-10 col-lg-11">

                    <!-- Main Card Container with Locked Height & Flex Alignment -->
                    <div class="card auth-card border shadow-lg overflow-hidden">
                        <div class="row g-0 h-100">

                            <!-- Image Column (Strictly restricted, handles any uploaded image ratio) -->
                            <div class="col-md-6 d-none d-md-block position-relative signup-image-container">
                                <img src="@/assets/signup.jpg" class="signup-image" alt="Travel Destination">
                                <div class="image-overlay"></div>
                            </div>

                            <!-- Form Column (Uses Bootstrap native background/text variables) -->
                            <div class="col-md-6 d-flex flex-column bg-body">
                                <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-between h-100">

                                    <div>
                                        <div class="mb-4">
                                            <h2 class="fw-bold mb-1">Create Account</h2>
                                            <p class="text-muted small mb-0">Start your journey with us today</p>
                                        </div>

                                        <form @submit.prevent="signup">
                                            <div class="mb-3">
                                                <label for="email" class="form-label small fw-semibold">Email
                                                    address</label>
                                                <input type="email" class="form-control form-control-lg fs-6" id="email"
                                                    v-model="email" placeholder="name@example.com">
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label small fw-semibold">Favourite
                                                    Destination</label>
                                                <select class="form-select form-select-lg fs-6" v-model="selected">
                                                    <option v-for="item in destinations" :value="item">{{ item }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="mb-3">
                                                <label for="password"
                                                    class="form-label small fw-semibold">Password</label>
                                                <input type="password" class="form-control form-control-lg fs-6"
                                                    id="password" v-model="password" placeholder="••••••••">
                                            </div>

                                            <div class="mb-4">
                                                <label for="confirm" class="form-label small fw-semibold">Repeat
                                                    Password</label>
                                                <input type="password" class="form-control form-control-lg fs-6"
                                                    id="confirm" v-model="confirm" placeholder="••••••••">
                                            </div>

                                            <button type="submit"
                                                class="btn btn-primary btn-lg w-100 fs-6 py-2 shadow-sm">Create
                                                Account</button>
                                        </form>
                                    </div>

                                    <div class="text-center mt-4">
                                        <p class="small text-muted mb-0">Already have an account? <router-link
                                                to="/login" class="text-primary text-decoration-none fw-semibold">Sign
                                                in</router-link></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Fixed layout container to guarantee the image never stretches past the form */
.auth-card {
    height: 600px;
    border-radius: 1rem;
    /* Automatically respects Bootstrap's color system for borders and surfaces */
    border-color: var(--bs-border-color) !important;
}

/* Image container fills 100% of the locked card height */
.signup-image-container {
    height: 100%;
    overflow: hidden;
    position: relative;
}

/* Forces any uploaded image to strictly fill and cover the container bounds */
.signup-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.signup-image-container:hover .signup-image {
    transform: scale(1.04);
}

/* Subtle overlay that adapts nicely to both dark and light moods */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.25));
    pointer-events: none;
}

/* Responsive adjustment for small screens where the image is hidden */
@media (max-width: 767.98px) {
    .auth-card {
        height: auto;
    }
}
</style>