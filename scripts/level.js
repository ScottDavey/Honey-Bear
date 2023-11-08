/************************************
 *****  LEVEL: The Level Class  *****
 ***********************************/

class Level {
    constructor() {
        this.timer = 0;
        this.levelStartTime = 0;
        this.levelLoadTime = 5;
        this.state = GAME_STATES.LEVEL.SCENE;
        this.selectedLevel = 0;
        this.scene = undefined;
        this.sceneIsLoaded = false;
    }

    GetTimer() {
        return Math.floor(this.timer);
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        this.timer += elapsed;

        switch (this.state) {
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

                if (this.scene.IsPlayerDead()) {
                    this.scene = undefined;
                    this.scene = new Scene(this.selectedLevel);
                    this.sceneIsLoaded = this.scene.LoadContent();
                    this.levelStartTime = 0;
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
    }

    Draw() {
        switch (this.state) {
            case GAME_STATES.LEVEL.SCENE:
                if (this.scene) {
                    this.scene.Draw();
                }
                break;
            case GAME_STATES.LEVEL.BOSS:
                break;
        }
    }
}
