<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UserService } from './services/user.service';
import { onMounted, ref, watch } from 'vue';
import Chatbot from './components/Chatbot.vue';
import { showConfirm } from './utils.ts';

const router = useRouter();

function logout() {
  showConfirm('Are you sure you want to sign out?', () => {
    UserService.logout();
    router.push('/login');
  })
}

const searchInput = ref<string>('');
const themeSwitch = ref<boolean>(true);

watch(themeSwitch, () => {
  const theme = themeSwitch.value ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  document.body.setAttribute('data-bs-theme', theme);
});

function search() {
  const q = searchInput.value;

  if (q == '')
    return;

  searchInput.value = '';

  router.push({
    path: '/',
    query: {
      search: q
    }
  });
}

onMounted(() => {
  const theme = localStorage.getItem('theme');

  document.body.setAttribute('data-bs-theme', theme ?? 'dark');
  themeSwitch.value = theme == 'dark';
});
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="fa-solid fa-plane-departure"></i> PKI 2026
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/">
              <i class="fa-solid fa-house"></i> Home
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/about">
              <i class="fa-solid fa-circle-info"></i> About
            </RouterLink>
          </li>

          <!-- Logged-in user -->
          <template v-if="UserService.getActiveUser()">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/user">
                <i class="fa-solid fa-user"></i> Account
              </RouterLink>
            </li>

            <li class="nav-item">
              <button type="button" class="nav-link" @click="logout()">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </li>
          </template>

          <!-- Logged-out user -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/login">
                <i class="fa-solid fa-right-to-bracket"></i> Login
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/signup">
                <i class="fa-solid fa-user-plus"></i> Signup
              </RouterLink>
            </li>
          </template>
        </ul>

        <!-- Search -->
        <form class="d-flex" role="search" @submit.prevent="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
            v-model="searchInput" />

          <button class="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        <!-- Dark/light theme switch -->
        <div class="form-check form-switch mx-3">
          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
            v-model="themeSwitch" />

          <label class="form-check-label" for="flexSwitchCheckDefault">
            <i class="fa-solid fa-moon"></i>
          </label>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main page content -->
  <div class="container">
    <RouterView :key="$route.fullPath" />
  </div>

  <!-- Floating chatbot on every page -->
  <Chatbot />
</template>
