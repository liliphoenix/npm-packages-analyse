<template>
    <div style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div id="tree-map" ref="chartDom"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import {
    TreemapChart
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {markRaw, onMounted, ref, toRaw, watch} from "vue";

echarts.use([TitleComponent, TooltipComponent, TreemapChart, CanvasRenderer]);

const props = defineProps<{
    packageData: NpmAnalyzeRes | undefined
}>()
const chartDom = ref<HTMLElement | null | undefined>()

let myChart: echarts.ECharts;
let option;
let timer: NodeJS.Timeout | null = null;
let data = {
    children: [] as TreeNode[]
} as TreeNode;
let packageData = {
    children: [] as TreeNode[]
} as TreeNode;
interface PackageVersion {
    [key: string]: Array<string>
}
let packageVersion = ref<PackageVersion>({})

interface TreeNode {
    name: string;
    version: string;
    circular: boolean;
    value?: number
    children?: TreeNode[];
}

watch(()=>props.packageData, (newVal) => {
    if(!newVal) {
        myChart.hideLoading();
        return
    }
    initData()
    dealPackageVersion(packageData.children)
    console.group("npm packages struct", packageData.children)
    console.table(JSON.parse(JSON.stringify(packageVersion.value)))
    // console.group("npm package duplicate version",markRaw(packageVersion.value))
})
onMounted(() => {
    myChart = echarts.init(chartDom.value);
    setCanvas()
    myChart.showLoading();
    // initData()
})

window.addEventListener("resize", (event) => {
    if(timer) clearTimeout(Number(timer));
    myChart.showLoading();
   timer = setTimeout(() => {
       setCanvas()
       myChart.hideLoading();
   }, 800)
})

function initData() {
    formatData(<NpmAnalyzeRes>props.packageData, packageData, 1)
    myChart.hideLoading();
    initEChart()
}

/**
 * 处理包的重复版本
 * */
function dealPackageVersion(packageData: TreeNode[] | undefined){
    if(!packageData) return
    let dataObj = packageVersion.value;
    for (const packagesMsg of packageData) {
        // console.log("packagesMsg", packagesMsg.name)
        if(!dataObj[packagesMsg.name]){
            dataObj![packagesMsg.name] = new Array<string>
            dataObj![packagesMsg.name].push(packagesMsg.version)
        }else {
            let existArr = dataObj![packagesMsg.name].filter(val => {
                return val === packagesMsg.version
            })
            if(existArr.length == 0) dataObj![packagesMsg.name].push(packagesMsg.version)
        }

        if(packagesMsg.children && packagesMsg.children?.length>0){
            dealPackageVersion(packagesMsg.children)
        }
    }
    packageVersion.value = dataObj;
}

/**
 * 整理数据格式
 * */
function formatData(source: NpmAnalyzeRes, target: TreeNode, size: number){
    // console.log(source.name, source.version, source.circular)
    if(!source){ return }
    let packageChildren = source.dependencies
    for (let key in packageChildren) {
        if(packageChildren[key].dependencies.length>0){
            let child = {
                name: packageChildren[key]!.name,
                version: packageChildren[key]!.version,
                circular: packageChildren[key]!.circular,
                value: size+Object.keys(packageChildren[key].dependencies).length,
                children:[]
            } as TreeNode;
            target.children?.push(child)

            formatData(packageChildren[key], child, size+Object.keys(packageChildren[key].dependencies).length)
        }else {
            let child = {
                name: packageChildren[key]!.name,
                version: packageChildren[key]!.version,
                circular: packageChildren[key]!.circular,
                value: size+Object.keys(packageChildren[key].dependencies).length,
            } as TreeNode;
            target.children?.push(child)
        }
    }
}

function setCanvas() {
    const width = (document.body.clientWidth || document.documentElement.clientWidth) * .9;
    const height = (document.documentElement.clientHeight) * .9;
    chartDom.value?.setAttribute("width", String(width))
    chartDom.value?.setAttribute("height", String(height))
    myChart.resize({
        width: width,
        height: height
    });
}
function initEChart() {
    const generalSize = 18
    const titleSize = 36
    myChart.setOption(
        (option = {
            title: {
                text: 'NPM PACKAGE ANALYSE',
                subtext: new Date().toLocaleString(),
                left: 'leafDepth',
                textStyle: {
                    fontSize: titleSize,
                },
                subtextStyle:{
                    fontSize: generalSize
                }
            },

            tooltip: {
                // trigger: "item",
                formatter: function (params:any) {
                    let hintData = [
                        `name: ${params.data.name}`,
                        `version: v${params.data.version}`,
                        `circular: ${params.data.circular}`,
                        `multi-version: ${(packageVersion.value[params.data.name]?.length > 2)}`,
                    ]
                    return hintData.join(',&nbsp;&nbsp;')
                },
                textStyle: {
                    fontSize: generalSize
                }
            },
            series: [
                {
                    name: props.packageData?.name +" v"+props.packageData?.version,
                    type: 'treemap',
                    visibleMin: 300,
                    labelLine:{
                        smooth: true
                    },
                    breadcrumb:{
                        height: 50,
                        // 常规
                        itemStyle:{
                            textStyle:{
                                fontSize: titleSize
                            }
                        },
                        // 鼠标悬停
                        emphasis:{
                            itemStyle:{
                                textStyle:{
                                    fontSize: titleSize
                                }
                            },
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            // position: 'insideTopLeft',
                            formatter: function (params:any) {
                                // console.log(params, 'parms', echarts.format)
                                let packageData = [
                                    `${params.data.name}`,
                                    `v${params.data.version}`,
                                    // `${params.data.circular}`,
                                ]
                                return packageData.join('\n\n')
                            },
                            // 设置文本位置
                            // rich: {
                            //     a: {
                            //         fontSize: 12,
                            //         color: '#fff',
                            //         position: 'top',
                            //     },
                            //     b: {
                            //         color: '#fff',
                            //         position: 'insideTopRight ',
                            //         lineHeight:10
                            //     }
                            // },
                            textStyle: {
                                fontSize: generalSize,
                                textAlign: "center",
                            }
                        },
                    },
                    nameTextStyle:{
                        fontSize: titleSize
                    },
                    // legend:{
                    //     textStyle: {
                    //         fontSize: generalSize
                    //     }
                    // },

                    // data: data.children,
                    data: packageData.children,
                    leafDepth: 2,
                    levels: [
                        {
                            itemStyle: {
                                borderColor: '#555',
                                borderWidth: 4,
                                gapWidth: 4,
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.6],
                            itemStyle: {
                                borderColorSaturation: 0.7,
                                gapWidth: 2,
                                borderWidth: 2
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5],
                            itemStyle: {
                                borderColorSaturation: 0.6,
                                gapWidth: 1
                            }
                        },
                        {
                            colorSaturation: [0.3, 0.5]
                        }
                    ]
                }
            ]
        })
    );
    option && myChart.setOption(option);
}

</script>

<style scoped>

</style>