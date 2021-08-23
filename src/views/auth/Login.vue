<template>
  <div class="container">
    <div class="row">
      <div class="col align-self-start"></div>
      <div class="col align-self-center">
        <main class="form-signin">
          <h1 class="h3 mb-3 fw-normal">Please Login</h1>
          <div :class="alert" role="alert" v-if="isMsg" v-html="message"></div>
          <div class="form-floating">
            <input type="email" class="form-control form-control-sm" v-model="email" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Email address</label>
          </div>
          <br>
          <div class="form-floating">
            <input type="password" class="form-control form-control-sm" v-model="password" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
          </div>
          <br>
          <button type="button" class="w-100 btn btn-lg btn-primary" @click="login">Sign in</button>
        </main>
      </div>
      <div class="col align-self-end"></div>
    </div>
  </div>    
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from "vuex";
import { useRouter } from "vue-router"
import { axiosWrapper } from "../../helpers/axios_wrapper";

export default {
  setup() {
    const router = new useRouter();
    const store = new useStore();
    const message = computed(() => store.state.message);
    const isMsg = computed(() => store.state.isMassage);
    const alert = computed(() => store.state.alert);

    const payload = reactive({
      email: '',
      password: ''
    });

    const login = () => {
      axiosWrapper.post('/auth/signin', payload)
      .then((res) => {
        let msg = '';
        let alert = '';
        if(res.data.code == 400 || res.data.status == "ERROR") {
          msg = res.data.message;
          alert = 'alert alert-danger';
          msg = res.data.message;
        }else{
          msg = res.data.message;
          alert = 'alert alert-info';
          store.commit('authenticated', {data : { isLoggedIn : true, token: res.data.token } });
          router.push('/');
        }
        store.commit('setIsMessage', {status: true});
        store.commit('setMessage', {message: msg});
        store.commit('setAlert', {alert: alert});
      })
    }

    return {
      ...toRefs(payload),
      login, message, isMsg, alert
    }
  },
}
</script>