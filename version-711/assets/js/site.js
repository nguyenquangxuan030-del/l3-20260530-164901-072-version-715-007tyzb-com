(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        const button = document.querySelector(".menu-toggle");
        const nav = document.getElementById("site-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            const expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            nav.classList.toggle("is-open", !expanded);
        });
    }

    function initHero() {
        const slider = document.querySelector(".hero-slider");
        if (!slider) {
            return;
        }
        const slides = Array.from(slider.querySelectorAll(".hero-slide"));
        const dots = Array.from(slider.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        let index = 0;
        let timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function play() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(Number(dot.getAttribute("data-slide")) || 0);
                play();
            });
        });
        play();
    }

    function cardMatches(card, query, activeFilter) {
        const haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-tags") || ""
        ].join(" ").toLowerCase();
        const matchedQuery = !query || haystack.indexOf(query) !== -1;
        if (!matchedQuery) {
            return false;
        }
        if (!activeFilter || activeFilter.field === "all") {
            return true;
        }
        const value = card.getAttribute("data-" + activeFilter.field) || "";
        return value.indexOf(activeFilter.value) !== -1;
    }

    function initSearch() {
        const grids = Array.from(document.querySelectorAll(".searchable-grid"));
        if (!grids.length) {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const initialQuery = (params.get("q") || "").trim();
        const inputs = Array.from(document.querySelectorAll(".movie-search-input"));
        const pills = Array.from(document.querySelectorAll(".filter-pill"));
        let activeFilter = { field: "all", value: "all" };
        inputs.forEach(function (input) {
            if (initialQuery) {
                input.value = initialQuery;
            }
        });
        function apply() {
            const query = (inputs[0] ? inputs[0].value : "").trim().toLowerCase();
            grids.forEach(function (grid) {
                Array.from(grid.querySelectorAll(".movie-card")).forEach(function (card) {
                    card.classList.toggle("is-hidden", !cardMatches(card, query, activeFilter));
                });
            });
        }
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                apply();
            });
        });
        pills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                pills.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                pill.classList.add("is-active");
                activeFilter = {
                    field: pill.getAttribute("data-filter-field") || "all",
                    value: pill.getAttribute("data-filter-value") || "all"
                };
                apply();
            });
        });
        apply();
    }

    window.startMoviePlayer = function (video, overlay, mediaUrl) {
        if (!video || !overlay || !mediaUrl) {
            return;
        }
        let prepared = false;
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = mediaUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(mediaUrl);
                hls.attachMedia(video);
            } else {
                video.src = mediaUrl;
            }
        }
        function begin() {
            prepare();
            overlay.classList.add("is-hidden");
            const attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        }
        overlay.addEventListener("click", begin);
        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            }
        });
    };

    ready(function () {
        initMenu();
        initHero();
        initSearch();
    });
})();
