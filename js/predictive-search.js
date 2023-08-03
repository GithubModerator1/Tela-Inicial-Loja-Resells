class PredictiveSearch extends SearchForm {
  constructor() {
    super(),
      (this.cachedResults = {}),
      (this.predictiveSearchResults = this.querySelector(
        "[data-predictive-search]"
      )),
      (this.allPredictiveSearchInstances =
        document.querySelectorAll("predictive-search")),
      (this.isOpen = !1),
      (this.abortController = new AbortController()),
      (this.searchTerm = ""),
      this.setupEventListeners();
  }
  setupEventListeners() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this)),
      this.input.addEventListener("focus", this.onFocus.bind(this)),
      this.addEventListener("focusout", this.onFocusOut.bind(this)),
      this.addEventListener("keyup", this.onKeyup.bind(this)),
      this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  getQuery() {
    return this.input.value.trim();
  }
  onChange() {
    super.onChange();
    const e = this.getQuery();
    (this.searchTerm && e.startsWith(this.searchTerm)) ||
      this.querySelector("#predictive-search-results-groups-wrapper")?.remove(),
      this.updateSearchForTerm(this.searchTerm, e),
      (this.searchTerm = e),
      this.searchTerm.length
        ? this.getSearchResults(this.searchTerm)
        : this.close(!0);
  }
  onFormSubmit(e) {
    (this.getQuery().length &&
      !this.querySelector('[aria-selected="true"] a')) ||
      e.preventDefault();
  }
  onFormReset(e) {
    super.onFormReset(e),
      super.shouldResetForm() &&
        ((this.searchTerm = ""),
        this.abortController.abort(),
        (this.abortController = new AbortController()),
        this.closeResults(!0));
  }
  onFocus() {
    const e = this.getQuery();
    e.length &&
      (this.searchTerm !== e
        ? this.onChange()
        : "true" === this.getAttribute("results")
        ? this.open()
        : this.getSearchResults(this.searchTerm));
  }
  onFocusOut() {
    setTimeout(() => {
      this.contains(document.activeElement) || this.close();
    });
  }
  onKeyup(e) {
    switch (
      (this.getQuery().length || this.close(!0), e.preventDefault(), e.code)
    ) {
      case "ArrowUp":
        this.switchOption("up");
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case "Enter":
        this.selectOption();
    }
  }
  onKeydown(e) {
    ("ArrowUp" !== e.code && "ArrowDown" !== e.code) || e.preventDefault();
  }
  updateSearchForTerm(e, t) {
    const s = this.querySelector("[data-predictive-search-search-for-text]"),
      i = s?.innerText;
    if (i) {
      if (i.match(new RegExp(e, "g")).length > 1) return;
      const r = i.replace(e, t);
      s.innerText = r;
    }
  }
  switchOption(e) {
    if (!this.getAttribute("open")) return;
    const t = "up" === e,
      s = this.querySelector('[aria-selected="true"]'),
      i = Array.from(
        this.querySelectorAll("li, button.predictive-search__item")
      ).filter((e) => null !== e.offsetParent);
    let r = 0;
    if (t && !s) return;
    let h = -1,
      n = 0;
    for (; -1 === h && n <= i.length; ) i[n] === s && (h = n), n++;
    if (
      ((this.statusElement.textContent = ""),
      !t && s
        ? (r = h === i.length - 1 ? 0 : h + 1)
        : t && (r = 0 === h ? i.length - 1 : h - 1),
      r === h)
    )
      return;
    const o = i[r];
    o.setAttribute("aria-selected", !0),
      s && s.setAttribute("aria-selected", !1),
      this.input.setAttribute("aria-activedescendant", o.id);
  }
  selectOption() {
    const e = this.querySelector(
      '[aria-selected="true"] a, button[aria-selected="true"]'
    );
    e && e.click();
  }
  getSearchResults(e) {
    const t = e.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState(),
      this.cachedResults[t]
        ? this.renderSearchResults(this.cachedResults[t])
        : fetch(
            `${routes.predictive_search_url}?q=${encodeURIComponent(
              e
            )}&section_id=predictive-search`,
            { signal: this.abortController.signal }
          )
            .then((e) => {
              if (!e.ok) {
                var t = new Error(e.status);
                throw (this.close(), t);
              }
              return e.text();
            })
            .then((e) => {
              const s = new DOMParser()
                .parseFromString(e, "text/html")
                .querySelector("#shopify-section-predictive-search").innerHTML;
              this.allPredictiveSearchInstances.forEach((e) => {
                e.cachedResults[t] = s;
              }),
                this.renderSearchResults(s);
            })
            .catch((e) => {
              if (20 !== e?.code) throw (this.close(), e);
            });
  }
  setLiveRegionLoadingState() {
    (this.statusElement =
      this.statusElement || this.querySelector(".predictive-search-status")),
      (this.loadingText =
        this.loadingText || this.getAttribute("data-loading-text")),
      this.setLiveRegionText(this.loadingText),
      this.setAttribute("loading", !0);
  }
  setLiveRegionText(e) {
    this.statusElement.setAttribute("aria-hidden", "false"),
      (this.statusElement.textContent = e),
      setTimeout(() => {
        this.statusElement.setAttribute("aria-hidden", "true");
      }, 1e3);
  }
  renderSearchResults(e) {
    (this.predictiveSearchResults.innerHTML = e),
      this.setAttribute("results", !0),
      this.setLiveRegionResults(),
      this.open();
  }
  setLiveRegionResults() {
    this.removeAttribute("loading"),
      this.setLiveRegionText(
        this.querySelector("[data-predictive-search-live-region-count-value]")
          .textContent
      );
  }
  getResultsMaxHeight() {
    return (
      (this.resultsMaxHeight =
        window.innerHeight -
        document.querySelector(".section-header").getBoundingClientRect()
          .bottom),
      this.resultsMaxHeight
    );
  }
  open() {
    (this.predictiveSearchResults.style.maxHeight =
      this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`),
      this.setAttribute("open", !0),
      this.input.setAttribute("aria-expanded", !0),
      (this.isOpen = !0);
  }
  close(e = !1) {
    this.closeResults(e), (this.isOpen = !1);
  }
  closeResults(e = !1) {
    e && ((this.input.value = ""), this.removeAttribute("results"));
    const t = this.querySelector('[aria-selected="true"]');
    t && t.setAttribute("aria-selected", !1),
      this.input.setAttribute("aria-activedescendant", ""),
      this.removeAttribute("loading"),
      this.removeAttribute("open"),
      this.input.setAttribute("aria-expanded", !1),
      (this.resultsMaxHeight = !1),
      this.predictiveSearchResults.removeAttribute("style");
  }
}
customElements.define("predictive-search", PredictiveSearch);
