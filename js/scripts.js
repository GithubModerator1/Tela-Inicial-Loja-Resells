!(function () {
  var e = {};
  !(function () {
    for (
      var t = 0,
        s = document
          .getElementById("sections-script")
          .getAttribute("data-sections")
          .split(",");
      t < s.length;
      t++
    )
      e[s[t]] = !0;
  })(),
    (function () {
      if (e.header)
        try {
          class e extends HTMLElement {
            constructor() {
              super();
            }
            connectedCallback() {
              (this.header = document.querySelector(".section-header")),
                (this.headerIsAlwaysSticky =
                  "always" === this.getAttribute("data-sticky-type") ||
                  "reduce-logo-size" === this.getAttribute("data-sticky-type")),
                (this.headerBounds = {}),
                this.setHeaderHeight(),
                window
                  .matchMedia("(max-width: 990px)")
                  .addEventListener("change", this.setHeaderHeight.bind(this)),
                this.headerIsAlwaysSticky &&
                  this.header.classList.add("shopify-section-header-sticky"),
                (this.currentScrollTop = 0),
                (this.preventReveal = !1),
                (this.predictiveSearch =
                  this.querySelector("predictive-search")),
                (this.onScrollHandler = this.onScroll.bind(this)),
                (this.hideHeaderOnScrollUp = () => (this.preventReveal = !0)),
                this.addEventListener(
                  "preventHeaderReveal",
                  this.hideHeaderOnScrollUp
                ),
                window.addEventListener("scroll", this.onScrollHandler, !1),
                this.createObserver();
            }
            setHeaderHeight() {
              document.documentElement.style.setProperty(
                "--header-height",
                `${this.header.offsetHeight}px`
              );
            }
            disconnectedCallback() {
              this.removeEventListener(
                "preventHeaderReveal",
                this.hideHeaderOnScrollUp
              ),
                window.removeEventListener("scroll", this.onScrollHandler);
            }
            createObserver() {
              new IntersectionObserver((e, t) => {
                (this.headerBounds = e[0].intersectionRect), t.disconnect();
              }).observe(this.header);
            }
            onScroll() {
              const e =
                window.pageYOffset || document.documentElement.scrollTop;
              if (!this.predictiveSearch || !this.predictiveSearch.isOpen) {
                if (e > this.currentScrollTop && e > this.headerBounds.bottom) {
                  if (
                    (this.header.classList.add("scrolled-past-header"),
                    this.preventHide)
                  )
                    return;
                  requestAnimationFrame(this.hide.bind(this));
                } else
                  e < this.currentScrollTop && e > this.headerBounds.bottom
                    ? (this.header.classList.add("scrolled-past-header"),
                      this.preventReveal
                        ? (window.clearTimeout(this.isScrolling),
                          (this.isScrolling = setTimeout(() => {
                            this.preventReveal = !1;
                          }, 66)),
                          requestAnimationFrame(this.hide.bind(this)))
                        : requestAnimationFrame(this.reveal.bind(this)))
                    : e <= this.headerBounds.top &&
                      (this.header.classList.remove("scrolled-past-header"),
                      requestAnimationFrame(this.reset.bind(this)));
                this.currentScrollTop = e;
              }
            }
            hide() {
              this.headerIsAlwaysSticky ||
                (this.header.classList.add(
                  "shopify-section-header-hidden",
                  "shopify-section-header-sticky"
                ),
                this.closeMenuDisclosure(),
                this.closeSearchModal());
            }
            reveal() {
              this.headerIsAlwaysSticky ||
                (this.header.classList.add(
                  "shopify-section-header-sticky",
                  "animate"
                ),
                this.header.classList.remove("shopify-section-header-hidden"));
            }
            reset() {
              this.headerIsAlwaysSticky ||
                this.header.classList.remove(
                  "shopify-section-header-hidden",
                  "shopify-section-header-sticky",
                  "animate"
                );
            }
            closeMenuDisclosure() {
              (this.disclosures =
                this.disclosures ||
                this.header.querySelectorAll("header-menu")),
                this.disclosures.forEach((e) => e.close());
            }
            closeSearchModal() {
              (this.searchModal =
                this.searchModal || this.header.querySelector("details-modal")),
                this.searchModal.close(!1);
            }
          }
          customElements.define("sticky-header", e);
        } catch (e) {
          console.error(e);
        }
    })();
})();
