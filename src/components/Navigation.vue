<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Album Application</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
        </ul>
        <form class="d-flex" v-if="!auth">
          <router-link class="btn btn-outline-primary btn-sm me-3" to="/login">Login</router-link>
        </form>
        <form class="d-flex" v-if="auth">
          <button class="btn btn-danger btn-sm me-3" @click="logout">Logout</button>
        </form>
      </div>
    </div>
  </nav>
  <br>
</template>

<script>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"; 
import { removeLocalStorage } from "../helpers/local_storage";

export default {
  name: 'Navigation',
  setup() {
    const router = new useRouter();
    const store = new useStore();
    const auth = computed(() => store.state.data.isLoggedIn)

    const logout = (() => {
      removeLocalStorage()
      router.push('/');
    });

    return {
      auth,
      logout      
    }
  }
}
</script>
