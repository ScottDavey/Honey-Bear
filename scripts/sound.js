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
        this.audEl.play();
    }

    Stop() {
        this.audEl.pause();
    }

    GetVolume() {
        return this.audEl.volume;
    }

    GetCurrentTime() {
        return this.audEl.currentTime;
    }

    GetDuration() {
        return this.audEl.duration;
    }

    SetVolume(vol) {
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
        this.SetVolume(newVolume);

        return elapsed >= this.fadeOutDuration;
    }

}