class SearchForm extends HTMLElement {
  constructor() {
    super(),
      (this.input = this.querySelector('input[type="search"]')),
      (this.resetButton = this.querySelector('button[type="reset"]')),
      this.input &&
        (this.input.form.addEventListener("reset", this.onFormReset.bind(this)),
        this.input.addEventListener(
          "input",
          debounce((t) => {
            this.onChange(t);
          }, 300).bind(this)
        ));
  }
  toggleResetButton() {
    const t = this.resetButton.classList.contains("hidden");
    this.input.value.length > 0 && t
      ? this.resetButton.classList.remove("hidden")
      : 0 !== this.input.value.length ||
        t ||
        this.resetButton.classList.add("hidden");
  }
  onChange() {
    this.toggleResetButton();
  }
  shouldResetForm() {
    return !document.querySelector('[aria-selected="true"] a');
  }
  onFormReset(t) {
    t.preventDefault(),
      this.shouldResetForm() &&
        ((this.input.value = ""), this.input.focus(), this.toggleResetButton());
  }
}
customElements.define("search-form", SearchForm);
