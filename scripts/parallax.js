/*************************************************************************************
 *****  PARALLAX: Allows multiple background layers to scroll at different rates  *****
 *************************************************************************************/

 class Parallax {
    constructor(bgImgs, worldWidth) {
        this.bgImgs = bgImgs;
        this.backgrounds = [];
        this.worldWidth = worldWidth;

        this.LoadBGs();
    }

    LoadBGs() {
        this.backgrounds = this.bgImgs.map(bg => {
            return new Background(
                bg.path,
                new Vector2(bg.pos[0], bg.pos[1]),
                new Vector2(bg.size[0], bg.size[1]),
                bg.isRepeating,
                new Vector2(bg.parallax[0], bg.parallax[1]),
                this.worldWidth
            );
        });
    }

    Update(cameraPos) {
        for (let b = 0; b < this.backgrounds.length; b++) {
            const bg = this.backgrounds[b];
            const parallaxMultiplier = bg.GetParallaxMultiplier();
            bg.Update(
                new Vector2(cameraPos.x, cameraPos.y),
                new Vector2(cameraPos.x * parallaxMultiplier.x, cameraPos.y * parallaxMultiplier.y)
            );
        }
    }

    Draw() {
        for (const bg of this.backgrounds) {
            bg.Draw();
        }
    }
}
