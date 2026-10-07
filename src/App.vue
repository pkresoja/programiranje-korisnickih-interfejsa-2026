<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UserService } from './services/user.service';

const router = useRouter()
function logout() {
  if (!confirm('Are you sure you want to sign out?'))
    return
  
  UserService.logout()
  router.push('/login')
}
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
          <!-- KORISNIK JE ULOGOVAN -->
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
          <!-- KORISNIK NIJE ULOGOVAN -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/login">
                <i class="fa-solid fa-right-to-bracket"></i> Login
              </RouterLink>
            </li>
          </template>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <div class="container">
    <RouterView :key="$route.fullPath" />
  </div>
</template>