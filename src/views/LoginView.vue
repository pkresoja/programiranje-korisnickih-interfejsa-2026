<script lang="ts" setup>
import { UserService } from '@/services/user.service';
import { showError } from '@/utils';
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

    showError('Bad username or password!')
}
</script>

<template>
    <div class="login-wrapper d-flex align-items-center justify-content-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-10 col-lg-11">

                    <!-- Main Card Container matching the signup design layout -->
                    <div class="card auth-card border shadow-lg overflow-hidden">
                        <div class="row g-0 h-100">

                            <!-- Image Column (Strictly restricted, handles any uploaded image ratio safely) -->
                            <div class="col-md-6 d-none d-md-block position-relative login-image-container">
                                <img src="@/assets/login.jpg" class="login-image" alt="Login Visual">
                                <div class="image-overlay"></div>
                            </div>

                            <!-- Form Column (Uses Bootstrap native background/text theme variables) -->
                            <div class="col-md-6 d-flex flex-column bg-body">
                                <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-between h-100">

                                    <div>
                                        <div class="mb-4">
                                            <h2 class="fw-bold mb-1">Welcome Back</h2>
                                            <p class="text-muted small mb-0">Please sign in to your account</p>
                                        </div>

                                        <form @submit.prevent="login">
                                            <div class="mb-3">
                                                <label for="email" class="form-label small fw-semibold">Email
                                                    address</label>
                                                <input type="email" class="form-control form-control-lg fs-6" id="email"
                                                    v-model="email" placeholder="name@example.com">
                                            </div>

                                            <div class="mb-4">
                                                <label for="password"
                                                    class="form-label small fw-semibold">Password</label>
                                                <input type="password" class="form-control form-control-lg fs-6"
                                                    id="password" v-model="password" placeholder="••••••••">
                                            </div>

                                            <button type="submit"
                                                class="btn btn-primary btn-lg w-100 fs-6 py-2 shadow-sm">Sign
                                                In</button>
                                        </form>
                                    </div>

                                    <div class="text-center mt-4">
                                        <p class="small text-muted mb-0">Don't have an account? <router-link
                                                to="/signup"
                                                class="text-primary text-decoration-none fw-semibold">Create
                                                account</router-link></p>
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
/* Fixed layout container matching signup layout precisely */
.auth-card {
    height: 600px;
    border-radius: 1rem;
    border-color: var(--bs-border-color) !important;
}

/* Image container fills 100% of the locked card height */
.login-image-container {
    height: 100%;
    overflow: hidden;
    position: relative;
}

/* Forces any uploaded login image to strictly fill and cover the container bounds */
.login-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-image-container:hover .login-image {
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