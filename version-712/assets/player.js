(function () {
  var startPlayer = function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var stream = shell.getAttribute('data-hls');
    var loaded = false;
    var hlsInstance = null;

    if (!video || !button || !stream) {
      return;
    }

    var loadStream = function () {
      if (loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      loaded = true;
    };

    var play = function () {
      loadStream();
      button.hidden = true;
      shell.classList.add('is-playing');

      var request = video.play();

      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          button.hidden = false;
          shell.classList.remove('is-playing');
        });
      }
    };

    button.addEventListener('click', play);

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      button.hidden = true;
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0) {
        button.hidden = false;
        shell.classList.remove('is-playing');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  document.querySelectorAll('[data-player]').forEach(startPlayer);
})();
