<template>
<!--    <div style="display: block">{{npmAnalyseRes}}</div>-->
<!-- 方块方式 -->
    <div v-if="npmAnalyseRes && String(npmAnalyseRes) !== '{}'">
      <drawRect
              data-floor="1"
              :width="width"
              :height="100"
              :detailData="dealDetailDate(svgColor['floor_'+1].bgColor, svgColor['floor_'+1].borderColor,
              <string>npmAnalyseRes!.name, <string>npmAnalyseRes!.version)" />
      <div class="child-box">
          <div v-for="(msg, key) in npmAnalyseRes!.dependencies" :key="key"
               :data-test="msg!.dependencies.length"
               :class="msg!.dependencies.length==0? 'setBlock':'setInline'">
              <div style="display: inline-block">
                <drawRect
                        data-floor="2"
                        :width="0"
                        :height="100"
                        :detailData="dealDetailDate(svgColor['floor_'+2].bgColor, svgColor['floor_'+2].borderColor,
                        msg!.name, msg!.version)" />
              </div>
              <div v-if="msg!.dependencies.length>0" style="display: inline-block">
                <!--  属性floor 由于组件中floor今日便+1，所以这里就给2了 -->
                <renderMore :packageDate="msg!.dependencies" :colorObj="svgColor['floor_'+3]" :floor="3"/>
              </div>
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
import {dealDetailDate} from "@/utils/formatDate";
import RenderMore from "@/components/renderMore.vue";
import {svgColor} from "@/config/colorMsg";

const width = ref<Number>(0);
let npmAnalyseRes = ref<NpmAnalyseRes>()

dealWidth()

onBeforeMount(() =>{
  getNpmAnalyseRes()
})

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
.setInline{
    display: flex;
}
.setBlock{
    display: block;
}
</style>
