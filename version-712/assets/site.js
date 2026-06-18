(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-index]'));
    var current = 0;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-index')) || 0);
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var normalizeText = function (value) {
    return String(value || '').toLowerCase().trim();
  };

  var renderSearch = function (input, panel) {
    var query = normalizeText(input.value);
    var data = window.movieSearchData || [];

    if (!query) {
      panel.classList.remove('is-open');
      panel.innerHTML = '';
      return;
    }

    var results = data.filter(function (item) {
      return normalizeText(item.title + ' ' + item.region + ' ' + item.type + ' ' + item.year + ' ' + item.genre).indexOf(query) !== -1;
    }).slice(0, 12);

    if (!results.length) {
      panel.innerHTML = '<div class="search-empty">没有找到匹配影片</div>';
      panel.classList.add('is-open');
      return;
    }

    panel.innerHTML = results.map(function (item) {
      return '<a class="search-result" href="./' + item.file + '">' +
        '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<span><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.type + '</span></span>' +
        '</a>';
    }).join('');

    panel.classList.add('is-open');
  };

  document.querySelectorAll('.search-input').forEach(function (input) {
    var panel = input.parentElement.querySelector('.search-panel');

    if (!panel) {
      return;
    }

    input.addEventListener('input', function () {
      renderSearch(input, panel);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) {
        renderSearch(input, panel);
      }
    });
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.header-search, .wide-search, .mobile-search').forEach(function (box) {
      if (!box.contains(event.target)) {
        var panel = box.querySelector('.search-panel');

        if (panel) {
          panel.classList.remove('is-open');
        }
      }
    });
  });

  document.querySelectorAll('.filter-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var group = button.closest('.content-section');

      if (!group) {
        return;
      }

      group.querySelectorAll('.filter-button').forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      var filter = button.getAttribute('data-filter') || 'all';
      var cards = group.querySelectorAll('[data-card]');

      cards.forEach(function (card) {
        var visible = true;

        if (filter !== 'all') {
          var parts = filter.split(':');
          var key = parts[0];
          var value = parts.slice(1).join(':');
          visible = card.getAttribute('data-' + key) === value;
        }

        card.style.display = visible ? '' : 'none';
      });
    });
  });
})();
