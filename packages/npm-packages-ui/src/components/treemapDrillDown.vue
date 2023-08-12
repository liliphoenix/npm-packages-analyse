<template>
    <div style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div id="tree-map" ref="chartDom"></div>
    </div>
</template>

<script setup lang="ts">
import {testData} from "@/config/testData"
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import {
    TreemapChart
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {onMounted, ref, watch} from "vue";
// import {TitleComponentOption, TooltipComponentOption, TreemapSeriesOption} from "echarts";
// type EChartsOption = echarts.ComposeOption<
//     TitleComponentOption | TooltipComponentOption | TreemapSeriesOption
// >;

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
let testPackageData = {
    children: [] as TreeNodeTest[]
} as TreeNodeTest;

// type RawNode = {
//     [key: string]: RawNode;
// } & {
//     $count: number;
// };
interface TreeNode {
    name: string;
    value: number;
    children?: TreeNode[];
}

interface TreeNodeTest {
    name: string;
    version: string;
    circular: boolean;
    value?: number
    children?: TreeNodeTest[];
}

watch(()=>props.packageData, (newVal) => {
    if(!newVal) {
        myChart.hideLoading();
        return
    }
    initData()
    console.group("npm packages struct", testPackageData.children)
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
    // const rawData:any = testData;
    // convert(rawData, data, '');
    formatData(<NpmAnalyzeRes>props.packageData, testPackageData, 1)
    myChart.hideLoading();
    initEChart()
}

let num = ref<number>(0)

/**
 * 整理数据格式
 * @param
 * */
function formatData(source: NpmAnalyzeRes, target: TreeNodeTest, size: number){
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
            } as TreeNodeTest;
            target.children?.push(child)

            formatData(packageChildren[key], child, size+Object.keys(packageChildren[key].dependencies).length)
        }else {
            let child = {
                name: packageChildren[key]!.name,
                version: packageChildren[key]!.version,
                circular: packageChildren[key]!.circular,
                value: size+Object.keys(packageChildren[key].dependencies).length,
            } as TreeNodeTest;
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
function convert(source: any, target: TreeNode, basePath: string) {
    for (let key in source) {
        let path = basePath ? basePath + '.' + key : key;
        if (!key.match(/^\$/)) {
            target.children = target.children || [];
            const child = {
                name: path
            } as TreeNode;
            target.children.push(child);
            convert(source[key], child, path);
        }
    }

    if (!target.children) {
        target.value = source.$count || 1;
    } else {
        target.children.push({
            name: basePath,
            value: source.$count
        });
    }
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
                                    `${params.data.circular}`,
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
                    data: testPackageData.children,
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