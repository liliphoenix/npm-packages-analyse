<template>
<!--    <div style="display: block">{{npmAnalyzeRes}}</div>-->
<!-- echarts -->
  <treemapDrillDown :packageData="npmAnalyzeRes"/>
<!--&lt;!&ndash; 方块方式 &ndash;&gt;-->
<!--    <div v-if="npmAnalyzeRes && String(npmAnalyzeRes) !== '{}'">-->
<!--      <drawRect-->
<!--              data-floor="1"-->
<!--              :width="width"-->
<!--              :height="100"-->
<!--              :detailData="dealDetailDate(svgColor['floor_'+1].bgColor, svgColor['floor_'+1].borderColor,-->
<!--              <string>npmAnalyzeRes!.name, <string>npmAnalyzeRes!.version)" />-->
<!--      <div class="child-box">-->
<!--          <div v-for="(msg, key) in npmAnalyzeRes!.dependencies" :key="key"-->
<!--               :data-test="msg!.dependencies.length"-->
<!--               :class="msg!.dependencies.length==0? 'setBlock':'setInline'">-->
<!--              <div style="display: inline-block">-->
<!--                <drawRect-->
<!--                        data-floor="2"-->
<!--                        :width="0"-->
<!--                        :height="100"-->
<!--                        :detailData="dealDetailDate(svgColor['floor_'+2].bgColor, svgColor['floor_'+2].borderColor,-->
<!--                        msg!.name, msg!.version)" />-->
<!--              </div>-->
<!--              <div v-if="msg!.dependencies.length>0" style="display: inline-block">-->
<!--                &lt;!&ndash;  属性floor 由于组件中floor今日便+1，所以这里就给2了 &ndash;&gt;-->
<!--                <renderMore :packageDate="msg!.dependencies" :colorObj="svgColor['floor_'+3]" :floor="3"/>-->
<!--              </div>-->
<!--          </div>-->
<!--      </div>-->
<!--    </div>-->

<!--  <RouterView />-->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import DrawRect from "@/components/drawRect.vue";
import {dealDetailDate} from "@/utils/formatDate";
import RenderMore from "@/components/renderMore.vue";
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
