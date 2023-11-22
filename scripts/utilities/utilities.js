/************************
***** Vector2 CLASS *****
************************/

class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector, this.y + vector);
    }

    subtract(vector) {

    }

    subtract(vector) {
        return new Vector2(this.x - vector, this.y - vector);
    }

    multiply(vector) {
        return new Vector2(this.x * vector, this.y * vector);
    }

}

/**********************************
***** RANDOM NUMBER GENERATOR *****
**********************************/

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**********************************
***** CONVERT SECONDS TO TIME *****
**********************************/

function SecondsToTime(s) {
    s = Number(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor(s % 3600 / 60);
    const sec = Math.floor(s % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (sec < 10 ? "0" : "") + sec);
}

/************************************************
***** CLAMP GIVEN VALUE BETWEEN MIN and MAX *****
************************************************/
function Clamp(value, min, max) {
    return (value < min) ? min : ((value > max) ? max : value);
}

/********************
***** FPS CLASS *****
********************/

const fps = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function () {
        var d, currentTime, result;
        this.frameNumber++;
        d = new Date().getTime();
        currentTime = (d - this.startTime) / 1000;
        result = (this.frameNumber / currentTime).toFixed(2);

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }

        return result;
    }
};

/**************************
***** GAME TIME CLASS *****
**************************/

const GameTime = {
    startTime: new Date().getTime() / 1000,
    elapsed: 0,
    lastUpdate: 0,
    totalGameTime: 0,
    getElapsed: function () {
        return GameTime.elapsed;
    },
    getLastUpdate: function () {
        return GameTime.lastUpdate;
    },
    getTotalGameTime: function () {
        return GameTime.totalGameTime;
    },
    getCurrentGameTime: function () {
        return new Date().getTime() / 1000;
    },
    update: function () {
        var curTime;
        curTime = GameTime.getCurrentGameTime();
        GameTime.elapsed = curTime - GameTime.lastUpdate;
        GameTime.totalGameTime = curTime - GameTime.startTime;
        GameTime.lastUpdate = curTime;
    }
};

/**************************
***** DRAW TEXT CLASS *****
**************************/
class Text {
    constructor (string, x, y, font, color) {
        this.string = string;
        this.position = new Vector2(x, y);
        this.font = font;
        this.color = color;
    }

    GetString() {
        return this.string;
    }

    UpdatePos(pos) {
        this.position = pos;
    }

    UpdateColor(color) {
        this.color = color;
    }

    UpdateString(string) {
        this.string = string;
    }
    
    Draw() {
        CONTEXT.save();
        CONTEXT.font = this.font;
        CONTEXT.fillStyle = this.color;
        CONTEXT.fillText(this.string, this.position.x, this.position.y);
        CONTEXT.textBaseline = 'middle';
        CONTEXT.textAlign = "center";
        CONTEXT.restore();
    }
};

const CenterText = function (string, fontSize, containerSize) {

    const x = (containerSize.x / 2) - ((string.length * fontSize * 0.75) / 2);
    const y = (containerSize.y / 2) + (fontSize / 2);
    return new Vector2(x, y);

}