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
        return new Vector2(this.x - vector, this.y - vector);
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

/***********************
***** FormatNumber *****
***********************/

function FormatNumber(n) {
    return parseFloat(n).toLocaleString();
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

class FPSClass {

    constructor() {
        this.fps = 0;
        this.startTime = 0;
        this.frameNumber = 0;
        this.lowestFrameRate = 500;
        this.highestFrameRate = 0;
    }

    Update() {
        const d = new Date().getTime();
        const currentTime = (d - this.startTime) / 1000;
        
        this.frameNumber++;
        this.fps = +(this.frameNumber / currentTime).toFixed(2);

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }

        if (this.fps < this.lowestFrameRate && this.fps > 0) {
            this.lowestFrameRate = this.fps;
        }

        if (this.fps > this.highestFrameRate && this.fps < 500) {
            this.highestFrameRate = this.fps;
        }
    }

    GetFPS() {
        return this.fps;
    }

    GetLowestFPS() {
        return this.lowestFrameRate;
    }

    GetHighestFPS() {
        return this.highestFrameRate;
    }

}

/**************************
***** GAME TIME CLASS *****
**************************/
const GameTime = {
    startTime: new Date().getTime() / 1000,
    elapsed: 0,
    lastUpdate: 0,
    totalGameTime: 0,
    getElapsed() {
        return this.elapsed;
    },
    getLastUpdate() {
        return this.lastUpdate;
    },
    getTotalGameTime() {
        return this.totalGameTime;
    },
    getCurrentGameTime() {
        return new Date().getTime() / 1000;
    },
    update() {
        const curTime = this.getCurrentGameTime();
        this.elapsed = curTime - this.lastUpdate;
        this.totalGameTime = curTime - this.startTime;
        this.lastUpdate = curTime;
    }
}

/**************************
***** DRAW TEXT CLASS *****
**************************/
class Timer {
    constructor(startTime, duration) {
        this.startTime = startTime;
        this.duration = duration;
    }

    GetRemainder(precision = 0) {
        const currentGameTime = GameTime.getCurrentGameTime();

        return +((this.duration - (currentGameTime - this.startTime)).toFixed(precision));
    }

    IsComplete() {
        const currentGameTime = GameTime.getCurrentGameTime();

        return (currentGameTime - this.startTime >= this.duration);
    }
}