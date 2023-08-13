<template>
    <div v-for="(msg, key) in props.packageDate" :key="key"  :class="msg!.dependencies.length==0? 'setBlock':'setInline'">
        <div>
            <drawRect
                :data-floor="newFloor - 1"
                :width="0"
                :height="100"
                :detailData="dealDetailDate(colorObj.bgColor, colorObj.borderColor, msg!.name, msg!.version)" />
        </div>
        <div v-if="msg!.dependencies.length>0">
            <renderMore :packageDate="msg!.dependencies" :colorObj="svgColor['floor_'+newFloor]" :floor="newFloor"/>
<!--            <renderMore :packageDate="msg!.dependencies"/>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import DrawRect from "@/components/drawRect.vue";
import {dealDetailDate} from "@/utils/formatDate";
import {svgColor} from "@/config/colorMsg";
import {onBeforeMount, ref, watch} from "vue";

const props = defineProps<{
    packageDate:Array<NpmAnalyzeRes>
    colorObj: {bgColor: string, borderColor: string}
    floor: number
}>()

// let newFloor = ref<number>(props.floor)
let newFloor = 0;

watch(()=>props.floor, (newVal, _) => {
    newFloor = newVal;

}, { immediate: true })

floorAddOne()

function floorAddOne() {
    newFloor++
}
</script>

<style scoped>
.setInline{
    display: flex;
    /*flex-wrap:wrap;*/
}
.setBlock{
    display: block;
}
</style>