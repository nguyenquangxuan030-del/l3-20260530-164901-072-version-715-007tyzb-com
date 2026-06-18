
import { H as Hls } from './hls-dru42stk.js';

export function initMoviePlayer(root, source) {
    if (!root || !source) {
        return;
    }

    var video = root.querySelector('video');
    var overlay = root.querySelector('.player-overlay');
    var loaded = false;
    var hls = null;

    if (!video || !overlay) {
        return;
    }

    function attach() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            overlay.querySelector('strong').textContent = '暂时无法播放，请稍后再试';
        }
    }

    function play() {
        attach();
        video.controls = true;
        overlay.classList.add('is-hidden');
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                overlay.classList.remove('is-hidden');
            });
        }
    }

    overlay.addEventListener('click', play);

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', function () {
        overlay.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
