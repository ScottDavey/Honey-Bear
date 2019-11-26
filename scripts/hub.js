/***************************************************
 *****  HUB: Basically the level select screen  *****
 ***************************************************/

class Hub {
    constructor(isFirstVisit, info = {}) {
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.isFirstVisit = isFirstVisit; // If this is the player's first visit, display a message or dialog, introducing them
        this.info = info;
        this.selectedLevel = undefined;
        this.isLeftMouseLocked = false;

        // Temporary HUB Stuff
        this.bg = new Texture(
            new Vector2(0, 0),
            new Vector2(this.width, this.height),
            "#050505",
            1,
            "#050505"
        );

        this.centerLine = new Line(
            new Vector2(this.width / 2, 0),
            new Vector2(this.width / 2, this.height),
            "#444444"
        );

        this.levels = [];
        // this.levels.push(new Texture(new Vector2(175, 350), new Vector2(300, 275), '000000', 1, '#222222'));
        // this.levels.push(new Texture(new Vector2(485, 350), new Vector2(300, 275), '000000', 1, '#222222'));
        // this.levels.push(new Texture(new Vector2(795, 350), new Vector2(300, 275), '000000', 1, '#222222'));
        this.levels.push(
            new Texture(
                new Vector2(CANVAS_WIDTH / 2 - 470, 350),
                new Vector2(300, 275),
                "000000",
                1,
                "#A98307"
            )
        );
        this.levels.push(
            new Texture(
                new Vector2(CANVAS_WIDTH / 2 - 150, 350),
                new Vector2(300, 275),
                "000000",
                1,
                "#A98307"
            )
        );
        this.levels.push(
            new Texture(
                new Vector2(CANVAS_WIDTH / 2 + 170, 350),
                new Vector2(300, 275),
                "000000",
                1,
                "#A98307"
            )
        );
    }

    GetSelectedLevel() {
        return this.selectedLevel;
    }

    Update() {
        const mouseCoords = Input.Mouse.OnMouseMove.GetPosition();
        const mouseX = mouseCoords.x;
        const mouseY = mouseCoords.y;

        for (let l = 0; l < this.levels.length; l++) {
            const level = this.levels[l];
            if (
                mouseX < level.rect.right &&
                mouseX > level.rect.left &&
                mouseY < level.rect.bottom &&
                mouseY > level.rect.top
            ) {
                level.SetBorder("#f6e000");
                if (Input.Mouse.GetButton(Input.Mouse.LEFT)) {
                    if (!this.isLeftMouseLocked) {
                        this.isLeftMouseLocked = true;
                        this.selectedLevel = l;
                    }
                } else {
                    this.isLeftMouseLocked = false;
                }
            } else {
                level.SetBorder("#A98307");
            }
        }
    }

    Draw() {
        this.bg.Draw();

        // this.centerLine.Draw();

        DrawText(
            "HUB",
            this.width / 2 - 97,
            210,
            'bold 66pt "Josefin Sans", "Century Gothic", Verdana',
            "#f6e000 "
        );
        DrawText(
            "Welcome. Please select a level",
            this.width / 2 - 225,
            290,
            'normal 24pt Quicksand, "Century Gothic", Verdana',
            "#222222"
        );

        for (let l = 0; l < this.levels.length; l++) {
            this.levels[l].Draw();
        }
    }
}
