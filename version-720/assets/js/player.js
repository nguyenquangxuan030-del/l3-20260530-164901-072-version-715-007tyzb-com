(function () {
  function initPlayer(root) {
    var video = root.querySelector('video');
    var cover = root.querySelector('[data-player-cover]');
    var playButton = root.querySelector('[data-play-button]');
    var src = root.getAttribute('data-video');
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached || !video || !src) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          }
        });
        return;
      }

      video.src = src;
    }

    function startPlayback() {
      attach();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      if (video) {
        video.controls = true;
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    }

    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback();
      });
    }

    if (cover) {
      cover.addEventListener('click', function () {
        startPlayback();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
})();
