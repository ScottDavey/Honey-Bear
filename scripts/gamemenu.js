
/***********************************************
*****  GAME MENU: Displays a menu in-game  *****
***********************************************/

class GameMenu {

	constructor(isPlayerDead) {
		this.isPlayerDead = isPlayerDead;
		this.menuPos = new Vector2((CANVAS_WIDTH / 2) - 200, (CANVAS_HEIGHT / 2) - 110);
		this.bg = new Texture(this.menuPos, new Vector2(400, 220), 'rgba(0, 0, 0, 1)', 5, '#FFFFFF');
		this.mainMenuColor = '#999999';
		this.restartColor = '#999999';
		this.quitcolor = '#999999';
		this.buttons = [
			['restart', new Vector2(this.menuPos.x + 30, this.menuPos.y + 130 - 27), new Vector2(75, 25)],
			['main_menu', new Vector2(this.menuPos.x + 30, this.menuPos.y + 160 - 27), new Vector2(150, 25)],
			['quit', new Vector2(this.menuPos.x + 30, this.menuPos.y + 190 - 27), new Vector2(50, 25)]
		];
		this.isLeftClickLocked = false;
		this.quitMainMenu = false;
		this.quitIntro = false;
	}

	QuitMainMenu() {
		return this.quitMainMenu;
	};

	QuitIntro() {
		return this.quitIntro;
	};

	Restart() {
		return this.restart;
	};

	Update() {
		const mouseMovePos = Input.Mouse.OnMouseMove.GetPosition();
		const mouseMoveX = mouseMovePos.x;
		const mouseMoveY = mouseMovePos.y;

		const hoverColor = '#0088FF';
		this.isLeftClickLocked = false;

		for (let b = 0; b < this.buttons.length; b++) {

			const button = this.buttons[b];

			if (mouseMoveX > button[1].x && mouseMoveX < button[1].x + button[2].x && mouseMoveY > button[1].y && mouseMoveY < button[1].y + button[2].y) {

				if (Input.Mouse.GetButton(Input.Mouse.LEFT)) {
					this.isLeftClickLocked = true;
				}

				if (button[0] === 'main_menu') {
					this.mainMenuColor = hoverColor;
					if (this.isLeftClickLocked) this.quitMainMenu = true;
				} else if (button[0] === 'restart') {
					this.restartColor = hoverColor;
					if (this.isLeftClickLocked) this.restart = true;
				} else if (button[0] === 'quit') {
					this.quitColor = hoverColor;
					if (this.isLeftClickLocked) this.quitIntro = true;
				}

				break;
			} else {
				this.quitColor = '#999999';
				this.restartColor = '#999999';
				this.mainMenuColor = '#999999';
			}

		}
	};

	Draw() {

		this.bg.Draw();
		DrawText('GAME MENU', this.menuPos.x + 30, this.menuPos.y + 40, 'bold 20pt "Century Gothic", Verdana, Arial', '#FFFFFF');
		if (this.isPlayerDead) {
			DrawText('YOU DIED', this.menuPos.x + 30, this.menuPos.y + 90, 'bold 18pt Impact, Verdana, Arial', '#990000');
		}
		DrawText('Restart', this.menuPos.x + 30, this.menuPos.y + 130, 'normal 16pt "Century Gothic", Verdana, Arial', this.restartColor);
		DrawText('Main Menu', this.menuPos.x + 30, this.menuPos.y + 160, 'normal 16pt "Century Gothic", Verdana, Arial', this.mainMenuColor);
		DrawText('Quit', this.menuPos.x + 30, this.menuPos.y + 190, 'normal 16pt "Century Gothic", Verdana, Arial', this.quitColor);

	};

}