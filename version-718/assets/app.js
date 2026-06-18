(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-button");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    restart();
  }

  function setupLocalTools() {
    var filter = document.querySelector(".local-filter");
    var sort = document.querySelector(".local-sort");
    var list = document.querySelector(".local-card-list");
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

    function applyFilter() {
      if (!filter) {
        return;
      }
      var keyword = filter.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre")
        ].join(" ").toLowerCase();
        card.hidden = keyword && haystack.indexOf(keyword) === -1;
      });
    }

    function applySort() {
      if (!sort) {
        return;
      }
      var value = sort.value;
      var sorted = cards.slice();
      sorted.sort(function (a, b) {
        if (value === "rating") {
          return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
        }
        if (value === "views") {
          return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
        }
        if (value === "year") {
          return String(b.getAttribute("data-year")).localeCompare(String(a.getAttribute("data-year")), "zh-Hans-CN");
        }
        if (value === "title") {
          return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
        }
        return 0;
      });
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
    }

    if (filter) {
      filter.addEventListener("input", applyFilter);
    }
    if (sort) {
      sort.addEventListener("change", applySort);
    }
  }

  function cardTemplate(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + tag + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"card-cover\" href=\"./" + item.file + "\" aria-label=\"" + item.title + "\">" +
      "<img src=\"" + item.cover + "\" alt=\"" + item.title + "\" loading=\"lazy\">" +
      "<span class=\"play-badge\">▶</span>" +
      "<span class=\"duration-badge\">" + item.duration + "</span>" +
      "</a>" +
      "<div class=\"card-body\">" +
      "<a class=\"card-title\" href=\"./" + item.file + "\">" + item.title + "</a>" +
      "<div class=\"card-meta\"><span>" + item.year + "</span><span>" + item.region + "</span><span>" + item.category + "</span></div>" +
      "<p>" + item.oneLine + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "<div class=\"card-score\"><span>★ " + item.rating + "</span><span>" + item.viewsText + "热度</span></div>" +
      "</div>" +
      "</article>";
  }

  function setupSearchPage() {
    var input = document.getElementById("searchInput");
    var results = document.getElementById("searchResults");
    var meta = document.getElementById("searchMeta");
    if (!input || !results || !meta || typeof searchRecords === "undefined") {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;

    function render() {
      var keyword = input.value.trim().toLowerCase();
      if (!keyword) {
        results.innerHTML = "";
        meta.textContent = "请输入关键词开始搜索";
        return;
      }
      var matches = searchRecords.filter(function (item) {
        return item.text.indexOf(keyword) !== -1;
      }).slice(0, 80);
      meta.textContent = matches.length ? "搜索结果" : "没有找到匹配影片";
      results.innerHTML = matches.map(cardTemplate).join("");
    }

    input.addEventListener("input", render);
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupLocalTools();
    setupSearchPage();
  });
})();
