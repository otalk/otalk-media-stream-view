var View = require('ampersand-view');


module.exports = View.extend({
    template: [
        '<div data-hook="media-box">',
        '  <audio data-hook="audio" autoplay></audio>',
        '  <video data-hook="video" autoplay muted></video>',
        '  <div data-hook="volume"></div>',
        '  <div data-hook="camera-name"></div>',
        '  <div data-hook="mic-name"></div>',
        '  <div data-hook="controls">',
        '    <button data-hook="toggle-audio">Toggle Audio</button>',
        '    <button data-hook="toggle-video">Toggle Video</button>',
        '    <button data-hook="end-stream">End Stream</button>',
        '  </div>',
        '</div>'
    ].join(''),

    props: {
        width: 'number'
    },

    derived: {
        volumeBucket: {
            deps: ['model.volume'],
            fn: function () {
                var vol = this.model.volume;
                if (vol > -25) {
                    return 'high';
                }
                if (vol > -50) {
                    return 'medium';
                }
                return 'low';
            }
        }
    },

    bindings: {
        volumeBucket: {
            type: 'class',
            hook: 'volume'
        },
        'model.videoURL': {
            type: 'attribute',
            name: 'src',
            hook: 'video'
        },
        'model.audioURL': {
            type: 'attribute',
            name: 'src',
            hook: 'audio'
        },
        'model.volume': {
            type: 'text',
            hook: 'volume'
        },
        'model.audioPaused': {
            type: 'booleanClass',
            name: 'audio-paused'
        },
        'model.videoPaused': {
            type: 'booleanClass',
            name: 'video-paused'
        },
        'model.isVideo': {
            type: 'booleanClass',
            name: 'video'
        },
        'model.isAudio': {
            type: 'booleanClass',
            name: 'audio-only'
        },
        'model.isScreen': {
            type: 'booleanClass',
            name: 'screen'
        },
        'model.isLocal': {
            type: 'booleanClass',
            name: 'local'
        },
        'model.isRemote': {
            type: 'booleanClass',
            name: 'remote'
        },
        'model.speaking': {
            type: 'booleanClass',
            name: 'speaking'
        },
        'model.activeSpeaker': {
            type: 'booleanClass',
            name: 'active-speaker'
        },
        'model.focused': {
            type: 'booleanClass',
            name: 'focused'
        },
        'model.cameraName': {
            type: 'text',
            hook: 'camera-name'
        },
        'model.micName': {
            type: 'text',
            hook: 'mic-name'
        }
    },

    events: {
        'click [data-hook~=toggle-audio]': 'toggleAudio',
        'click [data-hook~=toggle-video]': 'toggleVideo',
        'click [data-hook~=end-stream]': 'endStream'
    },

    initialize: function () {
        this.bind('change:width', this.fitMedia, this);
        this.fitMedia(this.width);
    },

    render: function () {
        this.renderWithTemplate();
    },

    fitMedia: function () {
        this.model.fit(this.width);
    },

    toggleAudio: function () {
        if (!this.model.audioPaused) {
            this.model.pauseAudio();
        } else {
            this.model.playAudio();
        }
    },

    toggleVideo: function () {
        if (!this.model.videoPaused) {
            this.model.pauseVideo();
        } else {
            this.model.playVideo();
        }
    },

    endStream: function () {
        this.model.stop();
    }
});
