/*********************************
*****  GAME: The Game Class  *****
*********************************/

class MainMenu {

    constructor() {
        this.BG = new Image('images/HoneyBear_TitleScreen_1300x540.png', new Vector2(0, 0));
        this.state = MAIN_MENU.MAIN;
        this.transitionOut = undefined;
        this.isFadingOut = false;
        this.play = false;

        this.selectedButtonIndex = 0;
        this.buttons = [];
        this.buttonFont = {
            family: 'Raleway, "Century Gothic", sans-serif',
            size: 30,
            align: 'left'
        };
        this.buttonDefaultColor = '#333333';
        this.buttonActiveColor = '#F4C430';
        this.buttonPositionX = 1020;
        this.buttonInitialPositionY = 340;
        this.buttonHeight = 40;

        this.isDownInputLocked = false;
        this.isUpInputLocked = false;
        this.isSelectButtonLocked = false;

        this.menuItemMoveSoundID = `menuitem_${random(10000, 90000)}`;
        this.menuPlaySoundID = `menuplay_${random(10000, 90000)}`;

        this.Initialize();

    }

    Initialize() {
        this.state = MAIN_MENU.MAIN;
        this.selectedButtonIndex = 0;
        this.buttons = [];
        this.play = false;
        this.transitionOut = undefined;

        SOUND_MANAGER.AddEffect(this.menuItemMoveSoundID, new Sound('sounds/effects/menu_item_move.ogg', 'SFX', false, null, false, 0.3, true));
        SOUND_MANAGER.AddEffect(this.menuPlaySoundID, new Sound('sounds/effects/menu_start.ogg', 'SFX', false, null, false, 0.3, true));

        this.buttons.push(
            {
                name: 'PLAY',
                obj: new TextButton(
                    'PLAY',
                    new Vector2(this.buttonPositionX, this.buttonInitialPositionY + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    this.buttonDefaultColor,
                    this.buttonActiveColor,
                    'transparent',
                    'transparent',
                    true
                )
            }
        );

        this.buttons.push(
            {
                name: 'OPTIONS',
                obj: new TextButton(
                    'OPTIONS',
                    new Vector2(this.buttonPositionX, this.buttonInitialPositionY + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    this.buttonDefaultColor,
                    this.buttonActiveColor,
                    'transparent',
                    'transparent',
                    false
                )
            },
        );
    }

    InitializeOptions() {
        const isMusicOn = SOUND_MANAGER.GetMusicOn() ? 'YES' : 'NO';
        const isSFXOn = SOUND_MANAGER.GetSFXOn() ? 'YES' : 'NO';
        this.state = MAIN_MENU.OPTIONS;
        this.selectedButtonIndex = 0;
        this.buttons = [];

        this.buttons.push(
            {
                name: 'MUSIC',
                obj: new TextButton(
                    `Music: ${isMusicOn}`,
                    new Vector2(this.buttonPositionX, this.buttonInitialPositionY + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    this.buttonDefaultColor,
                    this.buttonActiveColor,
                    'transparent',
                    'transparent',
                    true
                ),
            }
        );
        
        this.buttons.push(
            {
                name: 'SFX',
                obj: new TextButton(
                    `SFX: ${isSFXOn}`,
                    new Vector2(this.buttonPositionX, this.buttonInitialPositionY + ((this.buttons.length - 1) * this.buttonHeight)),
                    this.buttonFont,
                    this.buttonDefaultColor,
                    this.buttonActiveColor,
                    'transparent',
                    'transparent',
                    false
                ),
            }
        );

        this.InitializeBack();
    }

    InitializeBack() {
        const yPosition = this.buttonInitialPositionY + ((this.buttons.length - 1) * this.buttonHeight);
        // SUB STATES
        this.buttons.push(
            {
                name: 'BACK',
                obj: new TextButton(
                    'Back',
                    new Vector2(this.buttonPositionX, yPosition),
                    this.buttonFont,
                    this.buttonDefaultColor,
                    this.buttonActiveColor,
                    'transparent',
                    'transparent',
                    false
                ),
            }
        );
    }

    UnloadContent() {
        SOUND_MANAGER.RemoveEffect(this.menuItemMoveSoundID);
        SOUND_MANAGER.RemoveEffect(this.menuPlaySoundID);
    }

    GetPlay() {
        return this.play;
    };

    HandleInput() {

        if (INPUT.GetInput(KEY_BINDINGS.DOWN)) {
            if (!this.isDownInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex + 1 > this.buttons.length - 1 ? 0 : this.selectedButtonIndex + 1;
                this.buttons[this.selectedButtonIndex].obj.SetIsSelected(false);
                this.buttons[nextSelectedIndex].obj.SetIsSelected(true);
                
                this.selectedButtonIndex = nextSelectedIndex;
                this.isDownInputLocked = true;

                SOUND_MANAGER.PlayEffect(this.menuItemMoveSoundID);
            }
        } else {
            this.isDownInputLocked = false;
        }
        
        if (INPUT.GetInput(KEY_BINDINGS.UP)) {
            if (!this.isUpInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex - 1 < 0 ? this.buttons.length - 1 : this.selectedButtonIndex - 1;
                this.buttons[this.selectedButtonIndex].obj.SetIsSelected(false);
                this.buttons[nextSelectedIndex].obj.SetIsSelected(true);
                
                this.selectedButtonIndex = nextSelectedIndex;
                this.isUpInputLocked = true;

                SOUND_MANAGER.PlayEffect(this.menuItemMoveSoundID);
            }
        } else {
            this.isUpInputLocked = false;
        }

        // Check if any menu items have been selected
        if (INPUT.GetInput(KEY_BINDINGS.CONFIRM)) {
            if (!this.isSelectButtonLocked) {

                // Loop over buttons to see which one is selected
                for (const button of this.buttons) {

                    if (button.obj.GetIsSelected()) {

                        SOUND_MANAGER.PlayEffect(this.menuPlaySoundID);

                        if (button.name === 'PLAY') {
                            this.isFadingOut = true;

                            if (!this.transitionOut) {
                                this.transitionOut = new Transition('0, 0, 0', 0.5, 'out');
                            }
                        } else if (button.name === 'OPTIONS') {
                            this.InitializeOptions();
                        } else if (button.name === 'MUSIC') {
                            const isMusicOn = SOUND_MANAGER.GetMusicOn();
                            SOUND_MANAGER.SetMusicOn(!isMusicOn);
                            button.obj.SetText(`Music: ${SOUND_MANAGER.GetMusicOn() ? 'YES' : 'NO'}`);
                        } else if (button.name === 'SFX') {
                            const isSFXOn = SOUND_MANAGER.GetSFXOn();
                            SOUND_MANAGER.SetSFXOn(!isSFXOn);
                            button.obj.SetText(`SFX: ${SOUND_MANAGER.GetSFXOn() ? 'YES' : 'NO'}`);
                        } else if (button.name === 'BACK') {
                            this.Initialize();
                        }

                        break;

                    }

                }

                this.isSelectButtonLocked = true;
            }
        } else {
            this.isSelectButtonLocked = false;
        }

    }

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.HandleInput();

        for (const button of this.buttons) {
            button.obj.Update();
        }

        // We've clicked PLAY. Now fade out before switching Game States
        if (this.isFadingOut) {

            this.transitionOut.update(currentGameTime);

            if (this.transitionOut.IsComplete()) this.play = true;

        }

    };

    Draw() {
        this.BG.Draw();

        for (const button of this.buttons) {
            button.obj.Draw();
        }

        if (this.isFadingOut) {
            this.transitionOut.draw();
        }
    };
}