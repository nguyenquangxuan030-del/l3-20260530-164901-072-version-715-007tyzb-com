function mountMoviePlayer(options) {
  var video = document.getElementById("watchVideo");
  var overlay = document.querySelector(".watch-overlay");
  var loaded = false;
  var hls = null;

  if (!video || !options || !options.src) {
    return;
  }

  function loadVideo() {
    if (loaded) {
      return;
    }
    loaded = true;
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          video.setAttribute("data-error", "1");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = options.src;
    } else {
      video.src = options.src;
    }
  }

  function playVideo() {
    loadVideo();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", playVideo);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });
  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
