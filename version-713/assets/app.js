(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length === 0) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        slides.forEach(function (slide) {
            slide.addEventListener("mouseenter", stop);
            slide.addEventListener("mouseleave", start);
        });
        show(0);
        start();
    }

    function initFilters() {
        var input = document.querySelector("[data-search-input]");
        var yearSelect = document.querySelector("[data-year-filter]");
        var typeSelect = document.querySelector("[data-type-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var empty = document.querySelector("[data-filter-empty]");
        if (cards.length === 0) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var preset = params.get("q") || "";
        if (input && preset) {
            input.value = preset;
        }

        function pass(card) {
            var query = input ? input.value.trim().toLowerCase() : "";
            var year = yearSelect ? yearSelect.value : "";
            var type = typeSelect ? typeSelect.value : "";
            var hay = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-tags") || "",
                card.getAttribute("data-genre") || "",
                card.getAttribute("data-year") || ""
            ].join(" ").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var cardType = card.querySelector(".movie-meta span:nth-child(3)");
            var cardTypeText = cardType ? cardType.textContent : "";
            return (!query || hay.indexOf(query) !== -1) && (!year || cardYear === year) && (!type || cardTypeText.indexOf(type) !== -1);
        }

        function apply() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = pass(card);
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.style.display = visible ? "none" : "block";
            }
        }

        [input, yearSelect, typeSelect].forEach(function (el) {
            if (el) {
                el.addEventListener("input", apply);
                el.addEventListener("change", apply);
            }
        });
        apply();
    }

    window.setupPlayer = function (source) {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector("[data-player-cover]");
        var button = document.querySelector("[data-play-button]");
        var message = document.querySelector("[data-player-message]");
        var hls = null;
        var attached = false;

        if (!video || !source) {
            return;
        }

        function showMessage(text) {
            if (message) {
                message.textContent = text || "";
            }
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        showMessage("视频暂时无法播放，请稍后再试");
                        hls.destroy();
                    }
                });
            } else {
                showMessage("视频暂时无法播放，请稍后再试");
            }
        }

        function play() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    showMessage("点击播放按钮继续观看");
                });
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                play();
            });
        }
        if (cover) {
            cover.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    ready(function () {
        initNav();
        initHero();
        initFilters();
    });
})();
