/*********************************
*****  GAME: The Game Class  *****
*********************************/

class MainMenu {

    constructor() {
        this.BG = new Image('images/HoneyBear_TitleScreen_1300x540.png', new Vector2(0, 0));
        this.transitionOut = undefined;
        this.isFadingOut = false;
        this.play = false;

        this.selectedButtonIndex = 0;
        this.buttons = [];

        this.isDownInputLocked = false;
        this.isUpInputLocked = false;

        this.Initialize();

    }

    Initialize() {
        this.buttons = [
            {
                name: 'PLAY',
                button: new TextButton(
                    'PLAY',
                    new Vector2(CANVAS_WIDTH - (CANVAS_WIDTH * 0.25), (CANVAS_HEIGHT / 2) + 50),
                    { family: 'Raleway, "Century Gothic", sans-serif', size: 40, align: 'left' },
                    '#FFFFFF',
                    '#F4C430',
                    'transparent',
                    'transparent'
                )
            }
        ];
    }

    GetPlay() {
        return this.play;
    };

    HandleInput() {

        if (Input.Keys.GetKey(Input.Keys.DOWN) || Input.GamePad.DOWN.pressed) {
            if (!this.isDownInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex + 1 > this.buttons.length - 1 ? 0 : this.selectedButtonIndex + 1;
                
                this.buttons[this.selectedButtonIndex].button.SetIsSelected(false);
                this.buttons[nextSelectedIndex].button.SetIsSelected(true);
                
                this.isDownInputLocked = true;
            }
        } else {
            this.isDownInputLocked = false;
        }
        
        if (Input.Keys.GetKey(Input.Keys.UP) || Input.GamePad.UP.pressed) {
            if (!this.isUpInputLocked) {
                const nextSelectedIndex = this.selectedButtonIndex - 1 < 0 ? 0 : this.selectedButtonIndex - 1;
                
                this.buttons[this.selectedButtonIndex].button.SetIsSelected(false);
                this.buttons[nextSelectedIndex].button.SetIsSelected(true);
                
                this.isUpInputLocked = true;
            }
        } else {
            this.isUpInputLocked = false;
        }

    }

    Update() {
        const currentGameTime = GameTime.getCurrentGameTime();

        this.HandleInput();

        for (const button of this.buttons) {
            button.button.Update();

            if (button.button.IsPushed()) {
                if (button.name === 'PLAY') {
                    
                    this.isFadingOut = true;
                    
                    if (!this.transitionOut) {
                        this.transitionOut = new Transition('0, 0, 0', 0.5, 'out');
                    }

                }
            }
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
            button.button.Draw();
        }

        if (this.isFadingOut) {
            this.transitionOut.draw();
        }
    };
}