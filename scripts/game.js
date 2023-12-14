/*********************************
*****  GAME: The Game Class  *****
*********************************/

class Game {

    constructor() {
        this.fpsText = new Text(`FPS: ${FPS.GetFPS()}`, (CANVAS_WIDTH / 2 - 50), 20, 'normal 10pt Quicksand, Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.state = undefined;
        this.intro = undefined;
        this.mainMenu = undefined;
        this.level = undefined;
        this.gameMenu = undefined;
        this.isPaused = false;
        this.pausedText = new Text('PAUSED', CANVAS_WIDTH / 2 - 170, CANVAS_HEIGHT / 2 + 20, 'normal 75pt Consolas, Trebuchet MS, Verdana', '#FFFFFF');
        this.pausedOverlay = undefined;
        this.isEscapeLocked = false;
        this.escapeLockStart = 0;
        this.timeText = new Text(`Time: 0:00`, CANVAS_WIDTH - 100, 20, 'normal 12pt Consolas, Jura, "Trebuchet MS", Verdana', '#FFFFFF');
    }

    initialize() {
        this.state = GAME_STATES.PRIMARY.INTRO;
        this.intro = new Introduction();    
    };

    update() {
        const currentGameTime = GameTime.getCurrentGameTime();
        // Update our Game Time each frame
        GameTime.update();
        const elapsed = GameTime.getElapsed();  // currently unused

        this.fpsText.UpdateString(`FPS: ${FPS.GetFPS()}`);

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

                    // Remove locks after 0.5 seconds
                    if (this.isEscapeLocked && (currentGameTime - this.escapeLockStart) >= 0.5) this.isEscapeLocked = false;

                    if (!this.isEscapeLocked && (Input.Keys.GetKey(Input.Keys.ESCAPE) || Input.GamePad.START.pressed)) {
                        this.isPaused = (this.isPaused) ? false : true;
                        if (!this.pausedOverlay) this.pausedOverlay = new Texture(new Vector2(0, 0), new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT), 'rgba(0, 0, 0, 0.7)', 1, 'black');
                        this.isEscapeLocked = true;
                        this.escapeLockStart = currentGameTime;
                    }

                    if (!this.isPaused) {
                        if (typeof this.level === 'undefined') this.level = new Level();
                        this.level.Update();
                    }
                    break;
                case GAME_STATES.PRIMARY.OUTRO:
                    break;
            }

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
                    this.timeText.UpdateString(`Time: ${SecondsToTime(this.level.GetTimer())}`);
                    this.timeText.Draw();
                }

                state = 'PLAYING';
                break;
            case GAME_STATES.PRIMARY.OUTRO:
                state = 'OUTRO';
                break;
        }

        if (this.isPaused) {
            this.pausedOverlay.Draw()
            this.pausedText.Draw();
        }

        // FPS
        this.fpsText.Draw();

    };

}