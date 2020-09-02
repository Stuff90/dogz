import { DogzModel } from '@dott/dogz-entity';
import { prop } from 'ramda';
import { asyncScheduler, BehaviorSubject, from, scheduled, Subject } from 'rxjs';
import { distinct, map, switchMap, takeUntil } from 'rxjs/operators';
import './../gallery-item';
import { GalleryItemElement } from './../gallery-item';
import './gallery-row.component.scss';

export class GalleryRowElement extends HTMLElement {
  private _destroy = new Subject<null>();

  private get _rowEl() {
    return this.querySelector('.galleryRow');
  }

  models = new BehaviorSubject<DogzModel[]>([]);

  constructor() {
    super();

    scheduled(this.models, asyncScheduler)
      .pipe(
        switchMap((models) => from(models)),
        distinct(prop('id')),
        map((model) => this._getGalleryItem(model)),
        takeUntil(this._destroy),
      )
      .subscribe((galleryItem) => this._rowEl.appendChild(galleryItem));
  }

  connectedCallback() {
    this.innerHTML = /*html*/ `
      <div class="galleryRow"></div>
    `;
  }

  disconnectedCallback() {
    this._destroy.next();
    this._destroy.complete();
  }

  private _getGalleryItem(model: DogzModel): GalleryItemElement {
    const item = document.createElement('dott-dogz-gallery-item') as GalleryItemElement;
    item.model = model;

    return item;
  }
}

customElements.define('dott-dogz-gallery-row', GalleryRowElement);
