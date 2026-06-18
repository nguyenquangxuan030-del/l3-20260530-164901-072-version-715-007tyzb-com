import { H as Hls } from './hls-vendor-dru42stk.js';

export function initMoviePlayer(src, videoId, triggerSelector) {
  var video = document.getElementById(videoId);

  if (!video || !src) {
    return;
  }

  var triggers = Array.prototype.slice.call(document.querySelectorAll(triggerSelector));
  var attached = false;
  var hlsInstance = null;

  function attach() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = src;
  }

  function hideTriggers() {
    triggers.forEach(function (trigger) {
      trigger.classList.add('is-hidden');
    });
  }

  function play() {
    attach();
    hideTriggers();
    video.controls = true;

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', play);
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
}
