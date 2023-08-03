class CartNotification extends HTMLElement {
  constructor() {
    super(),
      (this.notification = document.getElementById("cart-notification")),
      (this.header = document.querySelector("sticky-header")),
      (this.onBodyClick = this.handleBodyClick.bind(this)),
      this.notification.addEventListener(
        "keyup",
        (t) => "Escape" === t.code && this.close()
      ),
      this.querySelectorAll('button[type="button"]').forEach((t) =>
        t.addEventListener("click", this.close.bind(this))
      );
  }
  open() {
    this.notification.classList.add("animate", "active"),
      this.notification.addEventListener(
        "transitionend",
        () => {
          this.notification.focus(), trapFocus(this.notification);
        },
        { once: !0 }
      ),
      document.body.addEventListener("click", this.onBodyClick);
  }
  close() {
    this.notification.classList.remove("active"),
      document.body.removeEventListener("click", this.onBodyClick),
      removeTrapFocus(this.activeElement);
  }
  renderContents(t) {
    (this.cartItemKey = t.key),
      this.getSectionsToRender().forEach((e) => {
        document.getElementById(e.id).innerHTML = this.getSectionInnerHTML(
          t.sections[e.id],
          e.selector
        );
      }),
      this.header && this.header.reveal(),
      this.open();
  }
  getSectionsToRender() {
    return [
      {
        id: "cart-notification-product",
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      { id: "cart-notification-button" },
      { id: "cart-icon-bubble" },
    ];
  }
  getSectionInnerHTML(t, e = ".shopify-section") {
    return new DOMParser().parseFromString(t, "text/html").querySelector(e)
      .innerHTML;
  }
  handleBodyClick(t) {
    const e = t.target;
    if (e !== this.notification && !e.closest("cart-notification")) {
      const t = e.closest("details-disclosure, header-menu");
      (this.activeElement = t ? t.querySelector("summary") : null),
        this.close();
    }
  }
  setActiveElement(t) {
    this.activeElement = t;
  }
}
customElements.define("cart-notification", CartNotification);
