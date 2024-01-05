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

        this.activeButton = undefined;

        this.overlay = new Texture(
            new Vector2(0, 0),
            new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
            '#00000066',
            0,
            '#00000000'
        );
        this.pausedText = new TextC(
            'PAUSED',
            new Vector2(this.center.x, 175),
            'Jura, Consolas, Verdana',
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
        this.numberOfElements = 0;
        this.DeInitializeBack();

        this.resumeButton = new TextButton(
            'Resume Game',
            new Vector2(this.center.x, this.initialOptionYPos + (this.numberOfElements * this.buttonHeight)),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.numberOfElements++;

        this.optionButton = new TextButton(
            'Options',
            new Vector2(this.center.x, this.initialOptionYPos + (this.numberOfElements * this.buttonHeight)),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.numberOfElements++;

        this.exitButton = new TextButton(
            'Exit',
            new Vector2(this.center.x, this.initialOptionYPos + (this.numberOfElements * this.buttonHeight)),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.numberOfElements++;
    }

    DeinitializeMain() {
        this.resumeButton = undefined;
        this.optionButton = undefined;
        this.exitButton = undefined;
    }

    InitializeOptions() {
        this.state = GAME_MENU.OPTIONS;
        this.numberOfElements = 0;
        
        const isMusicOn = IS_MUSIC_ON ? 'Yes' : 'No';
        this.toggleMusicButton = new TextButton(
            `Music: ${isMusicOn}`,
            new Vector2(this.center.x, this.initialOptionYPos + (this.numberOfElements * this.buttonHeight)),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.numberOfElements++;
        
        const isSFXOn = IS_SFX_ON ? 'Yes' : 'No';
        this.toggleSFXButton = new TextButton(
            `SFX: ${isSFXOn}`,
            new Vector2(this.center.x, this.initialOptionYPos + (this.numberOfElements * this.buttonHeight)),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.numberOfElements++;

        this.InitializeBack();
    }

    DeinitializeOptions() {

    }

    InitializeBack() {
        const yPosition = this.initialOptionYPos + (this.numberOfElements * this.buttonHeight);
        // SUB STATES
        this.backbutton = new TextButton(
            'Back',
            new Vector2(this.center.x, yPosition),
            this.buttonFont,
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
    }

    DeInitializeBack() {
        this.backbutton = undefined;
    }

    SetIsPaused(isPaused) {
        this.isPaused = isPaused;
    }

    GetIsPaused() {
        return this.isPaused;
    }

    Update() {

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