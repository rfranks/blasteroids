/**
 * @description A small utility library for playing sounds, and setting audio to on/off.
 * @namespace Audio
 */
var Audio = {
    /** @property {boolean} playSounds_ flag indicating whether sounds should be played or not */
    playSounds_: true,

    /**
     * Plays the audio file at the given url.
     * @param {string} url the url of the audio file to play
     */
    play: function (url) {
        if (!Audio.playSounds_) {
            return;
        }

        var $audioElement = $('audio[src="' + url + '"]'),
            audioElement;

        if ($audioElement && $audioElement.length) {
            audioElement = $audioElement.get(0);
            audioElement.currentTime = 0;
            audioElement.playedOnce = false;
            audioElement.play();
            audioElement.playedOnce = true;
        } else {
            audioElement = document.createElement('audio');
            audioElement.setAttribute('src', url);

            audioElement.addEventListener('ended', function () {
                audioElement.pause();
                audioElement.playedOnce = true;
                audioElement.currentTime = 0;
            }, false);

            audioElement.addEventListener('canplay', function () {
                !audioElement.playedOnce && audioElement.play();
                audioElement.playedOnce = true;
            });

            $('body').append(audioElement);
        }
    },

    /** Turn sounds on. Only affects Audio Lib API. */
    soundOn: function () {
        Audio.playSounds_ = true;
    },

    /** Turn sounds off. Only affects Audio Lib API. */
    soundOff: function () {
        Audio.playSounds_ = false;
    },

    /** Toggle sounds on/off. Only affects Audio Lib API. */
    toggleSound: function () {
        Audio.playSounds_ = !Audio.playSounds_;
        return Audio.playSounds_;
    }
};
