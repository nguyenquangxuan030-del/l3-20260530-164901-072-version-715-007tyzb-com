var hlsPromise = null;

function loadHlsLibrary() {
    if (window.Hls) {
        return Promise.resolve(window.Hls);
    }

    if (hlsPromise) {
        return hlsPromise;
    }

    hlsPromise = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
        script.onload = function () {
            if (window.Hls) {
                resolve(window.Hls);
            } else {
                reject(new Error("video library unavailable"));
            }
        };
        script.onerror = function () {
            reject(new Error("video library unavailable"));
        };
        document.head.appendChild(script);
    });

    return hlsPromise;
}

export function mountPlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var playButton = document.getElementById(options.buttonId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !overlay || !playButton || !options.source) {
        return;
    }

    function hideOverlay() {
        overlay.classList.add("is-hidden");
    }

    function showMessage(message) {
        overlay.classList.remove("is-hidden");
        playButton.textContent = message;
        playButton.style.width = "auto";
        playButton.style.padding = "0 18px";
        playButton.style.fontSize = "15px";
    }

    function attachSource() {
        if (loaded) {
            return Promise.resolve();
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = options.source;
            return Promise.resolve();
        }

        return loadHlsLibrary().then(function (Hls) {
            if (!Hls.isSupported()) {
                throw new Error("unsupported");
            }

            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(options.source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        showMessage("播放暂不可用");
                        hlsInstance.destroy();
                    }
                }
            });
        }).catch(function () {
            loaded = false;
            showMessage("播放暂不可用");
        });
    }

    function playVideo() {
        attachSource().then(function () {
            hideOverlay();
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        });
    }

    overlay.addEventListener("click", playVideo);
    playButton.addEventListener("click", function (event) {
        event.stopPropagation();
        playVideo();
    });
    video.addEventListener("play", hideOverlay);
    video.addEventListener("ended", function () {
        overlay.classList.remove("is-hidden");
    });
    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
