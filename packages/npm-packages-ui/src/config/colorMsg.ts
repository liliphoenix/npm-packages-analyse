interface FloorColor {
    bgColor: string,
    borderColor: string
}
interface svgColorStrut {
    [propName: string] : FloorColor
}
export const svgColor: svgColorStrut = {
    "floor_1": {
        bgColor: "lightblue",
        borderColor: "blue"
    },
    "floor_2": {
        bgColor: "lightseagreen",
        borderColor: "green"
    },
    "floor_3": {
        bgColor: "lightgoldenrodyellow",
        borderColor: "yellow"
    },
    "floor_4": {
        bgColor: "lightsalmon",
        borderColor: "salmon"
    },
    "floor_5": {
        bgColor: "lightgreen",
        borderColor: "green"
    },
    "floor_6": {
        bgColor: "lightgray",
        borderColor: "gray"
    },
    "floor_7": {
        bgColor: "#00ffd8",
        borderColor: "green"
    },
    "floor_8": {
        bgColor: "#e0ff00",
        borderColor: "yellow"
    },
    "floor_9": {
        bgColor: "#7200ff",
        borderColor: "blue"
    },
    "floor_10": {
        bgColor: "lightpink",
        borderColor: "pink"
    },
}