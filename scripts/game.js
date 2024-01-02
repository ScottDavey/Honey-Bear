/*********************************
*****  GAME: The Game Class  *****
*********************************/

class Game {

    constructor() {
        this.fpsText = new TextC(
            `FPS: ${FPS.GetFPS()}`,
            new Vector2(CANVAS_WIDTH / 2, 10),
            'Quicksand, Consolas',
            'normal',
            12,
            '#FFFFFF',
            'center'
        );
        this.state = undefined;
        this.intro = undefined;
        this.mainMenu = undefined;
        this.level = undefined;
        this.gameMenu = new GameMenu();
        this.isEscapeLocked = false;
        this.timeText = new TextC(
            `Time: 0:00`,
            new Vector2(CANVAS_WIDTH - 75, 10),
            'Jura, COnsolas, Verdanda',
            'normal',
            12,
            '#FFFFFF',
            'left'
        );
    }

    initialize() {
        this.state = GAME_STATES.PRIMARY.INTRO;
        this.intro = new Introduction();    
    };

    update() {
        const isPaused = this.gameMenu.GetIsPaused();
        const currentGameTime = GameTime.getCurrentGameTime();
        // Update our Game Time each frame
        GameTime.update();
        const elapsed = GameTime.getElapsed();  // currently unused

        this.fpsText.SetString(`FPS: ${FPS.GetFPS()}`);

        if (HAS_GAME_PAD) {
            Input.GamePad.Update();
        }

        // When we switch tabs the frame rate drops enough for the collision to stop working. We'll pause the game until the framerate comes back up
        if (FPS.GetFPS() > 30) {

            // Update Primary State first
            switch (this.state) {
                case GAME_STATES.PRIMARY.INTRO:
                    if (typeof this.intro === 'undefined') this.intro = new Introduction();
                    this.intro.Update();
                    // When the intro is finished, switch to main menu
                    if (this.intro.GetDone()) {
                        this.state = GAME_STATES.PRIMARY.MAIN_MENU;
                        this.intro = undefined;
                    }
                    break;
                case GAME_STATES.PRIMARY.MAIN_MENU:
                    if (typeof this.mainMenu === 'undefined') this.mainMenu = new MainMenu();
                    this.mainMenu.Update();
                    if (this.mainMenu.GetPlay()) {
                        this.state = GAME_STATES.PRIMARY.PLAYING;
                        this.mainMenu = undefined;
                    }
                    break;
                case GAME_STATES.PRIMARY.PLAYING:

                    if ((Input.Keys.GetKey(Input.Keys.ESCAPE) || Input.GamePad.START.pressed)) {
                        if (!this.isEscapeLocked) {
                            this.isEscapeLocked = true;
                            this.gameMenu.SetIsPaused(!isPaused);
                        }
                    } else {
                        this.isEscapeLocked = false;
                    }

                    if (!isPaused) {
                        if (typeof this.level === 'undefined') this.level = new Level();
                        this.level.Update();
                    }
                    break;
                case GAME_STATES.PRIMARY.OUTRO:
                    break;
            }

        }

        if (this.gameMenu.GetIsPaused()) {
            this.gameMenu.Update();
        }

    };

    draw() {
        let state;

        // Clear the screen for re-drawing
        CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Update Primary State first
        switch (this.state) {
            case GAME_STATES.PRIMARY.INTRO:
                if (typeof this.intro !== 'undefined') this.intro.Draw();
                state = 'INTRO';
                break;
            case GAME_STATES.PRIMARY.MAIN_MENU:
                if (typeof this.mainMenu !== 'undefined') this.mainMenu.Draw();
                state = 'MAIN_MENU';
                break;
            case GAME_STATES.PRIMARY.PLAYING:
                if (typeof this.level !== 'undefined') {
                    this.level.Draw();
                    this.timeText.SetString(`Time: ${SecondsToTime(this.level.GetTimer())}`);
                    this.timeText.Draw();
                }

                state = 'PLAYING';
                break;
            case GAME_STATES.PRIMARY.OUTRO:
                state = 'OUTRO';
                break;
        }

        if (this.gameMenu.GetIsPaused()) {
            this.gameMenu.Draw();
        }

        // FPS
        this.fpsText.Draw();

    };

}