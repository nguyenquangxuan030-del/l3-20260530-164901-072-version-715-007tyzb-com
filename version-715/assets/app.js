(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function startHero() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');

      if (prev) {
        prev.addEventListener('click', function () {
          showSlide(current - 1);
          startHero();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          showSlide(current + 1);
          startHero();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
          startHero();
        });
      });

      startHero();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-kind]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var selectedKind = 'all';

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var kind = card.getAttribute('data-kind') || '';
        var queryMatch = !query || text.indexOf(query) !== -1;
        var kindMatch = selectedKind === 'all' || kind === selectedKind || text.indexOf(selectedKind.toLowerCase()) !== -1;

        card.classList.toggle('is-hidden', !(queryMatch && kindMatch));
      });
    }

    if (searchInput && cards.length) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectedKind = button.getAttribute('data-filter-kind') || 'all';

        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });

        applyFilters();
      });
    });
  });
})();
