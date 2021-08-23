import { createRouter, createWebHistory } from "vue-router";
import { getLocalStorage } from "../helpers/local_storage";

import Albums from '../views/album/Index.vue';
import Photo from '../views/photo/Index.vue';
import NewPhoto from '../views/photo/New.vue';
import Login from '../views/auth/Login.vue';

const routes = [
  { 
    path: '/',
    name: 'albums',
    component: Albums 
  },
  { 
    path: '/photo/:id',
    name: 'photo',
    component: Photo,
  },
  { 
    path: '/photo/add/:id',
    name: 'addPhoto',
    component: NewPhoto 
  },
  { 
    path: '/photo/edit',
    name: 'editPhoto',
    component: NewPhoto 
  },
  { 
    path: '/login',
    name: 'login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const arraRoute = ['login','albums','photo','addPhoto'];
  const storage = getLocalStorage('authenticated')
  if(!arraRoute .includes(to.name) && storage == undefined) next({name: 'login'})
  if(to.name === 'login' && storage) next({name: 'albums'})
  else next();
})

export default router