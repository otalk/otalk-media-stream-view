var View = require('ampersand-view');
var attachMediaStream = require('attachmediastream');


module.exports = View.extend({
    template: [
        '<div data-hook="media-box" class="media-outlined">',
        '  <audio data-hook="audio" autoplay></audio>',
        '  <video data-hook="video" autoplay muted></video>',
        '  <div class="button-group">',
        '    <button class="button audio-toggle"  data-hook="toggle-audio">Toggle Audio</button>',
        '    <button class="button video-toggle" data-hook="toggle-video">Toggle Video</button>',
        '    <button class="button end-stream" data-hook="end-stream">End Stream</button>',
        '  </div>',
        '</div>'
    ].join(''),

    session: {
        videoReady: 'boolean',
        videoWidth: 'number',
        videoHeight: 'number'
    },

    derived: {
        videoAspectRatio: {
            deps: [ 'videoWidth', 'videoHeight' ],
            fn: function () {
                if (this.videoWidth && this.videoHeight) {
                    return this.videoWidth / this.videoHeight;
                }
                return 1;
            }
        },
        videoOrientation: {
            deps: [ 'videoWidth', 'videoHeight' ],
            fn: function () {
                if (this.videoWith >= this.videoHeight) {
                    return 'landscape';
                } else {
                    return 'portrait';
                }
            }
        }
    },

    bindings: {
        'videoReady': {
            type: 'booleanClass',
            name: 'video-ready'
        },
        'videoOrientation': {
            type: 'class'
        },
        'model.audioMuted': {
            type: 'booleanClass',
            name: 'audio-muted'
        },
        'model.videoMuted': {
            type: 'booleanClass',
            name: 'video-muted'
        },
        'model.remoteAudioMuted': {
            type: 'booleanClass',
            name: 'remote-audio-muted'
        },
        'model.remoteVideoMuted': {
            type: 'booleanClass',
            name: 'remote-video-muted'
        },
        'model.isAudioOnly': {
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
        'model.isSpeaking': {
            type: 'booleanClass',
            name: 'speaking'
        },
        'model.isActiveSpeaker': {
            type: 'booleanClass',
            name: 'active-speaker'
        },
        'model.isFocused': {
            type: 'booleanClass',
            name: 'focused'
        }
    },

    events: {
        'click [data-hook~=toggle-audio]': 'toggleAudio',
        'click [data-hook~=toggle-video]': 'toggleVideo',
        'click [data-hook~=end-stream]': 'endStream'
    },

    render: function () {
        var self = this;

        self.renderWithTemplate();
        self.cacheElements({
            audio: '[data-hook~=audio]',
            video: '[data-hook~=video]'
        });

        if (self.audio && self.model.hasAudio) {
            self.audio = attachMediaStream(self.model.stream, self.audio, {
                audio: true,
                autoplay: true,
                disableContextMenu: true,
                muted: self.model.audioMuted
            });

            self.listenToAndRun(self.model, 'change:audioMuted', function () {
                self.audio.muted = self.model.audioMuted;
            });
        }

        if (self.video && self.model.hasVideo) {
            self.listenToAndRun(self.model, 'change:selectedVideoTrackId', function () {
                var stream = self.model.createStreamForSelectedVideoTrack();
                self.video = attachMediaStream(stream, self.video, {
                    muted: true,
                    autoplay: true,
                    disableContextMenu: true,
                    mirror: self.isLocal && !self.model.isScreen
                });
            });

            self.video.addEventListener('loadedmetadata', function () {
                self.videoHeight = self.video.videoHeight;
                self.videoWidth = self.video.videoWidth;
            });

            var handleVideoReady = function () {
                self.videoReady = true;
                self.video.removeEventListener('loadeddata', handleVideoReady);
            };
            self.video.addEventListener('loadeddata', handleVideoReady);
        }
    },

    toggleAudio: function () {
        this.model.toggleAudio();
    },

    toggleVideo: function () {
        this.model.toggleVideo();
    },

    endStream: function () {
        this.model.stop();
    }
});
