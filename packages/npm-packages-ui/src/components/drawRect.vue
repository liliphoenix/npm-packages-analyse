<template>
    <div class="rectangle-container" style="background-color: detailData">
        <svg ref="svgDom"></svg>
    </div>
</template>


<script setup lang="ts">
import * as d3 from "d3"
import {onMounted} from "vue";
import {ref} from "vue";
    const props = defineProps<{
        width: number,
        height: number,
        detailData: DetailData
    }>()
    const svgDom = ref<string>();

    onMounted(()=>{
        drawRectangle(props.width, props.height, props.detailData)
    })

    /**
     * 绘制svg长方形
     * @param {number} width
     * @param {number} height
     * @param {DetailData} detailData
     * * */
    function drawRectangle(width: number, height: number, detailData: DetailData) {
        width = !width? 200:width;
        height = !height? 60:height;
        const radius = 10;
        const bgColor = detailData && detailData.bgColor? detailData.bgColor:"lightblue";
        const borderColor = detailData && detailData.borderColor? detailData.borderColor:"blue";
        const nameText = detailData && detailData.packageName? detailData.packageName:"PACKAGES";
        const versionText = detailData && detailData.packageVersion? 'v'+detailData.packageVersion: nameText==="PACKAGES"?null:"v1.0.0";

        const svg = d3.select(svgDom.value!)
            .attr("width", width)
            .attr("height", height);

        svg.append("rect")
            .attr("x", 2)
            .attr("y", 2)
            .attr("width", width - 5)
            .attr("height", height - 5)
            .attr("rx", radius)
            .attr("ry", radius)
            .style("fill", bgColor)
            .style("stroke", borderColor);

        if(!versionText){
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2 + 2)
                // .attr("y", "52.5%")
                .attr("text-anchor", "middle")
                .attr("font-size", "18px")
                .attr("dominant-baseline", "middle")
                .style("fill", "black")
                .text(nameText);
        }else {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2 - 10)
                // .attr("y", "47%")
                .attr("text-anchor", "middle")
                .attr("font-size", "18px")
                .attr("dominant-baseline", "middle")
                .style("fill", "black")
                .text(nameText);
        }

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2 + 15)
            // .attr("y", "59%")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("dominant-baseline", "middle")
            .style("fill", "black")
            .text(versionText);
    }
</script>

<style scoped>
.rectangle-container {
    height: 100%;
    border: 1px salmon solid;
    display: inline-flex;
    justify-content: flex-start;
    /*align-items: center;*/
    /*min-height: 100vh;*/
}
</style>