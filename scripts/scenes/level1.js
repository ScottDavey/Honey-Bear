
const stages = [
    {
        worldWidth: 7680,
        worldHeight: 648,
        introText: `
Your name is Honey Bear and you have run out of honey.
You must get more.
        `,
        player: {
            // start: new Vector2(326, 590),
            start: new Vector2(326, 300),
            size: new Vector2(40, 65)
        },
        backgrounds: [
            ["images/backgrounds/jungle/BG0.png", new Vector2(-200, 0), new Vector2(0.9, 0.9)],
            ["images/backgrounds/jungle/BG1.png", new Vector2(-200, 0), new Vector2(0.7, 0.7)],
            ["images/backgrounds/jungle/BG2.png", new Vector2(-200, 0), new Vector2(0.5, 0.5)],
            ["images/backgrounds/jungle/BG3.png", new Vector2(-200, 0), new Vector2(0.3, 0.3)],
            ["images/backgrounds/jungle/BG4.png", new Vector2(-200, 0), new Vector2(0, 0)]
        ],
        enemies: [
            { start: new Vector2(150, 80), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(4225, 143), size: new Vector2(50, 68), region: { pos: new Vector2(4000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(7100, 720), size: new Vector2(50, 68), region: { pos: new Vector2(7000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(7100, 100), size: new Vector2(50, 68), region: { pos: new Vector2(7000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(3500, 100), size: new Vector2(50, 68), region: { pos: new Vector2(3000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(4500, 100), size: new Vector2(50, 68), region: { pos: new Vector2(4000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(4600, 100), size: new Vector2(50, 68), region: { pos: new Vector2(4000, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(750, 100), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(120, 100), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(1000, 1000) } },
            { start: new Vector2(350, 100), size: new Vector2(50, 68), region: { pos: new Vector2(0, 0), size: new Vector2(1000, 1000) } },
        ],
        eventCollision: {
            exit: { pos: new Vector2(7480, 0), size: new Vector2(300, 720) }
        },
        collision: [
            { "sx": 97, "sy": 106, "ex": 282, "ey": 387, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },
            { "sx": 3, "sy": 295, "ex": 97, "ey": 108, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },
            { "sx": 257, "sy": 352, "ex": 257, "ey": 669, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },
            { "sx": 1, "sy": 674, "ex": 258, "ey": 670, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },
            { "sx": 258, "sy": 670, "ex": 1136, "ey": 644, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },
            { "sx": 1136, "sy": 644, "ex": 1554, "ey": 569, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 1 },
            { "sx": 1554, "sy": 569, "ex": 2018, "ey": 430, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 1 },
            { "sx": 2018, "sy": 430, "ex": 2391, "ey": 276, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 4, "ry": 0 },
            { "sx": 2391, "sy": 276, "ex": 2584, "ey": 200, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 4, "ry": 0 },
            { "sx": 2584, "sy": 200, "ex": 2759, "ey": 147, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 5, "ry": 0 },
            { "sx": 2759, "sy": 147, "ex": 2980, "ey": 111, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 5, "ry": 0 },
            { "sx": 2980, "sy": 111, "ex": 3083, "ey": 123, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 5, "ry": 0 },
            { "sx": 3083, "sy": 123, "ex": 3083, "ey": 309, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 6, "ry": 0 },
            { "sx": 2891, "sy": 326, "ex": 3083, "ey": 309, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 5, "ry": 0 },
            { "sx": 2891, "sy": 257, "ex": 2891, "ey": 326, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 5, "ry": 0 },
            { "sx": 2739, "sy": 234, "ex": 2891, "ey": 257, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 5, "ry": 0 },
            { "sx": 2616, "sy": 261, "ex": 2739, "ey": 234, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 5, "ry": 0 },
            { "sx": 2492, "sy": 331, "ex": 2616, "ey": 261, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 4, "ry": 0 },
            { "sx": 2493, "sy": 332, "ex": 2493, "ey": 449, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 4, "ry": 0 },
            { "sx": 2493, "sy": 449, "ex": 2602, "ey": 512, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 4, "ry": 0 },
            { "sx": 2602, "sy": 512, "ex": 2841, "ey": 527, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 5, "ry": 1 },
            { "sx": 2841, "sy": 527, "ex": 3059, "ey": 490, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 5, "ry": 1 },
            { "sx": 3059, "sy": 490, "ex": 3252, "ey": 425, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 6, "ry": 0 },
            { "sx": 3252, "sy": 425, "ex": 3417, "ey": 406, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 6, "ry": 0 },
            { "sx": 3417, "sy": 406, "ex": 3591, "ey": 434, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 6, "ry": 0 },
            { "sx": 3591, "sy": 434, "ex": 3808, "ey": 505, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 7, "ry": 0 },
            { "sx": 3808, "sy": 505, "ex": 3968, "ey": 575, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 7, "ry": 1 },
            { "sx": 3968, "sy": 575, "ex": 4174, "ey": 617, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 7, "ry": 1 },
            { "sx": 4174, "sy": 617, "ex": 4409, "ey": 617, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 1 },
            { "sx": 4409, "sy": 617, "ex": 4672, "ey": 585, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 1 },
            { "sx": 4672, "sy": 585, "ex": 4872, "ey": 553, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 9, "ry": 1 },
            { "sx": 4872, "sy": 553, "ex": 4938, "ey": 543, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 9, "ry": 1 },
            { "sx": 4938, "sy": 543, "ex": 4990, "ey": 543, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 9, "ry": 1 },
            { "sx": 4990, "sy": 543, "ex": 5034, "ey": 567, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 9, "ry": 1 },
            { "sx": 5034, "sy": 567, "ex": 5074, "ey": 584, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 10, "ry": 1 },
            { "sx": 5074, "sy": 584, "ex": 5356, "ey": 614, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 10, "ry": 1 },
            { "sx": 5356, "sy": 614, "ex": 5706, "ey": 608, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 10, "ry": 1 },
            { "sx": 5706, "sy": 608, "ex": 6023, "ey": 553, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 11, "ry": 1 },
            { "sx": 6023, "sy": 553, "ex": 6248, "ey": 556, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 12, "ry": 1 },
            { "sx": 6248, "sy": 556, "ex": 6509, "ey": 543, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 12, "ry": 1 },
            { "sx": 6509, "sy": 543, "ex": 6776, "ey": 505, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 13, "ry": 1 },
            { "sx": 6776, "sy": 505, "ex": 7025, "ey": 456, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 13, "ry": 1 },
            { "sx": 7025, "sy": 456, "ex": 7298, "ey": 472, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 14, "ry": 0 },
            { "sx": 7298, "sy": 472, "ex": 7559, "ey": 527, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 14, "ry": 0 },
            { "sx": 7559, "sy": 527, "ex": 7680, "ey": 528, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 15, "ry": 1 },
            { "sx": 7680, "sy": 19, "ex": 7680, "ey": 528, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 15, "ry": 0 },
            { "sx": 3709, "sy": 241, "ex": 3871, "ey": 230, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 7, "ry": 0 },
            { "sx": 3871, "sy": 230, "ex": 4000, "ey": 195, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 7, "ry": 0 },
            { "sx": 4000, "sy": 195, "ex": 4157, "ey": 145, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 0 },
            { "sx": 4157, "sy": 145, "ex": 4294, "ey": 147, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 0 },
            { "sx": 4294, "sy": 147, "ex": 4461, "ey": 194, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 0 },
            { "sx": 4461, "sy": 194, "ex": 4546, "ey": 231, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 8, "ry": 0 },
            { "sx": 4546, "sy": 231, "ex": 4657, "ey": 247, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 9, "ry": 0 },
            { "sx": 4657, "sy": 247, "ex": 4657, "ey": 292, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 9, "ry": 0 },
            { "sx": 3711, "sy": 243, "ex": 3711, "ey": 313, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 7, "ry": 0 },
            { "sx": 3711, "sy": 313, "ex": 3891, "ey": 305, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 7, "ry": 0 },
            { "sx": 3891, "sy": 305, "ex": 4078, "ey": 278, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 7, "ry": 0 },
            { "sx": 4078, "sy": 278, "ex": 4216, "ey": 297, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 8, "ry": 0 },
            { "sx": 4216, "sy": 297, "ex": 4216, "ey": 344, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 8, "ry": 0 },
            { "sx": 4216, "sy": 344, "ex": 4306, "ey": 390, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 8, "ry": 0 },
            { "sx": 4306, "sy": 390, "ex": 4420, "ey": 411, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 8, "ry": 0 },
            { "sx": 4420, "sy": 411, "ex": 4595, "ey": 386, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 8, "ry": 0 },
            { "sx": 4596, "sy": 386, "ex": 4658, "ey": 293, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 9, "ry": 0 },
            { "sx": 6146, "sy": 383, "ex": 6275, "ey": 382, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 12, "ry": 0 },
            { "sx": 6275, "sy": 303, "ex": 6275, "ey": 382, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 12, "ry": 0 },
            { "sx": 6275, "sy": 303, "ex": 6393, "ey": 302, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 12, "ry": 0 },
            { "sx": 6393, "sy": 212, "ex": 6393, "ey": 302, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 12, "ry": 0 },
            { "sx": 6393, "sy": 212, "ex": 6505, "ey": 212, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 12, "ry": 0 },
            { "sx": 6505, "sy": 116, "ex": 6505, "ey": 212, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 13, "ry": 0 },
            { "sx": 6505, "sy": 116, "ex": 6601, "ey": 102, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 13, "ry": 0 },
            { "sx": 6601, "sy": 102, "ex": 6822, "ey": 111, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 13, "ry": 0 },
            { "sx": 6822, "sy": 111, "ex": 6922, "ey": 151, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 13, "ry": 0 },
            { "sx": 6922, "sy": 153, "ex": 6922, "ey": 247, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 13, "ry": 0 },
            { "sx": 6574, "sy": 273, "ex": 6922, "ey": 247, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 13, "ry": 0 },
            { "sx": 6479, "sy": 318, "ex": 6574, "ey": 273, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 12, "ry": 0 },
            { "sx": 6381, "sy": 388, "ex": 6479, "ey": 318, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 12, "ry": 0 },
            { "sx": 6294, "sy": 418, "ex": 6381, "ey": 388, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 12, "ry": 0 },
            { "sx": 6149, "sy": 419, "ex": 6294, "ey": 418, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 12, "ry": 0 },
            { "sx": 6149, "sy": 384, "ex": 6149, "ey": 419, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 12, "ry": 0 }
        ]
    },
    {
        worldWidth: 2560,
        worldHeight: 1440,
        introText: `
This level has parralax ... parallax? ... scrolling. So.
        `,
        player: {
            start: new Vector2(300, 590),
            size: new Vector2(50, 68)
        },
        backgrounds: [
            ["images/Graveyard/moon.png", new Vector2(-200, 0), new Vector2(0.9, 0.9)],
            ["images/Graveyard/Background_3.png", new Vector2(-200, 0), new Vector2(0.7, 0.7)],
            ["images/Graveyard/Background_2.png", new Vector2(-200, 0), new Vector2(0.4, 0.5)],
            ["images/Graveyard/Background_1.png", new Vector2(-200, 0), new Vector2(0.3, 0.3)]
        ],
        eventCollision: {
            exit: { pos: new Vector2(300, 1400), size: new Vector2(2560, 300) }
        },
        collision: [
            { "sx": 0, "sy": 1352, "ex": 500, "ey": 1232, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 2 },
            { "sx": 500, "sy": 1232, "ex": 670, "ey": 1145, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 2 },
            { "sx": 670, "sy": 1145, "ex": 1000, "ey": 1002, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 2 },
            { "sx": 1000, "sy": 1002, "ex": 1354, "ey": 1001, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 2 },
            { "sx": 1354, "sy": 1001, "ex": 1500, "ey": 942, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 2 },
            { "sx": 1500, "sy": 942, "ex": 1500, "ey": 1022, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 3, "ry": 1 },
            { "sx": 2000, "sy": 775, "ex": 2000, "ey": 1061, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 4, "ry": 1 },
            { "sx": 2000, "sy": 775, "ex": 2499, "ey": 648, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 4, "ry": 1 },
            { "sx": 2499, "sy": 648, "ex": 2556, "ey": 648, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 4, "ry": 1 },
            { "sx": 117, "sy": 680, "ex": 650, "ey": 680, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },
            { "sx": 799, "sy": 680, "ex": 1381, "ey": 680, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 1 },
            { "sx": 1500, "sy": 680, "ex": 1930, "ey": 680, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 1 },
            { "sx": 1999, "sy": 317, "ex": 2345, "ey": 498, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 0 },
            { "sx": 1746, "sy": 308, "ex": 1999, "ey": 317, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 0 },
            { "sx": 1641, "sy": 280, "ex": 1746, "ey": 308, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 0 },
            { "sx": 1163, "sy": 280, "ex": 1641, "ey": 280, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 0 },
            { "sx": 1500, "sy": 1020, "ex": 1698, "ey": 1065, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 2 },
            { "sx": 1802, "sy": 1070, "ex": 2001, "ey": 1059, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 3, "ry": 2 },
            { "sx": 1697, "sy": 1066, "ex": 1697, "ey": 1440, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 3, "ry": 2 },
            { "sx": 1803, "sy": 1070, "ex": 1803, "ey": 1440, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 3, "ry": 2 },
            { "sx": 1501, "sy": 680, "ex": 1501, "ey": 739, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 3, "ry": 1 },
            { "sx": 799, "sy": 681, "ex": 799, "ey": 739, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 118, "sy": 681, "ex": 118, "ey": 739, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 0, "ry": 1 },
            { "sx": 649, "sy": 681, "ex": 649, "ey": 739, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 1380, "sy": 679, "ex": 1380, "ey": 739, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 2, "ry": 1 },
            { "sx": 1930, "sy": 681, "ex": 1930, "ey": 739, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 3, "ry": 1 },
            { "sx": 2345, "sy": 499, "ex": 2345, "ey": 556, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 4, "ry": 0 },
            { "sx": 1501, "sy": 739, "ex": 1929, "ey": 738, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 3, "ry": 1 },
            { "sx": 798, "sy": 739, "ex": 1379, "ey": 738, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 1 },
            { "sx": 118, "sy": 740, "ex": 649, "ey": 738, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 1 },
            { "sx": 730, "sy": 910, "ex": 842, "ey": 910, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 1 },
            { "sx": 634, "sy": 808, "ex": 731, "ey": 808, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 1 },
            { "sx": 730, "sy": 809, "ex": 730, "ey": 841, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 841, "sy": 910, "ex": 841, "ey": 948, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 635, "sy": 841, "ex": 730, "ey": 841, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 1 },
            { "sx": 731, "sy": 948, "ex": 841, "ey": 948, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 1 },
            { "sx": 633, "sy": 809, "ex": 633, "ey": 842, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 731, "sy": 909, "ex": 731, "ey": 948, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },
            { "sx": 736, "sy": 219, "ex": 1051, "ey": 219, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },
            { "sx": 94, "sy": 127, "ex": 549, "ey": 127, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },
            { "sx": 1051, "sy": 220, "ex": 1051, "ey": 427, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },
            { "sx": 1163, "sy": 280, "ex": 1163, "ey": 427, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },
            { "sx": 736, "sy": 220, "ex": 736, "ey": 427, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 0 },
            { "sx": 94, "sy": 128, "ex": 94, "ey": 427, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },
            { "sx": 94, "sy": 427, "ex": 548, "ey": 428, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 0 },
            { "sx": 737, "sy": 426, "ex": 1051, "ey": 427, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 0 },
            { "sx": 1164, "sy": 426, "ex": 2002, "ey": 426, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 2, "ry": 0 },
            { "sx": 2002, "sy": 426, "ex": 2344, "ey": 554, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 4, "ry": 0 },
            { "sx": 548, "sy": 126, "ex": 548, "ey": 224, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 0 },
            { "sx": 548, "sy": 366, "ex": 548, "ey": 428, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 0 },
            { "sx": 457, "sy": 223, "ex": 548, "ey": 223, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 0 },
            { "sx": 457, "sy": 367, "ex": 548, "ey": 367, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },
            { "sx": 457, "sy": 367, "ex": 457, "ey": 417, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },
            { "sx": 457, "sy": 141, "ex": 457, "ey": 223, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },
            { "sx": 106, "sy": 141, "ex": 457, "ey": 141, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 0 },
            { "sx": 106, "sy": 141, "ex": 106, "ey": 416, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },
            { "sx": 106, "sy": 416, "ex": 458, "ey": 417, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },
            { "sx": 2554, "sy": 4, "ex": 2554, "ey": 649, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 5, "ry": 0 },
            { "sx": 1, "sy": 4, "ex": 1, "ey": 1352, "c": "WALL", "n": "1 ", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 }
        ],
        // enemies: [[new Vector2(100, -50), 'normal'], [new Vector2(200, -50), 'normal'], [new Vector2(300, -50), 'normal'], [new Vector2(400, -50), 'normal']],
        enemies: [],
        clues: []
    },
    {
        worldWidth: 2560,
        worldHeight: 1440,
        player: {
            start: new Vector2(300, 200),
            size: new Vector2(50, 68)
        },
        backgrounds: [],
        enemies: [],
        eventCollision: {
            exit: { pos: new Vector2(7480, 0), size: new Vector2(300, 720) }
        },
        collision: [
            { "sx": 1, "sy": 388, "ex": 411, "ey": 371, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 411, "sy": 371, "ex": 631, "ey": 270, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 631, "sy": 270, "ex": 845, "ey": 270, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 845, "sy": 270, "ex": 845, "ey": 584, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 780, "sy": 584, "ex": 844, "ey": 584, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5" },
            { "sx": 780, "sy": 584, "ex": 780, "ey": 654, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 780, "sy": 654, "ex": 1048, "ey": 654, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1048, "sy": 566, "ex": 1048, "ey": 654, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30" },
            { "sx": 1048, "sy": 566, "ex": 1134, "ey": 566, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1134, "sy": 566, "ex": 1134, "ey": 655, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 1134, "sy": 655, "ex": 1451, "ey": 645, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1451, "sy": 645, "ex": 1584, "ey": 617, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1584, "sy": 617, "ex": 1743, "ey": 540, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1743, "sy": 540, "ex": 1814, "ey": 503, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1814, "sy": 503, "ex": 1927, "ey": 499, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1927, "sy": 499, "ex": 2560, "ey": 566, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 2559, "sy": 0, "ex": 2559, "ey": 567, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30" },
            { "sx": 2, "sy": 2, "ex": 2, "ey": 387, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 1701, "sy": 318, "ex": 1783, "ey": 379, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1369, "sy": 320, "ex": 1701, "ey": 318, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1266, "sy": 261, "ex": 1369, "ey": 320, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1101, "sy": 263, "ex": 1266, "ey": 261, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 879, "sy": 101, "ex": 1067, "ey": 99, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313" },
            { "sx": 1067, "sy": 98, "ex": 1067, "ey": 155, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 1782, "sy": 379, "ex": 1782, "ey": 402, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30" },
            { "sx": 1245, "sy": 401, "ex": 1782, "ey": 402, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5" },
            { "sx": 1245, "sy": 300, "ex": 1245, "ey": 401, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30" },
            { "sx": 1101, "sy": 293, "ex": 1245, "ey": 300, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5" },
            { "sx": 1100, "sy": 263, "ex": 1100, "ey": 294, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30" },
            { "sx": 879, "sy": 101, "ex": 879, "ey": 161, "c": "WALL", "n": "1", "s": "", "h": "#02AA30" },
            { "sx": 879, "sy": 161, "ex": 1066, "ey": 154, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5" }
        ],
        clues: []
    }
    /*,
    {
        worldWidth: 1500,
        worldHeight: 1000,
        playerStart: new Vector2(50, 50),
        backgrounds: [],
        collision: [{ "sx": 0, "sy": 1, "ex": 0, "ey": 709, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },{ "sx": 0, "sy": 709, "ex": 275, "ey": 736, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },{ "sx": 275, "sy": 736, "ex": 527, "ey": 788, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },{ "sx": 527, "sy": 788, "ex": 527, "ey": 842, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },{ "sx": 102, "sy": 841, "ex": 527, "ey": 842, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 1 },{ "sx": 102, "sy": 841, "ex": 102, "ey": 952, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 1 },{ "sx": 102, "sy": 952, "ex": 1315, "ey": 951, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 1 },{ "sx": 1315, "sy": 223, "ex": 1315, "ey": 951, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },{ "sx": 1315, "sy": 223, "ex": 1499, "ey": 224, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 0 },{ "sx": 1499, "sy": 6, "ex": 1499, "ey": 224, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },{ "sx": 1, "sy": 6, "ex": 1499, "ey": 6, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 0 },{ "sx": 675, "sy": 862, "ex": 675, "ey": 949, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },{ "sx": 676, "sy": 862, "ex": 741, "ey": 862, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 1 },{ "sx": 874, "sy": 756, "ex": 987, "ey": 756, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 1 },{ "sx": 1102, "sy": 596, "ex": 1172, "ey": 596, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 1 },{ "sx": 1218, "sy": 431, "ex": 1278, "ey": 431, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 0 },{ "sx": 740, "sy": 861, "ex": 740, "ey": 951, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },{ "sx": 80, "sy": 242, "ex": 505, "ey": 242, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 0, "ry": 0 },{ "sx": 505, "sy": 242, "ex": 560, "ey": 237, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 560, "sy": 237, "ex": 617, "ey": 223, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 617, "sy": 223, "ex": 693, "ey": 192, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 693, "sy": 192, "ex": 748, "ey": 154, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 748, "sy": 154, "ex": 798, "ey": 119, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 798, "sy": 119, "ex": 1138, "ey": 118, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 1, "ry": 0 },{ "sx": 1138, "sy": 118, "ex": 1187, "ey": 131, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 0 },{ "sx": 1187, "sy": 131, "ex": 1220, "ey": 148, "c": "FLOOR", "n": "-1", "s": "WOOD", "h": "#9F0313", "rx": 2, "ry": 0 },{ "sx": 1220, "sy": 148, "ex": 1220, "ey": 206, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },{ "sx": 804, "sy": 197, "ex": 1220, "ey": 206, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 0 },{ "sx": 554, "sy": 299, "ex": 804, "ey": 197, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 0 },{ "sx": 79, "sy": 298, "ex": 554, "ey": 299, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 0, "ry": 0 },{ "sx": 80, "sy": 242, "ex": 80, "ey": 298, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 0, "ry": 0 },{ "sx": 985, "sy": 756, "ex": 985, "ey": 863, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },{ "sx": 1171, "sy": 596, "ex": 1171, "ey": 863, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 2, "ry": 1 },{ "sx": 1277, "sy": 432, "ex": 1277, "ey": 863, "c": "WALL", "n": "1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },{ "sx": 874, "sy": 757, "ex": 874, "ey": 863, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 1, "ry": 1 },{ "sx": 1102, "sy": 596, "ex": 1102, "ey": 863, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 2, "ry": 1 },{ "sx": 1218, "sy": 432, "ex": 1218, "ey": 863, "c": "WALL", "n": "-1", "s": "", "h": "#02AA30", "rx": 2, "ry": 0 },{ "sx": 1218, "sy": 863, "ex": 1277, "ey": 864, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 2, "ry": 1 },{ "sx": 1103, "sy": 863, "ex": 1172, "ey": 864, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 2, "ry": 1 },{ "sx": 873, "sy": 863, "ex": 986, "ey": 864, "c": "CEILING", "n": "1", "s": "", "h": "#0E72D5", "rx": 1, "ry": 1  }],
        enemies: [],
        clues: []
    }
    */
];