(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", function () {
            var isOpen = mobileNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var filterCards = Array.prototype.slice.call(document.querySelectorAll(".filter-grid .movie-card"));

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var filter = button.getAttribute("data-filter") || "all";
            filterButtons.forEach(function (item) {
                item.classList.toggle("active", item === button);
            });
            filterCards.forEach(function (card) {
                var text = card.textContent || "";
                var matched = filter === "all" || text.indexOf(filter) !== -1;
                card.classList.toggle("is-filtered-out", !matched);
            });
        });
    });

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function renderResults(container, results) {
        if (!results.length) {
            container.innerHTML = "<div class=\"search-result-item\"><div></div><span class=\"rank-title\"><strong>未找到相关影片</strong><small>请尝试其他关键词</small></span></div>";
            container.classList.add("is-open");
            return;
        }

        container.innerHTML = results.slice(0, 12).map(function (item) {
            return "<a class=\"search-result-item\" href=\"" + item.url + "\">" +
                "<img src=\"" + item.cover + "\" alt=\"" + item.title.replace(/\"/g, "&quot;") + "\" loading=\"lazy\">" +
                "<span class=\"rank-title\"><strong>" + item.title + "</strong><small>" + item.year + " · " + item.region + " · " + item.type + "</small></span>" +
                "</a>";
        }).join("");
        container.classList.add("is-open");
    }

    Array.prototype.slice.call(document.querySelectorAll(".site-search")).forEach(function (form) {
        var input = form.querySelector(".site-search-input");
        var resultsBox = form.querySelector(".search-results");

        if (!input || !resultsBox) {
            return;
        }

        function search() {
            var query = normalize(input.value);
            if (!query) {
                resultsBox.classList.remove("is-open");
                resultsBox.innerHTML = "";
                return;
            }
            var source = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];
            var results = source.filter(function (item) {
                return normalize(item.title + " " + item.year + " " + item.region + " " + item.type + " " + item.tags).indexOf(query) !== -1;
            });
            renderResults(resultsBox, results);
        }

        input.addEventListener("input", search);
        input.addEventListener("focus", search);
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var firstLink = resultsBox.querySelector("a");
            if (firstLink) {
                window.location.href = firstLink.getAttribute("href");
            } else {
                search();
            }
        });
        document.addEventListener("click", function (event) {
            if (!form.contains(event.target)) {
                resultsBox.classList.remove("is-open");
            }
        });
    });
})();
