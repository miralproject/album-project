<template>
  <div class="container">
    <div class="row">
      <div :class="alert" role="alert" v-if="isMsg" v-html="message"></div>
    </div>  
  </div>
  <div class="container border">
    <div class="row pt-3 mb-3 pb-3 border-bottom">
      <div class="col-7 pt-1">
        <h5>Album List : </h5>  
      </div>
      <div class="col-5">
        <form class="d-flex">
          <input type="text" class="form-control me-3" :style="[auth ? 'width: 80%':'width: 100%']" v-model="payload.title" placeholder="e.g album kenangan">
          <button class="btn btn-outline-primary btn-sm" type="button" @click="add" v-if="auth">Album</button>
        </form>
      </div>
    </div>
    <div class="row pb-3 border-bottom"> 
      <div class="col-12">
        <div class="row row-cols-1 row-cols-md-5 g-4">
          <div v-for="(item, index) in albums.items" :key="index">
            <div class="card">
              <router-link class="link-light" :to="{name: 'photo', params: {id: item.albumId}}">
              <img src="https://via.placeholder.com/150/92c952" class="card-img-top" alt="...">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" v-text="item.title"></li>
              </ul>
              </router-link>
              <div class="card-body" v-if="auth">
                <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteAlbum(item)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row"> 
      <div class="col-12">
        <div class="row mt-3">
          <pagination 
            v-model="payload.page"
            :records="albums.totalItems" 
            :per-page="payload.size" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { onMounted, reactive, toRefs, watch, computed } from 'vue'
import { useStore } from "vuex";
import Pagination from 'v-pagination-3';
import { axiosWrapper } from "../../helpers/axios_wrapper";

export default {
  components: { 
    Pagination 
  },
  setup() {
    const store = new useStore();
    const auth = computed(() => store.state.data.isLoggedIn)
    const message = computed(() => store.state.message);
    const isMsg = computed(() => store.state.isMassage);
    const alert = computed(() => store.state.alert);
    
    const data = reactive({
      title: '',
      modal: false,
    });

    const albums = reactive({
      totalItems: 0,
      items: [],
      totalPages: 0,
      currentPage: 0,
    });

    const payload = reactive({
      page: 1,
      size: 10,
      title: ''
    });

    onMounted(() => {
      getAlbum()
    });

    const getAlbum = () => {
      let page = payload.page - 1;
      axiosWrapper.get(`/albums?page=${page}&size=${payload.size}&title=${payload.title}`)
      .then((response) => response.data)
      .then((data) => {
        if(data.code == 200){
          albums.totalItems = data.data.totalItems;
          albums.totalPages = data.data.totalPages;
          albums.currentPage = data.data.currentPage;
          albums.items = data.data.items;
        }
      })
      .catch((err) => {
        console.log(err.response);
      })
    };

    const add = async () => {
      const { value: title } = await Swal.fire({
        title: 'Form Album',
        input: 'text',
        inputLabel: 'Title album',
        inputPlaceholder: 'Enter title album',
        confirmButtonText: `Save`,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Title album not be empty!'
          }else{
            axiosWrapper.post(`/albums`, {'title': title})
            .then(res => {
              let msg = '';
              let alert = '';
              if(res.data.code == 201 || res.data.status == 'SUCCESS'){
                msg = res.data.message;
                data.title = '';
                data.modal = false;
                alert = 'alert alert-info';
                getAlbum();
              }else{
                alert = 'alert alert-danger';
                msg = 'Create folder failed';
              }

              store.commit('setIsMessage', {status: true});
              store.commit('setMessage', {message: msg});
              store.commit('setAlert', {alert: alert});
            })
          }
        }
      })
    };

    const deleteAlbum = (item) => {
      Swal.fire({
        title: 'Do you want to delete this album?',
        text: 'Yes, all photos in the folder will be deleted!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Save`,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosWrapper.delete(`/albums/${item.id}/photo/${item.albumId}`)
          .then(res => {
            let msg = '';
            let alert = '';
            if(res.data.code == 201 || res.data.status == 'SUCCESS'){
              msg = res.data.message;
              data.title = '';
              data.modal = false;
              alert = 'alert alert-info';
              getAlbum();
            }else{
              alert = 'alert alert-danger';
              msg = 'Deleted folder failed';
            }

            store.commit('setIsMessage', {status: true});
            store.commit('setMessage', {message: msg});
            store.commit('setAlert', {alert: alert});
          })
        }
      });
    };  
    
    watch(payload, getAlbum);
    
    return {
      auth, albums, payload, ...toRefs(data), add, deleteAlbum, isMsg, message, alert
    }
  }
}

</script>