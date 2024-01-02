/**********************************************
**************  GAME MENU CLASS  **************
**********************************************/

class GameMenu {

    constructor() {
        const center = new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.isPaused = false;
        this.state = GAME_MENU.MAIN;

        this.overlay = new Texture(
            new Vector2(0, 0),
            new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
            '#00000066',
            0,
            '#00000000'
        );
        const initialOptionYPos = 200;
        this.pausedText = new TextC(
            '> PAUSED <',
            new Vector2(center.x, initialOptionYPos),
            'Jura, Consolas, Verdana',
            'normal',
            70,
            '#FFFFFF',
            'center'
        );

        // MAIN STATE
        this.resumeButton = new TextButton(
            'Resume Game',
            new Vector2(center.x, initialOptionYPos + 60),
            {
                family: 'Raleway, sans-serif',
                size: 30,
                align: 'center'
            },
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );
        this.optionButton = new TextButton(
            'Options',
            new Vector2(center.x, initialOptionYPos + 95),
            {
                family: 'Raleway, sans-serif',
                size: 30,
                align: 'center'
            },
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );

        // OPTIONS STATE
        
        
        // SUB STATES
        this.backbutton = new TextButton(
            '<- BACK',
            new Vector2(center.x, initialOptionYPos + 60),
            {
                family: 'Raleway, sans-serif',
                size: 30,
                align: 'center',
            },
            '#FFFFFF',
            '#5831a0',
            '',
            ''
        );

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

                if (this.resumeButton.IsPushed()) {
                    this.SetIsPaused(false);
                }

                if (this.optionButton.IsPushed()) {
                    this.state = GAME_MENU.OPTIONS;
                }
                
                break;
            case GAME_MENU.OPTIONS:
                break;
            default:
                break;
        }

        // If we're deeper than MAIN state (sub-state)
        if (this.state > GAME_MENU.MAIN) {
            this.backbutton.Update();

            if (this.backbutton.IsPushed()) {
                this.state = GAME_MENU.MAIN;
            }
        }

    }

    Draw() {
        this.overlay.Draw();
        this.pausedText.Draw();

        switch (this.state) {
            case GAME_MENU.MAIN:
                this.resumeButton.Draw();
                this.optionButton.Draw();
                break;
            case GAME_MENU.OPTIONS:
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