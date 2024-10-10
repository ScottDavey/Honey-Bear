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
        DEBUG.Update('CAMPOS', `Camera Pos: x${cameraPos.x.toFixed(2)} y ${cameraPos.y.toFixed(2)}`);

        for (let b = 0; b < this.backgrounds.length; b++) {
            const bg = this.backgrounds[b];
            bg.Update(
                new Vector2(cameraPos.x * bg.parallax.x, cameraPos.y * bg.parallax.y)
            );

            DEBUG.Update(`PARALLAX${b}`, `Parallax [${bg.parallax.x}]: x${(cameraPos.x * bg.parallax.x).toFixed(2)} y ${(cameraPos.y * bg.parallax.y).toFixed(2)}`);
            DEBUG.Update(`BG${b}`, `BG${b}: x${bg.pos.x} y${bg.pos.y} -> ...${bg.path.slice(-15)}`);
        }

        // DEBUG.Update('CAMPOS', `Camera Pos: x${cameraPos.x.toFixed(2)} y ${cameraPos.y.toFixed(2)}`);
        // DEBUG.Update('PARALLAX0', `Parallax [${this.backgrounds[0].parallax.x}]: x${(cameraPos.x * this.backgrounds[0].parallax.x).toFixed(2)} y ${(cameraPos.y * this.backgrounds[0].parallax.y).toFixed(2)}`);
        // DEBUG.Update('BG0', `BG0: x${this.backgrounds[0].pos.x} y${this.backgrounds[0].pos.y} -> ...${this.backgrounds[0].path.slice(-15)}`);
        // DEBUG.Update('PARALLAX1', `Parallax [${this.backgrounds[1].parallax.x}]: x${(cameraPos.x * this.backgrounds[1].parallax.x).toFixed(2)} y ${(cameraPos.y * this.backgrounds[1].parallax.y).toFixed(2)}`);
        // DEBUG.Update('BG1', `BG1: x${this.backgrounds[1].pos.x} y${this.backgrounds[1].pos.y} -> ...${this.backgrounds[1].path.slice(-15)}`);
        // DEBUG.Update('PARALLAX2', `Parallax [${this.backgrounds[2].parallax.x}]: x${(cameraPos.x * this.backgrounds[2].parallax.x).toFixed(2)} y ${(cameraPos.y * this.backgrounds[2].parallax.y).toFixed(2)}`);
        // DEBUG.Update('BG2', `BG2: x${this.backgrounds[2].pos.x} y${this.backgrounds[2].pos.y} -> ...${this.backgrounds[2].path.slice(-15)}`);
        // DEBUG.Update('PARALLAX3', `Parallax [${this.backgrounds[3].parallax.x}]: x${(cameraPos.x * this.backgrounds[3].parallax.x).toFixed(2)} y ${(cameraPos.y * this.backgrounds[3].parallax.y).toFixed(2)}`);
        // DEBUG.Update('BG3', `BG3: x${this.backgrounds[3].pos.x} y${this.backgrounds[3].pos.y} -> ...${this.backgrounds[3].path.slice(-15)}`);
        // DEBUG.Update('PARALLAX4', `Parallax [${this.backgrounds[4].parallax.x}]: x${(cameraPos.x * this.backgrounds[4].parallax.x).toFixed(2)} y ${(cameraPos.y * this.backgrounds[4].parallax.y).toFixed(2)}`);
        // DEBUG.Update('BG4', `BG4: x${this.backgrounds[4].pos.x} y${this.backgrounds[4].pos.y} -> ...${this.backgrounds[4].path.slice(-15)}`);
    }

    Draw() {
        for (let b = 0; b < this.backgrounds.length; b++) {
            this.backgrounds[b].Draw();
        }
    }
}
