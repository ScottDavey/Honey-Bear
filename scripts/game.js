/*********************************
*****  GAME: The Game Class  *****
*********************************/

class Game {

    constructor() {
        this.state = undefined;
        this.intro = undefined;
        this.mainMenu = undefined;
        this.level = undefined;
        this.gameMenu = new GameMenu();
        this.isEscapeLocked = false;
        this.debugKeyLocked = false;
    }

    initialize() {
        this.state = GAME_STATES.PRIMARY.INTRO;
        this.intro = new Introduction();
        SOUND_MANAGER.Initialize(this.state);
    };

    update() {
        const isPaused = this.gameMenu.GetIsPaused();
        // Update our Game Time each frame
        GameTime.update();

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

            if (this.gameMenu.GetState() === GAME_MENU.EXIT) {
                this.state = GAME_STATES.PRIMARY.MAIN_MENU;
                this.level.UnloadContent();
                this.level = undefined;
                this.gameMenu.SetIsPaused(false);
                this.gameMenu.SetState(GAME_MENU.MAIN);
            }
        }

        if (Input.Keys.GetKey(Input.Keys.CONTROL) || Input.GamePad.BACK.pressed) {
            if (!this.debugKeyLocked) {
                this.debugKeyLocked = true;
                DEBUG.SetShowDebug();
            }
        } else {
            this.debugKeyLocked = false;
        }

        DEBUG.Update('FPS', `FPS: ${FPS.GetFPS()}`);

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
                    DEBUG.Update('TIME', `Time: ${SecondsToTime(this.level.GetTimer())}`);
                }

                state = 'PLAYING';
                break;
            case GAME_STATES.PRIMARY.OUTRO:
                state = 'OUTRO';
                break;
        }

        // Put Music Song Name on screen
        SOUND_MANAGER.Draw();

        if (this.gameMenu.GetIsPaused()) {
            this.gameMenu.Draw();
        }

        // DEBUG
        DEBUG.Draw();

    };

}