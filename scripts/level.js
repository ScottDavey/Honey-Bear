/***********************************
 *****  LEVEL: The Level Class  *****
 ***********************************/

class Level {
    constructor() {
        this.timer = 0;
        this.levelStartTime = 0;
        this.levelLoadTime = 5;
        this.state = GAME_STATES.LEVEL.SCENE;
        this.hub = new Hub(true);
        this.selectedLevel = 0;
        this.scene = undefined;
        this.sceneIsLoaded = false;
    }
}

Level.prototype.GetTimer = function () {
    return Math.floor(this.timer);
};

Level.prototype.Update = function () {
    const elapsed = GameTime.getElapsed();

    this.timer += elapsed;

    switch (this.state) {
        case GAME_STATES.LEVEL.HUB:
            if (!this.hub) this.hub = new Hub(false);
            this.hub.Update();
            this.selectedLevel = this.hub.GetSelectedLevel();
            if (!this.selectedLevel) {
                this.hub = undefined;
                this.state = GAME_STATES.LEVEL.SCENE;
            }
            break;
        case GAME_STATES.LEVEL.SCENE:

            // If the scene is undefined, initiate it and capture the level start time
            if (!this.scene) {
                this.scene = new Scene(this.selectedLevel);
                this.sceneIsLoaded = this.scene.LoadContent();
                this.levelStartTime = this.timer;
            }

            if (this.sceneIsLoaded) {
                this.scene.Update();
            }

            if (this.scene.isLevelComplete) {
                this.scene.UnloadContent();
                this.selectedLevel++;
                this.scene = undefined;

                this.levelStartTime = 0;
            }

            break;
        case GAME_STATES.LEVEL.BOSS:
            break;
    }
};

Level.prototype.Draw = function () {
    switch (this.state) {
        case GAME_STATES.LEVEL.HUB:
            if (this.hub) this.hub.Draw();
            break;
        case GAME_STATES.LEVEL.SCENE:
            if (this.scene) {
                this.scene.Draw();
            }
            break;
        case GAME_STATES.LEVEL.BOSS:
            break;
    }
};
