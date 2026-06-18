(function () {
  var form = document.querySelector('[data-search-form]');
  var result = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-search-empty]');

  if (!form || !result || !window.SEARCH_MOVIES) {
    return;
  }

  var keywordInput = form.querySelector('[data-search-keyword]');
  var categorySelect = form.querySelector('[data-search-category]');
  var yearSelect = form.querySelector('[data-search-year]');
  var regionSelect = form.querySelector('[data-search-region]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function card(movie) {
    return '' +
      '<article class="movie-card">' +
      '<a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">' +
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
      '<span class="poster-play">▶</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<div class="card-meta"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span></div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runSearch() {
    var keyword = normalize(keywordInput && keywordInput.value);
    var category = normalize(categorySelect && categorySelect.value);
    var year = normalize(yearSelect && yearSelect.value);
    var region = normalize(regionSelect && regionSelect.value);
    var items = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = normalize([movie.title, movie.region, movie.year, movie.genre, movie.category, movie.oneLine].join(' '));

      if (keyword && haystack.indexOf(keyword) === -1) {
        return false;
      }

      if (category && normalize(movie.category) !== category) {
        return false;
      }

      if (year && normalize(movie.year) !== year) {
        return false;
      }

      if (region && normalize(movie.region) !== region) {
        return false;
      }

      return true;
    }).slice(0, 120);

    result.innerHTML = items.map(card).join('');

    if (empty) {
      empty.classList.toggle('is-visible', items.length === 0);
    }
  }

  Array.prototype.slice.call(form.querySelectorAll('input, select')).forEach(function (control) {
    control.addEventListener('input', runSearch);
    control.addEventListener('change', runSearch);
  });

  runSearch();
})();
