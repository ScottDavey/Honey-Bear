
/********************************
*****  SOUND MANAGER CLASS  *****
********************************/

class SoundManager {

    constructor() {
        this.previousGameState = undefined;
        this.gameState = undefined;
        this.gameSubState = undefined;
        this.isGamePaused = false;
        this.muteAll = false;
        this.isBossSequence = false;

        // MUSIC
        this.isMusicOn = true;
        this.defaultVolume = 0.3;
        this.pauseVolume = (this.defaultVolume / 3).toFixed(2);
        this.musicVolume = this.defaultVolume;
        this.music = [];
        this.isMusicPlaying = false;
        this.currentSong = undefined;
        this.currentSongName = 'None';
        this.bossMusic = undefined;
        this.bossMusicName = undefined;
        this.nextSong = undefined;
        this.currentSongIndex = -1;
        this.currentSongHUB = new Text(
            'Music: None',
            new Vector2(CANVAS_WIDTH - 30, 30),
            'Lobster, "Century Gothic", sans-serif',
            'normal',
            18,
            '#FFFFFF88',
            'right'
        );

        // SFX
        this.isSFXOn = true;
        this.effects = [];
        this.playerPosition = new Vector2(0, 0);

        this.isFadeButtonLocked = false;
        this.isFading = false;
        this.fadeDirection = -1;
        this.fadeDuration = 10;
        this.fadeTimer = undefined;
    }

    Initialize(gameState) {
        const music = SOUNDS.music;
        const effects = SOUNDS.effects;

        for (const song of music) {
            this.music.push(song);
        }

        for (const sfx of effects) {
            this.effects.push(sfx);
        }

        this.gameState = gameState;
        this.previousGameState = this.gameState;

        const bossMusic = this.music.find(e => e.region === 'BOSS');
        this.bossMusicName = bossMusic.name;
        this.bossMusic = new Sound(
            `sounds/music/${bossMusic.path}`,
            'MUSIC',
            false,
            bossMusic.isLooping,
            this.musicVolume,
            3.0
        )
    }

    GetMusicOn() {
        return this.isMusicOn;
    }

    GetSFXOn() {
        return this.isSFXOn;
    }

    SetBossSequence(isBossSequence) {
        this.isBossSequence = isBossSequence;
    }

    SetMusicOn(isOn) {
        this.isMusicOn = isOn;
    }

    SetSFXOn(isOn) {
        this.isSFXOn = isOn;
    }

    ToggleMusic() {

    }

    ToggleSFX() {
        
    }

    SetGameState(state) {
        this.gameState = state;
    }

    Add(type, soundName) {
        
    }

    Remove() {

    }

    StopAll() {
        
    }

    StopMusic() {

    }

    StopSoundsFX() {

    }

    MuteAll() {

    }

    PlayAll() {
        
    }
    
    Fade(song) {

        if (!song) {
            return;
        }

        if (!this.fadeTimer) {
            this.fadeTimer = new Timer(GameTime.getCurrentGameTime(), this.fadeDuration);
        }

        if (this.fadeTimer.IsComplete() || !song) {
            this.fadeTimer = undefined;
            this.isFading = false;
            this.fadeDirection = this.fadeDirection < 0 ? 1 : -1;
            return;
        }

        const fadeTimerRemainder = this.fadeTimer.GetRemainder(5);
        const musicVolume = song.GetVolume();
        let newVolume;

        if (this.fadeDirection < 0) {
            // Fade Out by multiplying the total music volume by the percentage of remaining time
            newVolume = +(musicVolume * (fadeTimerRemainder / this.fadeDuration));

            if (newVolume < (0.01)) {
                newVolume = 0;
            }
        } else {
            // Fade in by multiplying the total volume by the percentage of time elapsed
            const timeElapsed = this.fadeDuration - fadeTimerRemainder;
            newVolume = +(musicVolume * (timeElapsed / this.fadeDuration));

            // Cap the volume at the max level if we're close to 99% of it.
            if (newVolume > (musicVolume * 0.99)) {
                newVolume = musicVolume;
            }

        }

        song.SetVolume(newVolume);

    }

    CrossFade() {

    }

