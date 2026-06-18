
(function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');

    if (header && toggle) {
        toggle.addEventListener('click', function () {
            header.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    var panel = document.querySelector('[data-filter-panel]');

    if (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var category = panel.querySelector('[data-filter-category]');
        var year = panel.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input) {
            input.value = query;
        }

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilter() {
            var text = normalize(input ? input.value : '');
            var cat = category ? category.value : '';
            var selectedYear = year ? year.value : '';

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var cardCat = card.getAttribute('data-category') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var okText = !text || haystack.indexOf(text) !== -1;
                var okCat = !cat || cardCat === cat;
                var okYear = !selectedYear || cardYear === selectedYear;
                card.classList.toggle('is-hidden', !(okText && okCat && okYear));
            });
        }

        [input, category, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }
})();
