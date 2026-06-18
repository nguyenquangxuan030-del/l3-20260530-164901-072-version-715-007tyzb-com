(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  document.querySelectorAll('[data-filter-list]').forEach(function (list) {
    var section = list.closest('.section') || document;
    var input = section.querySelector('[data-list-search]');
    var chips = Array.prototype.slice.call(section.querySelectorAll('[data-list-chip]'));
    var reset = section.querySelector('[data-list-reset]');
    var activeChip = '';

    var apply = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      Array.prototype.slice.call(list.querySelectorAll('.movie-card')).forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' ').toLowerCase();
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedChip = !activeChip || text.indexOf(activeChip.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(matchedKeyword && matchedChip));
      });
    };

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeChip = chip.getAttribute('data-list-chip') || '';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        apply();
      });
    });

    if (reset) {
      reset.addEventListener('click', function () {
        activeChip = '';
        if (input) {
          input.value = '';
        }
        chips.forEach(function (item) {
          item.classList.remove('is-active');
        });
        apply();
      });
    }
  });
})();
