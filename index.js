var View = require('ampersand-view');


module.exports = View.extend({
    template: [
        '<div data-hook="media-box" class="media-outlined">',
        '  <audio data-hook="audio" autoplay></audio>',
        '  <video data-hook="video" autoplay muted></video>',
        '  <div class="media-info">',
        '    <div data-hook="volume"></div>',
        '    <div data-hook="camera-name"></div>',
        '    <div data-hook="mic-name"></div>',
        '  </div>',
        '  <div data-hook="controls" class="button-group">',
        '    <button class="button audio-toggle"  data-hook="toggle-audio">Toggle Audio</button>',
        '    <button class="button video-toggle" data-hook="toggle-video">Toggle Video</button>',
        '    <button class="button end-stream" data-hook="end-stream">End Stream</button>',
        '  </div>',
        '</div>'
    ].join(''),

    props: {
        width: 'number'
    },

    derived: {
        volumeBucket: {
            deps: ['model.volume', 'model.audioPaused', 'model.hasAudio'],
            fn: function () {
                if (this.model.audioPaused || !this.model.hasAudio) {
                    return 'muted';
                }

                var vol = this.model.volume;
                if (vol > -25) {
                    return 'high';
                }
                if (vol > -50) {
                    return 'medium';
                }
                return 'low';
            }
        },
        showCameraInfo: {
            deps: ['model.isLocal', 'model.hasVideo'],
            fn: function () {
                return this.model.isLocal && this.model.hasVideo;
            }
        },
        showMicInfo: {
            deps: ['model.isLocal', 'model.hasAudio'],
            fn: function () {
                return this.model.isLocal && this.model.hasAudio;
            }
        }
    },

    bindings: {
        volumeBucket: {
            type: 'class',
            hook: 'volume'
        },
        showCameraInfo: {
            type: 'toggle',
            hook: 'camera-name'
        },
        showMicInfo: {
            type: 'toggle',
            hook: 'mic-name'
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
        'model.isAudio': {
            type: 'booleanClass',
            name: 'audio-only'
        },
        'model.hasVideo': [
            {
                type: 'booleanClass',
                name: 'video'
            },
            {
                type: 'toggle',
                hook: 'toggle-video'
            }
        ],
        'model.hasAudio': [
            {
                type: 'booleanClass',
                name: 'audio'
            },
            {
                type: 'toggle',
                hook: 'toggle-audio'
            }
        ],
        'model.isScreen': {
            type: 'booleanClass',
            name: 'screen'
        },
        'model.isLocal': [
            {
                type: 'booleanClass',
                name: 'local'
            },
            {
                type: 'booleanAttribute',
                name: 'muted',
                hook: 'audio'
            }
        ],
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
