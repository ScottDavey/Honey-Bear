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

        this.selectedButtonIndex = 0;
        this.isConfirmInputLocked = false;
        this.isDownInputLocked = false;
        this.isUpInputLocked = false;

        this.overlay = new Texture(
            new Vector2(0, 0),
            new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
            '#00000099',
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
        this.selectedButtonIndex = 0;
        this.buttons = [];

        this.buttons.push(
            {
                name: 'RESUME',
                obj: new TextButton(
                    'Resume Game',
                    new Vector2(this.center.x, this.initialOptionYPos + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            }
        );
        
        this.buttons.push(
            {
                name: 'OPTIONS',
                obj: new TextButton(
                    'Options',
                    new Vector2(this.center.x, this.initialOptionYPos + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            }
        );

        this.buttons.push(
            {
                name: 'EXIT',
                obj: new TextButton(
                    'Exit',
                    new Vector2(this.center.x, this.initialOptionYPos + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ), 
            }
        );

        this.buttons[0].obj.SetIsSelected(true);
    }

    InitializeOptions() {
        this.state = GAME_MENU.OPTIONS;
        this.selectedButtonIndex = 0;
        this.buttons = [];
        const isMusicOn = SOUND_MANAGER.GetMusicOn() ? 'Yes' : 'No';
        const isSFXOn = SOUND_MANAGER.GetSFXOn() ? 'Yes' : 'No';

        this.buttons.push(
            {
                name: 'MUSIC',
                obj: new TextButton(
                    `Music: ${isMusicOn}`,
                    new Vector2(this.center.x, this.initialOptionYPos + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ),
            }
        );
        
        this.buttons.push(
            {
                name: 'SFX',
                obj: new TextButton(
                    `SFX: ${isSFXOn}`,
                    new Vector2(this.center.x, this.initialOptionYPos + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    '#FFFFFF',
                    '#5831a0',
                    '',
                    ''
                ),
            }
        );

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
        
        if (this.isPaused) {
            this.InitializeMain();
        }
    }

    GetIsPaused() {
        return this.isPaused;
    }

    HandleInput() {

        if (INPUT.GetInput(KEY_BINDINGS.DOWN)) {
            if (!this.isDownInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex + 1 > this.buttons.length - 1 ? 0 : this.selectedButtonIndex + 1;
                this.buttons[this.selectedButtonIndex].obj.SetIsSelected(false);
                this.buttons[nextSelectedIndex].obj.SetIsSelected(true);
                
                this.selectedButtonIndex = nextSelectedIndex;
                this.isDownInputLocked = true;
            }
        } else {
            this.isDownInputLocked = false;
        }
        
        if (INPUT.GetInput(KEY_BINDINGS.UP)) {
            if (!this.isUpInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex - 1 < 0 ? 0 : this.selectedButtonIndex - 1;
                this.buttons[this.selectedButtonIndex].obj.SetIsSelected(false);
                this.buttons[nextSelectedIndex].obj.SetIsSelected(true);
                
                this.selectedButtonIndex = nextSelectedIndex;
                this.isUpInputLocked = true;
            }
        } else {
            this.isUpInputLocked = false;
        }

    }

    Update() {

        this.HandleInput();

        for (const button of this.buttons) {
            button.obj.Update();

            if (button.obj.IsPushed()) {

                if (!this.isConfirmInputLocked) {
                    this.isConfirmInputLocked = true;

                     // MAIN
                    if (button.name === 'RESUME') {
                        this.SetIsPaused(false);
                    } else if (button.name === 'OPTIONS') {
                        this.InitializeOptions();
                    } else if (button.name === 'EXIT') {
                        this.state = GAME_MENU.EXIT;
                    }
                    
                    // OPTIONS
                    if (button.name === 'MUSIC') {
                        const isMusicOn = SOUND_MANAGER.GetMusicOn();
                        SOUND_MANAGER.SetMusicOn(!isMusicOn);
                        button.obj.SetText(`Music: ${isMusicOn ? 'YES' : 'NO'}`);
                    } else if (button.name === 'SFX') {
                        const isSFXOn = SOUND_MANAGER.GetSFXOn();
                        SOUND_MANAGER.SetSFXOn(!isSFXOn);
                        button.obj.SetText(`SFX: ${isSFXOn ? 'YES' : 'NO'}`);
                    }

                    // BACK
                    if (button.name === 'BACK') {
                        this.InitializeMain();
                    }
                    
                } else {
                    this.isConfirmInputLocked = false;
                }

            }

        }

        INPUT.ClearInputs();

    }

    Draw() {
        this.overlay.Draw();
        this.pausedText.Draw();

        for (const button of this.buttons) {
            button.obj.Draw();
        }
    }
}