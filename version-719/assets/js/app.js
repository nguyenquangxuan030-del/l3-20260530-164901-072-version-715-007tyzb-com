(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-search-input]").forEach(function (input) {
      var scope =
        document.querySelector(input.getAttribute("data-scope")) || document;
      var cards = Array.prototype.slice.call(
        scope.querySelectorAll("[data-movie-card]"),
      );
      input.addEventListener("input", function () {
        var term = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (
            card.getAttribute("data-keywords") ||
            card.textContent ||
            ""
          ).toLowerCase();
          card.classList.toggle(
            "is-filtered-out",
            term && text.indexOf(term) === -1,
          );
        });
      });
    });

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
      var slides = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-hero-slide]"),
      );
      var dots = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-hero-dot]"),
      );
      var index = 0;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      setInterval(function () {
        show(index + 1);
      }, 5600);
    }
  });
})();
