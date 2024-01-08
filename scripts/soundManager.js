/*
    WHAT DOES A SOUND MANAGER DO?

        - It can hold all game sounds
            - It can preload all game sounds

        - It can be accessed from anywhere in the code

        - It can interact with other game sounds
            - Like crossfading, playing when another has finished, etc...

        - It's a way to organize sounds within a game and 
*/


/********************************
*****  SOUND MANAGER CLASS  *****
********************************/

class SoundManager {

    constructor() {
        this.isMusicOn = true;
        this.isSFXOn = true;
        this.music = [];
        this.effects = [];
        this.workingSounds = [];    // List of sounds currently in use
        this.gameState = undefined;
        this.gameSubState = undefined;
        this.muteAll = false;
        this.isMusicPlaying = false;

        this.currentSong = new Text(
            'Music: Seneca',
            new Vector2(CANVAS_WIDTH - 30, 30),
            'Lobster, "Century Gothic", sans-serif',
            'normal',
            18,
            '#FFFFFF88',
            'right'
        );
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
    }

    GetMusicOn() {
        return this.isMusicOn;
    }

    GetSFXOn() {
        return this.isSFXOn;
    }

    SetMusicOn(isOn) {
        this.isMusicOn = isOn;
    }

    SetSFXOn(isOn) {
        this.isSFXOn = isOn;
    }

    SetGameState(state) {
        this.gameState = state;
    }

    Add() {

    }

    Remove() {

    }

    StopAll() {

    }

    MuteAll() {

    }

    PlayAll() {
        
    }
    
    FadeIn() {

    }

    FadeOut() {

    }

    CrossFade() {

    }

    Update() {

        /* 
            For music:
                - What Game State are we in?
                    - INTRO: Loop over 1 intro song
                    - PLAYING:
                        - LEVEL: Loop through, with crossfade, level music.
                        Note that this could be further refined if we want
                        a coupld a couple song specifid to a level.
                            - PAUSED: Lower all sounds
                        - BOSS: Fade out level music, loop over boss song

            For effects:
                - 
        */


    }

    Draw() {
        this.currentSong.Draw();
    }

}