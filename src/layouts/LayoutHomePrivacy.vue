<script setup>

import BasePopupTit from "@/components/BasePopupTit.vue";
import {getCurrentInstance, inject, onBeforeMount, ref} from "vue";
import BaseEditorViewer from "@/components/BaseEditorViewer.vue";
import BaseSelect from "@/components/BaseSelect.vue";

const terms_api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/terms/list/1";
const terms_contents_api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/terms/view/";
const axios = inject('$axios');
const termsList = ref();
const termsContents = ref();
const selectTerms = ref("");

const prefix = "LayoutHomePrivacy";
const props = defineProps({
  isPopupPrivacy: Boolean
})
const instance = getCurrentInstance();

function popupClose(){
  instance.emit("popupClose");
}

function contentsLoad() {
  termsContents.value = '';
  axios.get(terms_contents_api+selectTerms.value, {})
      .then(res2 => {
        termsContents.value = res2.data.data.terms_content;
      })
      .catch(error2 => {
        console.log(error2);
      });
}

onBeforeMount(() => {

  axios.get(terms_api, {})
      .then(res => {
        termsList.value = res.data.data;
        selectTerms.value = termsList.value[0].id;
        contentsLoad();
      })
      .catch(error => {
        console.log(error);
      });

})
</script>

<template>
  <base-popup-tit v-if="props.isPopupPrivacy" @popupClose="popupClose" class="LayoutHomeTermsPopup">
    <template v-slot:title>
      {{ $t('LayoutHome.link.privacy') }}
    </template>
    <template v-slot:contents>
      <div :class="prefix">

        <BaseEditorViewer v-if="termsContents" v-model="termsContents"/>

        <BaseSelect
          v-model="selectTerms"
          :options="(termsList || []).map(t => ({ label: `${t.terms_name} (${t.terms_reg_date})`, value: t.id }))"
          :placeholder="$t('CheckupPhysicalActivity.text22')"
          name="lht"
          @change="contentsLoad"
        />

      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped>

</style>