    HandleMusic(gameState, isPaused) {
        let song = undefined;

        // MUSIC

        // Check our state and set up an appropriate song
        if (gameState === GAME_STATES.PRIMARY.MAIN_MENU) {

            if (!this.currentSong) {
                song = this.music.find(e => e.region === 'MAIN MENU');
            } else {
                const songTimeRemaining = this.currentSong.GetDuration() - this.currentSong.GetCurrentTime();

                // If our song is getting close to ending, fade it out
                if (!this.isFading && this.currentSong && songTimeRemaining <= this.fadeDuration) {
                    this.isFading = true;
                    this.fadeDirection = -1;
                }

                // After fasing out, we need to reset the volume 
                if (this.isFading && songTimeRemaining <= 0) {
                    this.isFading = false;
                    this.currentSong.SetVolume(this.musicVolume);
                }
            }

        } else if (gameState === GAME_STATES.PRIMARY.PLAYING) {

            if (this.isBossSequence) {

                if (this.currentSong.IsPlaying()) {
                    if (this.currentSong.GetVolume() > 0) {
                        this.Fade(this.currentSong);
                    } else {
                        this.currentSong.Stop();
                    }
                } else {

                    if (!this.bossMusic.IsPlaying()) {
                        this.bossMusic.SetVolume(this.musicVolume);
                        this.bossMusic.Play();
                    }

                }

                this.currentSongHUB.SetString(`Music: ${this.bossMusicName}`);

                return;
            }

            // If the boss music is playing, it shouldn't be. Fade it out and start the currentSong back up once it's done
            if (this.bossMusic.IsPlaying()) {

                this.fadeDirection = -1;

                if (this.bossMusic.GetVolume() > 0) {
                    this.Fade(this.bossMusic);
                } else {
                    this.bossMusic.Stop();
                }

            } else if (this.currentSong && !this.currentSong.IsPlaying()) {

                this.fadeDirection = 1;
                this.currentSong.Play();

                if (this.currentSong.GetVolume() < this.musicVolume) {
                    this.Fade(this.currentSong);
                }

            }
        
            if (this.currentSong) {
                const songTimeRemaining = this.currentSong.GetDuration() - this.currentSong.GetCurrentTime();

                // If our song is getting close to ending, fade it out
                if (!this.isFading && this.currentSong && songTimeRemaining <= this.fadeDuration) {
                    this.isFading = true;
                    this.fadeDirection = -1;
                }

                // If our song has ended, set current song to undefined
                if (this.currentSong && songTimeRemaining <= 0) {
                    this.currentSong.Stop();
                    this.currentSong = undefined;
                    this.isMusicPlaying = false;
                }
            } else {
                const possibleSongs = this.music
                    .map((song, index) => (song.region === 'LEVEL' && this.currentSongIndex !== index) ? index : -1)
                    .filter(index => index !== -1);

                const randomSongIndex = possibleSongs[random(0, possibleSongs.length - 1)];
                
                song = this.music[randomSongIndex];

                this.currentSongIndex = randomSongIndex;
            }

        }

        // We've changed states, stop the music so a new song can start
        if (this.previousGameState !== this.gameState && this.currentSong) {
            this.currentSong.Stop();
            this.isMusicPlaying = false;
            this.currentSong = undefined;
            this.nextSong = undefined;
            this.currentSongName = 'None';

            // Keep track of the previous game state
            this.previousGameState = this.gameState;
        }

        // If we don't have a current song, but we have one sorted out, create it
        if (!this.currentSong && song) {
            this.currentSong = new Sound(
                `sounds/music/${song.path}`,
                'MUSIC',
                false,
                song.isLooping,
                this.musicVolume,
                1.0
            );
            this.currentSongName = song.name;
        }

        // If we're not playing, and we have a song queued up, play it.
        if (!this.isMusicPlaying && this.currentSong) {
            this.isMusicPlaying = true;
            this.currentSong.Play();
        }

        if (this.isMusicPlaying && this.currentSong) {
            if (isPaused) {
                this.currentSong.SetVolume(this.pauseVolume);
            } else {
                this.currentSong.SetVolume(this.defaultVolume);
            }
        }

        this.isGamePaused = isPaused;

        // Set our current game state
        this.gameState = gameState;

        this.currentSongHUB.SetString(`Music: ${this.currentSongName}`);
    }

    Update(gameState, isPaused, playerPosition) {

        this.HandleMusic(gameState, isPaused);

        // Check if FADE button is pressed
        if (INPUT.GetInput(KEY_BINDINGS.FADE)) {
            if (!this.isFadeButtonLocked && !this.isFading) {
                this.isFadeButtonLocked = true;
                this.isFading = true;
            }
        } else {
            this.isFadeButtonLocked = false;
        }

        if (this.isFading) {
            this.Fade();
        }

    }

    Draw() {
        this.currentSongHUB.Draw();
    }

}