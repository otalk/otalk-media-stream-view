var View = require('ampersand-view');


module.exports = View.extend({
    autoRender: true,

    template: [
        '<div data-hook="media-box" class="media-outlined">',
        '  <audio data-hook="audio" autoplay></audio>',
        '  <video data-hook="video-lowres" autoplay muted></video>',
        '  <video data-hook="video-highres" autoplay muted></video>',
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
        'model.highResVideoURL': {
            type: 'attribute',
            name: 'src',
            hook: 'video-highres'
        },
        'model.lowResVideoURL': {
            type: 'attribute',
            name: 'src',
            hook: 'video-lowres'
        },
        'model.highResVideoActive': {
            type: 'toggle',
            yes: '[data-hook~=video-highres]',
            no: '[data-hook~=video-lowres]'
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

    render: function () {
        this.renderWithTemplate();

        this.cacheElements({
            audio: '[data-hook~=audio]',
            lowResVideo: '[data-hook~=video-lowres]',
            highResVideo: '[data-hook~=video-highres]'
        });

        if (this.audio) {
            this.audio.oncontextmenu = function (e) {
                e.preventDefault();
            };
        }

        this.lowResVideo.oncontextmenu = function (e) {
            e.preventDefault();
        };

        this.highResVideo.oncontextmenu = function (e) {
            e.preventDefault();
        };

        this.listenTo(this.model, 'change:audioPaused', function () {
            if (this.model.isLocal) {
                return;
            }

            if (this.audio) {
                if (this.model.audioPaused) {
                    this.audio.pause();
                } else {
                    this.audio.play();
                }
            }
        });
        
        this.listenTo(this.model, 'change:videoPaused', function () {
            if (this.model.videoPaused) {
                this.lowResVideo.pause();
                this.highResVideo.pause();
            } else {
                this.highResVideo.play();
                this.lowResVideo.play();
            }
        });

        this.listenTo(this.model, 'change:highResVideoActive', function () {
            if (this.model.highResVideoActive) {
                this.lowResVideo.pause();
                this.highResVideo.play();
            } else {
                this.highResVideo.pause();
                this.lowResVideo.play();
            }
        });
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
