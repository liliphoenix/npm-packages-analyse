<template>
<!--    <div style="display: block">{{npmAnalyseRes}}</div>-->
    <div v-if="npmAnalyseRes && String(npmAnalyseRes) !== '{}'">
      <drawRect :width="width" :height="100" :detailData="dealDetailDate('', '', <string>npmAnalyseRes!.name, <string>npmAnalyseRes!.version)" />
      <div class="child-box">
          <div v-for="(msg, key) in npmAnalyseRes!.dependencies" :key="key">
              <drawRect :width="0" :height="100" :detailData="dealDetailDate('', '', msg!.name, msg!.version)" />
          </div>
      </div>
    </div>

<!--  <RouterView />-->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import DrawRect from "@/components/drawRect.vue";

const width = ref<Number>(0);
let npmAnalyseRes = ref<NpmAnalyseRes>()

dealWidth()

onBeforeMount(() =>{
  getNpmAnalyseRes()
})

const dealDetailDate = (bgColor:string, borderColor:string, packageName:string, packageVersion:string) => {
    let packageData:DetailData = {
        bgColor,
        borderColor,
        packageName,
        packageVersion
    }
    return packageData
}

function dealWidth(){
    width.value = document.querySelector("#app")!.clientWidth;
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
.child-box{
    display: flex;
    justify-content: space-between;
}
</style>
