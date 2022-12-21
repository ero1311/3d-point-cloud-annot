export const config = {
    host: "127.0.0.1",
    inter_port: 5000,
    labels: [
        {
            label: "wall",
            id: 1,
            color: [
                174,
                199,
                232
            ]
        },
        {
            label: "floor",
            id: 2,
            color: [
                152,
                223,
                138
            ]
        },
        {
            label: "cabinet",
            id: 3,
            color: [
                31,
                119,
                180
            ]
        },
        {
            label: "bed",
            id: 4,
            color: [
                255,
                187,
                120
            ]
        },
        {
            label: "chair",
            id: 5,
            color: [
                188,
                189,
                34
            ]
        },
        {
            label: "sofa",
            id: 6,
            color: [
                140,
                86,
                75
            ]
        },
        {
            label: "table",
            id: 7,
            color: [
                255,
                152,
                150
            ]
        },
        {
            label: "door",
            id: 8,
            color: [
                214,
                39,
                40
            ]
        },
        {
            label: "window",
            id: 9,
            color: [
                197,
                176,
                213
            ]
        },
        {
            label: "bookshelf",
            id: 10,
            color: [
                148,
                103,
                189
            ]
        },
        {
            label: "picture",
            id: 11,
            color: [
                196,
                156,
                148
            ]
        },
        {
            label: "counter",
            id: 12,
            color: [
                23,
                190,
                207
            ]
        },
        {
            label: "desk",
            id: 13,
            color: [
                247,
                182,
                210
            ]
        },
        {
            label: "curtain",
            id: 14,
            color: [
                219,
                219,
                141
            ]
        },
        {
            label: "refrigerator",
            id: 15,
            color: [
                255,
                127,
                14
            ]
        },
        {
            label: "shower curtain",
            id: 16,
            color: [
                158,
                218,
                229
            ]
        },
        {
            label: "toilet",
            id: 17,
            color: [
                44,
                160,
                44
            ]
        },
        {
            label: "sink",
            id: 18,
            color: [
                112,
                128,
                144
            ]
        },
        {
            label: "bathtub",
            id: 19,
            color: [
                227,
                119,
                194
            ]
        },
        {
            label: "otherprop",
            id: 20,
            color: [
                82,
                84,
                163
            ]
        }
    ],
    scenes: ['scene0237_01', 'scene0042_01', 'scene0116_00', 'scene0183_00', 'scene0003_01', 'scene0080_02', 'scene0332_00', 'scene0103_01', 'scene0337_01', 'scene0192_00', 'scene0150_02', 'scene0332_01', 'scene0371_00', 'scene0078_01', 'scene0260_00']
}

export const colorList = config.labels.map((item) => {
    let r, g, b
    [r, g, b] = item.color
    r = r / 255
    b = b / 255
    g = g / 255

    return [r, g, b]
})