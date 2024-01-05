/************************
*****  SOUND CLASS  *****
************************/

class Sound {

    constructor(path, type, isProximityBased, isLooping, vol, fadeOutDuration) {
        this.type = type;
        this.isProximityBased = isProximityBased;
        this.vol = vol;
        this.audEl = document.createElement('audio');
        this.audEl.volume = this.vol;
        this.audEl.setAttribute('src', path);
        this.audEl.setAttribute('preload', true);
        this.audEl.setAttribute('controls', false);
        if (isLooping) {
            this.audEl.setAttribute('loop', isLooping);
        }
        this.fadeOutStartTime = undefined;
        this.fadeOutDuration = fadeOutDuration;
    }

    Play() {
        if ((this.type === 'MUSIC' && IS_MUSIC_ON) || (this.type === 'SFX' && IS_SFX_ON)) {
            this.audEl.play();
        }
    }

    Stop() {
        this.audEl.pause();
    }

    GetVolume() {
        return this.audEl.volume;
    }

    SetVolumne(vol) {
        this.audEl.volume = vol;
    }

    SetFadeOutDuration(duration) {
        this.fadeOutDuration = duration;
    }

    IsPlaying() {
        return !this.audEl.paused;
    }

    FadeOut(CurrentGameTime) {
        if (!this.fadeOutStartTime) {
            this.fadeOutStartTime = CurrentGameTime;
        }

        const elapsed = CurrentGameTime - this.fadeOutStartTime;
        const currentVolume = this.audEl.volume;
        const newVolumeRaw = currentVolume - (1 / (this.fadeOutDuration * 60));
        const newVolume = newVolumeRaw < 0 ? 0 : newVolumeRaw;
        this.SetVolumne(newVolume);

        return elapsed >= this.fadeOutDuration;
    }

    Update(sourcePosition, playerPosition) {

        if (this.isProximityBased) {
            const deltaX = Math.pow(sourcePosition.x - playerPosition.x, 2);
            const deltaY = Math.pow(sourcePosition.y - playerPosition.y, 2);
            const delta = Math.sqrt(deltaX + deltaY);
            
            let volume = 0;
            
            if (delta < this.maxVolumneDistance) {

                if (!this.IsPlaying()) {
                    this.Play();
                }

                volume = this.buzzMaxVolume - (this.buzzMaxVolume * (delta / this.maxVolumneDistance));
                volume = (volume >= this.buzzMaxVolume) ? this.buzzMaxVolume : volume;
            } else {

                this.Stop();

            }
            
            // Based on the player's distance from the source, set volume
            this.SetVolumne(volume);
        }

        // Only play the sound if the setting is ON
        if (this.type === 'MUSIC') {
            if (!IS_MUSIC_ON && !this.IsPlaying()) {
                this.Stop();
            } else if (IS_MUSIC_ON && !this.IsPlaying()) {
                this.Play();
            }
        }

        if (this.type === 'SFX') {
            if (!IS_SFX_ON && !this.IsPlaying()) {
                this.Stop();
            }
        }

    }

}