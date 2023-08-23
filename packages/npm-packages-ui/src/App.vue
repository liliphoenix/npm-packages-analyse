<template>
<!-- echarts -->
  <treemapDrillDown :packageData="npmAnalyzeRes"/>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import {dealDetailDate} from "@/utils/formatDate";
import {svgColor} from "@/config/colorMsg";
import TreemapDrillDown from "@/components/treemapDrillDown.vue";

const width = ref<Number>(0);
let npmAnalyzeRes = ref<NpmAnalyzeRes>()

dealWidth()

onBeforeMount(() =>{
    console.warn("字节青训营 - 鹰隼小队 - npm packages 分析工具")
    getNpmAnalyzeRes()
})

function dealWidth(){
    width.value = document.querySelector("#app")!.clientWidth;
}

function getNpmAnalyzeRes() {
    fetch("/getNpmAnalyzeRes")
        .then(response => response.json())
        .then(data => {
            // 使用返回的数据
            // console.info("This is analyze res：",data.analyzeRes)
            if (data.analyzeRes) {
                npmAnalyzeRes.value = data.analyzeRes;
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
.setInline{
    display: flex;
}
.setBlock{
    display: block;
}
</style>
