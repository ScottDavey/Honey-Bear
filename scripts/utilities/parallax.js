/*************************************************************************************
 *****  PARALLAX: Allows multiple background layers to scroll at different rates  *****
 *************************************************************************************/

class Parallax {
    constructor(bgImgs) {
        this.bgImgs = bgImgs;
        this.backgrounds = [];

        this.LoadBGs();
    }

    LoadBGs() {
        this.backgrounds = this.bgImgs.map(bg => {
            return new Image(bg[0], bg[1], bg[2]);
        });
    }

    Update(cameraPos) {
        for (let b = 0; b < this.backgrounds.length; b++) {
            const bg = this.backgrounds[b];
            bg.Update(
                new Vector2(cameraPos.x * bg.size.x, cameraPos.y * bg.size.y)
            );
        }
    }

    Draw() {
        for (let b = 0; b < this.backgrounds.length; b++) {
            this.backgrounds[b].Draw();
        }
    }
}
