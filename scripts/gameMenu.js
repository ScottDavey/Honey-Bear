/**********************************************
**************  GAME MENU CLASS  **************
**********************************************/

class GameMenu {

    constructor() {
        this.center = new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.isPaused = false;
        this.state = undefined;
        this.numberOfElements = 0;
        this.pauseTextYPos = 175;
        this.initialOptionYPos = this.pauseTextYPos + 100;
        this.buttonHeight = 40;

        this.buttonFont = {
            family: 'Raleway, sans-serif',
            size: 30,
            align: 'center'
        };

        this.resumeButton = undefined;
        this.optionButton = undefined;
        this.toggleMusicButton = undefined;
        this.toggleSFXButton = undefined;
        this.backbutton = undefined;

        this.buttons = [];

        this.overlay = new Texture(
            new Vector2(0, 0),
            new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
            '#00000066',
            0,
            '#00000000'
        );
        this.pausedText = new Text(
            'PAUSED',
            new Vector2(this.center.x, 175),
            'Jura, Consolas, "Century Gothic", sans-serif',
            'normal',
            70,
            '#FFFFFF',
            'center'
        );

        this.InitializeMain();
    }

    SetState(state) {
        this.state = state;
    }

    GetState() {
        return this.state;
    }

    InitializeMain() {
        this.state = GAME_MENU.MAIN;

        this.buttons = [
            {
                name: 'RESUME',
                obj: new TextButton(
                    'Resume Game',
                    new Vector2(this.center.x, this.initialOptionYPos + (1 * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            },
            {
                name: 'OPTIONS',
                obj: new TextButton(
                    'Options',
                    new Vector2(this.center.x, this.initialOptionYPos + (2 * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            },
            {
                name: 'EXIT',
                obj: new TextButton(
                    'Exit',
                    new Vector2(this.center.x, this.initialOptionYPos + (3 * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            },
        ];
    }

    InitializeOptions() {
        this.state = GAME_MENU.OPTIONS;
        const isMusicOn = IS_MUSIC_ON ? 'Yes' : 'No';
        const isSFXOn = IS_SFX_ON ? 'Yes' : 'No';

        this.buttons = [
            {
                name: 'MUSIC',
                obj: new TextButton(
                    `Music: ${isMusicOn}`,
                    new Vector2(this.center.x, this.initialOptionYPos + (1 * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ),
            },
            {
                name: 'SFX',
                obj: new TextButton(
                    `SFX: ${isSFXOn}`,
                    new Vector2(this.center.x, this.initialOptionYPos + (2 * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ),
            },
        ];

        this.InitializeBack();
    }

    InitializeBack() {
        const yPosition = this.initialOptionYPos + (this.buttons.length + 1 * this.buttonHeight);
        // SUB STATES
        this.buttons.push(
            {
                name: 'BACK',
                obj: new TextButton(
                    'Back',
                    new Vector2(this.center.x, yPosition),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ),
            }
        );
    }

    SetIsPaused(isPaused) {
        this.isPaused = isPaused;
    }

    GetIsPaused() {
        return this.isPaused;
    }

    Update() {

        for (const button of this.buttons) {
            button.obj.Update();

            if (button.obj.IsPushed()) {

                const isConfirmKeyLocked = ();

                // MAIN
                if (button.name === 'RESUME') {
                    this.SetIsPaused(false);
                } else if (button.name === 'OPTIONS') {
                    this.InitializeOptions();
                } else if (button.name === 'EXIT') {
                    this.state === GAME_MENU.EXIT;
                }
                
                // OPTIONS
                if (button.name === 'MUSIC') {
                    if (this.) {

                    }
                } else {

                }

            }
        }


        switch (this.state) {
            case GAME_MENU.MAIN:
                this.resumeButton.Update();
                this.optionButton.Update();
                this.exitButton.Update();

                if (this.resumeButton.IsPushed()) {
                    this.SetIsPaused(false);
                }

                if (this.optionButton.IsPushed()) {
                    this.InitializeOptions();
                }

                if (this.exitButton.IsPushed()) {
                    this.state = GAME_MENU.EXIT;
                }
                
                break;
            case GAME_MENU.OPTIONS:
                this.toggleMusicButton.Update();
                this.toggleSFXButton.Update();

                if (this.toggleMusicButton.IsPushed()) {
                    if (!this.toggleMusicButton.GetIsLeftClickLocked()) {
                        this.toggleMusicButton.SetIsLeftClickLocked(true);
                        IS_MUSIC_ON = !IS_MUSIC_ON;
                        this.toggleMusicButton.SetText(`Music: ${IS_MUSIC_ON ? 'YES' : 'NO'}`);
                    }
                } else {
                    this.toggleMusicButton.SetIsLeftClickLocked(false);
                }

                if (this.toggleSFXButton.IsPushed()) {
                    if (!this.toggleSFXButton.GetIsLeftClickLocked()) {
                        this.toggleSFXButton.SetIsLeftClickLocked(true);
                        IS_SFX_ON = !IS_SFX_ON;
                        this.toggleSFXButton.SetText(`SFX: ${IS_SFX_ON ? 'YES' : 'NO'}`);
                    }
                } else {
                    this.toggleSFXButton.SetIsLeftClickLocked(false);
                }
                break;
            default:
                break;
        }

        // If we're deeper than MAIN state (sub-state)
        if (this.state > GAME_MENU.MAIN) {
            this.backbutton.Update();

            if (this.backbutton.IsPushed()) {
                this.InitializeMain();
            }
        }

        DEBUG.Update('MUSIC', `Music ON: ${IS_MUSIC_ON ? 'YES' : 'NO'}`);
        DEBUG.Update('SFX', `SFX ON: ${IS_SFX_ON ? 'YES' : 'NO'}`);

    }

    Draw() {
        this.overlay.Draw();
        this.pausedText.Draw();

        switch (this.state) {
            case GAME_MENU.MAIN:
                this.resumeButton.Draw();
                this.optionButton.Draw();
                this.exitButton.Draw();
                break;
            case GAME_MENU.OPTIONS:
                this.toggleMusicButton.Draw();
                this.toggleSFXButton.Draw();
                break;
            default:
                break;
        }

        // If we're deeper than MAIN state (sub-state)
        if (this.state > GAME_MENU.MAIN) {
            this.backbutton.Draw();
        }
    }
}