import './logo.component.scss';

export class LogoElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /*html*/ `
      <header class="logo">
        <img class="logo__img"  src="/assets/logo.jpg" />
      </header>
    `;
  }
}

customElements.define('dott-dogz-logo', LogoElement);
