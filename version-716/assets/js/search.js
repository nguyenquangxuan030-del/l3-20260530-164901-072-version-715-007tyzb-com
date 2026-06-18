(function () {
  var params = new URLSearchParams(location.search);
  var query = (params.get('q') || '').trim();
  var form = document.querySelector('[data-page-search]');
  var input = form ? form.querySelector('input[name="q"]') : null;
  var title = document.querySelector('[data-search-title]');
  var results = document.querySelector('[data-search-results]');

  if (input) {
    input.value = query;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="./' + escapeHtml(movie.file) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="play-dot">▶</span>',
      '</a>',
      '<div class="card-body">',
      '<div class="card-meta"><span>' + escapeHtml(movie.year || '热映') + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.rating) + '分</span></div>',
      '<h3><a href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine || movie.genre) + '</p>',
      '<div class="tag-row">' + tags + '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function render(value) {
    var q = (value || '').trim().toLowerCase();
    var items = SEARCH_MOVIES.filter(function (movie) {
      if (!q) {
        return true;
      }
      return [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        movie.oneLine,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase().indexOf(q) !== -1;
    }).slice(0, 180);

    if (title) {
      title.textContent = q ? '搜索结果' : '热门内容';
    }

    if (results) {
      results.innerHTML = items.map(card).join('');
    }
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var next = input ? input.value.trim() : '';
      history.replaceState(null, '', next ? './search.html?q=' + encodeURIComponent(next) : './search.html');
      render(next);
    });
  }

  render(query);
})();
