<template>
  <div class="container">
    <div class="row">
      <div :class="alert" role="alert" v-if="isMsg">
        {{message}}
      </div>
      <div :class="[auth ? 'col-8 border':'col-12 border']">
        <div class="row pt-3 mb-3 pb-3 border-bottom">
          <div class="col-7 pt-1">
            <button type="button" class="btn btn-outline-primary" @click="back">Back</button> 
          </div>
          <div class="col-5">
            <form class="d-flex">
              <input type="text" class="form-control me-2" :style="[auth ? 'width: 80%':'width: 100%']" v-model="payload.title" placeholder="e.g familly">
              <router-link class="btn btn-primary btn-sm" :to="{name: 'addPhoto', params: {id: id}}" v-if="auth">Photo</router-link>
            </form>
          </div>
        </div>
        <div class="row">  
          <div class="col">
            <div class="row row-cols-1 row-cols-md-5 g-4">
              <div v-for="(item, index) in photos.items" :key="index">
                <div class="card h-100">
                  <img :src="item.url" class="card-img-top" width="50">
                  <div class="card-body">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :value="item" v-model="photos.check" id="flexCheckDefault">
                      <label class="form-check-label" for="flexCheckDefault" v-html="item.title"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br>
          </div>
          <hr>
          <div class="col">
            <div class="row">
              <pagination 
                v-model="payload.page"
                :records="photos.totalItems" 
                :per-page="payload.size" 
              />
            </div>
          </div>
        </div>  
      </div>
      <div class="col-4 border-start-0 border-top border-end border-bottom bg-light" v-if="auth">
        <div class="row pt-3 mb-3 pb-3 bg-white border-bottom">
          <form class="d-flex">
            <vue-select
              v-model="searchAlbums"
              :options="options"
              :visible-options="visibleOptions"
              label-by="title"
              searchable
              :close-on-select="true"
              :clear-on-close="true"
              :loading="loading"
              @search:input="filterItem"
              search-placeholder="Select album"
              class="form-control me-2"
              style="width: 80%;"
            />
            <button class="btn btn-outline-primary btn-sm" @click.prevent="sendTo">Send to</button>
          </form>
        </div>
        <div class="row">
          <p class="pb-3 border-bottom">Photo list be for transfer to album : <strong>{{searchAlbums.title}}</strong></p>
        </div>
        <div v-for="(check, index) in photos.check" :key="index">
          <span class="badge text-dark border p-4 mt-2 me-3 bg-white">{{check.title}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <router-link :to="{name: 'editPhoto', query: check }"><font-awesome-icon :icon="['fas', 'pen']" /></router-link>
            <button type="button" class="btn btn-link" @click="deletePhoto(check.id)"><font-awesome-icon class="text-danger" :icon="['fas', 'trash']" /></button>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import Pagination from 'v-pagination-3';
import { useRoute } from "vue-router"
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import VueSelect from 'vue-next-select'
import 'vue-next-select/dist/index.min.css'
import { axiosWrapper } from "../../helpers/axios_wrapper";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash,faPen)

export default {
   components: { 
    Pagination,
    VueSelect,
    'font-awesome-icon': FontAwesomeIcon
  },
  setup(){
    const route = new useRoute();
    const store = new useStore();
    const id = route.params.id;
    const auth = computed(() => store.state.data.isLoggedIn)
    const message = computed(() => store.state.message);
    const isMsg = computed(() => store.state.isMassage);
    const alert = computed(() => store.state.alert);

    const modelValue = ref([])
    const options = computed(() => [...new Set([...visibleOptions.value])])
    const visibleOptions = ref([])
    const loading = ref(false)
    const searchAlbums = ref('')

    const photos = reactive({
      totalItems: 0,
      items: [],
      totalPages: 0,
      currentPage: 0,
      check: [],
      selectedAlbum: null,
    });

    const payload = reactive({
      id: id,
      page: 1,
      size: 10,
      title: '',
    });

    const albums = reactive({
      id: null,
      title: '',
      items: [],
      filteredItems: []
    });

    const filterItem = (inputEvent) => {
      if (inputEvent.target.value === '') {
        visibleOptions.value = [...modelValue.value]
        return
      }
      loading.value = true
      visibleOptions.value = albums.items.filter(album => album.title.toLowerCase().includes(inputEvent.target.value) );
      loading.value = false
    };

    const setAlbum = (a) => {
      albums.title = a.title;
      albums.id = a.id;
    } 

    watch(() => {
      setAlbum(searchAlbums.value)
    })

    onMounted(() => {
      getPhoto()
      getAlbums()
    });

    const getAlbums = () => {
      axiosWrapper.get('/albums/list')
      .then((res) => {
        if(res.code = 200 || res.status == 'SUCCESS'){
          res.data.data.map(a => {
            albums.items.push({
              id: a.albumId,
              title: a.title 
            });
          })
        }
      });
    }

    const getPhoto = () => {
      let page = payload.page - 1;
      axiosWrapper.get(`/photos/album/list?id=${payload.id}&page=${page}&size=${payload.size}&title=${payload.title}`)
      .then((response) => response.data)
      .then((data) => {
        if(data.code == 200){
          photos.totalItems = data.data.totalItems;
          photos.totalPages = data.data.totalPages;
          photos.currentPage = data.data.currentPage;
          photos.items = data.data.items;
        }
      })
      .catch((err) => {
        console.log(err.response);
      })
    };

    const sendTo = () => {
      if(photos.check.length == 0){
        Swal.fire('Please, select the photo to be moved!!')
        return;
      }

      if(!albums.id){
        Swal.fire('Please select the destination album!!')
        return;
      }

      const checked = photos.check.map(a => a.id);
      const payload = {
        'toAlbum': albums.id,
        'photos': checked
      };
      axiosWrapper.put(`/photos/move/${id}`, payload)
        .then((res) => {
          let msg = '';
          let alert = '';
          if(res.data.code == 201 || res.data.status == 'SUCCESS'){
            msg = res.data.message;
            albums.id = null;
            alert = 'alert alert-info';
            photos.check = [];
            searchAlbums.value = '';
            getPhoto();
          }else{
            alert = 'alert alert-danger';
            msg = 'Transferred photos process failed!!';
          }
          store.commit('setMessage', {message: msg});
          store.commit('setIsMessage', {status: true});
          store.commit('setAlert', {alert: alert});
        })
    }

    const deletePhoto = (id) => {
      Swal.fire({
        title: 'Do you want to delete this photo?',
        showCancelButton: true,
        confirmButtonText: `Save`,
      }).then((result) => {
        if (result.isConfirmed) {
          axiosWrapper.delete(`/photos/${id}`)
            .then((res) =>{
              if(res.data.code == 201 || res.data.status == 'SUCCESS'){
                photos.check = [];
                getPhoto();
                Swal.fire(res.data.message, '', 'success')
              }
            })
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }

    const back = () => {
      window.history.go(-1)
    };

    watch(payload, getPhoto);
    
    return {
      auth,
      searchAlbums,
      photos,
      payload,
      albums,
      sendTo,
      message,
      isMsg,
      alert,
      filterItem,
      options,
      visibleOptions,
      loading,
      back,
      id,
      deletePhoto
    }
  }
}
</script>

