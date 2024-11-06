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
        this.levelName = STAGES[this.selectedLevel].levelName;
        this.selectedLevelText = new Text(
            `LEVEL ${this.selectedLevel + 1} - ${this.levelName}`,
            new Vector2(10, 28),
            'Jura, "Century Gothic", sans-serif',
            'normal',
            14,
            '#FFFFFF',
            'left'
        );
        this.playerHealth = 0;
    }

    GetTimer() {
        return Math.floor(this.timer);
    }

    UnloadContent() {
        if (this.scene) {
            this.scene.UnloadContent();
        }
    }

    Update() {
        const elapsed = GameTime.getElapsed();

        this.timer += elapsed;

        switch (this.state) {
            case GAME_STATES.LEVEL.SCENE:

                // If the scene is undefined, initiate it and capture the level start time
                if (!this.scene) {
                    this.scene = new Scene(this.selectedLevel);
                    this.sceneIsLoaded = this.scene.LoadContent(this.playerHealth);
                    this.levelStartTime = this.timer;
                }

                if (this.sceneIsLoaded) {
                    this.scene.Update();
                    SOUND_MANAGER.SetPlayerPosition(this.scene.GetPlayerPosition());
                }

                if (this.scene.isLevelComplete) {
                    this.playerHealth = this.scene.GetPlayerHealth();
                    this.scene.UnloadContent();
                    this.selectedLevel = this.selectedLevel + 1 || 0;
                    this.selectedLevelText.SetString(`LEVEL ${this.selectedLevel + 1} - ${STAGES[this.selectedLevel].levelName}`);
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
                    this.selectedLevelText.Draw();
                }
                break;
            case GAME_STATES.LEVEL.BOSS:
                break;
        }
    }
}
