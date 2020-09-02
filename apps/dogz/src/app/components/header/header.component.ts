import { DogzModel } from '@dott/dogz-entity';
import { slice } from 'ramda';
import { asyncScheduler, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';
import { GalleryRowElement } from '../gallery-row';
import { dogzStore } from './../../services/store/dogz.store';
import './../gallery-row';
import './../logo';
import './header.component.scss';

export class HeaderElement extends HTMLElement {
  private _dogz = scheduled(dogzStore.entities, asyncScheduler);

  private get _firstRowEl() {
    return this.querySelector('dott-dogz-gallery-row') as GalleryRowElement;
  }

  private get _itemsOnFirstRow(): number {
    return Math.ceil((window.innerWidth - 300) / 300);
  }

  constructor() {
    super();

    this._dogz.pipe(map(slice(0, this._itemsOnFirstRow))).subscribe((models: DogzModel[]) => {
      this._firstRowEl.models.next(models);
    });
  }

  connectedCallback() {
    this.innerHTML = /*html*/ `
      <div class="header">
        <header>
          <dott-dogz-logo></dott-dogz-logo>
        </header>

        <dott-dogz-gallery-row class="header__galleryRow"></dott-dogz-gallery-row>
      </div>
    `;
  }
}

customElements.define('dott-dogz-header', HeaderElement);
