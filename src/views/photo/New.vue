<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-center">
          <div style="width: 30rem;">
            <div :class="alert" role="alert" v-if="isMsg" v-html="message"></div>
          </div>  
        </div>  
        <div class="d-flex justify-content-center">
          <div class="card" style="width: 30rem;">
            <div class="card-header">
              Form Photo
            </div>
            <div class="card-body">
              <form>
                <div class="mb-3">
                  <label for="formGroupExampleInput" class="form-label">Title :</label>
                  <input type="text" class="form-control" v-model="title" placeholder="e.g nostaligia">
                </div>
                <div class="mb-3">
                  <label for="formGroupExampleInput2" class="form-label">Url :</label>
                  <input type="text" class="form-control" v-model="url" placeholder="e.g https://via.placeholder.com/600/de79c7">
                </div>
                <div class="mb-3">
                  <label for="formGroupExampleInput2" class="form-label">Thumbnail Url :</label>
                  <input type="text" class="form-control" v-model="thumbnailUrl" placeholder="e.g https://via.placeholder.com/600/de79c7">
                </div>
              </form>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
              <button type="button" class="btn btn-primary" @click="save">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, reactive } from '@vue/reactivity';
import { useRoute } from "vue-router"
import { useStore } from "vuex";
import { axiosWrapper } from "../../helpers/axios_wrapper";
import { watch } from '@vue/runtime-core';

export default {
  setup(){
    const route = new useRoute();
    const store = new useStore();
    const id = route.params.id;
    const query = route.query;
    const message = computed(() => store.state.message);
    const isMsg = computed(() => store.state.isMassage);
    const alert = computed(() => store.state.alert);
    const payloadId = query.id || '';

    const payload = reactive({
      albumId: parseInt(query.albumId) || parseInt(id),
      title: query.title || '',
      url: query.url || '', 
      thumbnailUrl: query.thumbnailUrl || ''
    })

    const save = () => {
      let base;
      if(payloadId != ''){
        base = axiosWrapper.put(`/photos/${payloadId}`, payload)
      }else{
        base = axiosWrapper.post('/photos', payload)
      }
      
      base.then(res => {
        let msg = '';
        let alert = '';
        if(res.data.code == 201 || res.data.status == 'SUCCESS'){
          msg = res.data.message;
          alert = 'alert alert-info';
        }else{
          alert = 'alert alert-danger';
          msg = res.data.message;
        }

        store.commit('setIsMessage', {status: true});
        store.commit('setMessage', {message: msg});
        store.commit('setAlert', {alert: alert});
      })
    }


    return { ...toRefs(payload), save, message, isMsg, alert }
  }
}
</script>