import './app.element.scss';
import './components/file-drop';
import './components/gallery';
import './components/header';
import { dogzApiService } from './services/api';
import { dogzStore } from './services/store/dogz.store';

export class AppElement extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = /*html*/ `
    <dott-dogz-header></dott-dogz-header>
    <dott-dogz-gallery ></dott-dogz-gallery>
    `;

    const models = await dogzApiService.list();
    dogzStore.upsertMany(models);
  }
}
customElements.define('dott-dogz-root', AppElement);
