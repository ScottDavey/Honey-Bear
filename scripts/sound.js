/************************
*****  SOUND CLASS  *****
************************/

class Sound {

    constructor(path, isLooping, preloaded, hasControls, vol, fadeOutDuration) {
        this.vol = vol;
        this.audEl = document.createElement('audio');
        this.audEl.volume = this.vol;
        this.audEl.setAttribute('src', path);
        this.audEl.setAttribute('preload', preloaded);
        this.audEl.setAttribute('controls', hasControls);
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

    SetVolumne(vol) {
        this.audEl.volume = vol;
    }

    SetFadeOutDuration(duration) {
        this.fadeOutDuration = duration;
    }

    IsPlaying() {
        console.log(this.audEl.paused);
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

        // return newVolume === 0;
        return elapsed >= this.fadeOutDuration;
    }

}