import '@material/mwc-button';
import { dogzApiService } from '../../services/api';
import { dogzStore } from '../../services/store/dogz.store';
import './file-drop.component.scss';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export class FileDropElement extends HTMLElement {
  private get _triggerEl() {
    return document.getElementById('fileDrop__trigger');
  }

  private get _inputEl() {
    return document.getElementById('fileDrop__input');
  }

  constructor() {
    super();

    this.innerHTML = /*html*/ `
    <div class="fileDrop">
      <input type="file" class="fileDrop__input" id="fileDrop__input"  accept="image/*" style="display:none">
      <mwc-button class="fileDrop__trigger" id="fileDrop__trigger" label="Upload file" raised></mwc-button>
    </div  >
    `;
  }

  connectedCallback() {
    this._inputEl.addEventListener('change', this.fileInputChanged, false);
    this._triggerEl.addEventListener('click', () => this.triggerClicked(), false);
  }

  async fileInputChanged({ target }: HTMLInputEvent) {
    try {
      const file = target.files.item(0);

      const model = await dogzApiService.upload(file);

      dogzStore.upsertOne(model);
    } catch (err) {}
  }

  triggerClicked() {
    if (this._inputEl) {
      this._inputEl.click();
    }
  }
}

customElements.define('dott-dogz-file-drop', FileDropElement);
