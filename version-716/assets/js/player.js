(function () {
  function connect(video, url) {
    if (video.dataset.ready === '1') {
      return;
    }

    video.dataset.ready = '1';
    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }

    video.src = url;
  }

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video[data-stream]');
    var button = player.querySelector('[data-play-button]');

    if (!video) {
      return;
    }

    var start = function () {
      connect(video, video.getAttribute('data-stream'));
      if (button) {
        button.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  });
})();
