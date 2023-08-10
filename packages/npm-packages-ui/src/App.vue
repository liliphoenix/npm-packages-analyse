<template>
<!--    <div style="display: block">{{npmAnalyseRes}}</div>-->
    <div id="app">
      <drawRect :width="width" :height="100" :detailData="detailData" />
      <div>

      </div>
    </div>

<!--  <RouterView />-->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {onMounted, reactive, ref} from "vue";
import DrawRect from "@/components/drawRect.vue";

const width = ref<Number>(0);
let npmAnalyseRes = ref({})

const detailData = reactive<DetailData>({
    bgColor: "",
    borderColor: "",
    packageName: "",
    packageVersion: ""
})

onMounted(() =>{
    getNpmAnalyseRes()
    dealWidth()
})

function dealWidth(){
    width.value = document.querySelector("#app")!.clientWidth;
    console.log(width.value)
}

function getNpmAnalyseRes() {
    fetch("/getNpmAnalyseRes")
        .then(response => response.json())
        .then(data => {
            // 使用返回的数据
            console.info("This is analyse res：",data.analyseRes)
            if (data.analyseRes) {
                npmAnalyseRes.value = data.analyseRes;
            }
        })
}

</script>

<style scoped>
#app{
    width: 80%;
    min-height: 100vh;
    margin: auto;
}
</style>
