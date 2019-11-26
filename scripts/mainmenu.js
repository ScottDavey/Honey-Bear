/*********************************
*****  GAME: The Game Class  *****
*********************************/

class MainMenu {

    constructor() {
        this.BG = new Image('images/HoneyBear_TitleScreen_1300x540.png', new Vector2(0, 0));
        this.transitionOut = undefined;
        this.isFadingOut = false;
        this.play = false;

        this.playButton = new Button(
            'PLAY',
            new Vector2(CANVAS_WIDTH - (CANVAS_WIDTH * 0.25), (CANVAS_HEIGHT / 2) + 50),
            { family: 'Montserrat-Regular', size: 40 },
            '#FFFFFF',
            '#F4C430',
            'transparent',
            'transparent'
        );

    }

    GetPlay() {
        return this.play;
    };

    Update() {
        const mouseMovePos = Input.Mouse.OnMouseMove.GetPosition();
        const currentGameTime = GameTime.getCurrentGameTime();

        this.playButton.Update(mouseMovePos);

        if (this.playButton.GetIsPushed()) {
            this.isFadingOut = true;
            if (!this.transitionOut) this.transitionOut = new Transition('0, 0, 0', 0.5, 'out');
        }

        // We've clicked PLAY. Now fade out before switching Game States
        if (this.isFadingOut) {

            this.transitionOut.update(currentGameTime);

            if (this.transitionOut.IsComplete()) this.play = true;

        }

    };

    Draw() {
        this.BG.Draw();
        this.playButton.Draw();
        if (this.isFadingOut) this.transitionOut.draw();
    };
}