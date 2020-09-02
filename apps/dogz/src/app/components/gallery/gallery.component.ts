import { DogzModel } from '@dott/dogz-entity';
import { slice, splitEvery } from 'ramda';
import { asyncScheduler, scheduled, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { dogzStore } from '../services/store/dogz.store';
import './../gallery-filter';
import './../gallery-row';
import { GalleryRowElement } from './../gallery-row';
import './gallery.component.scss';

export class GalleryElement extends HTMLElement {
  private _destroy = new Subject<null>();

  private _dogz = scheduled(dogzStore.entities, asyncScheduler);

  private _rows = this._dogz.pipe(
    map(slice(this._itemsOnPartialRow * 2, Infinity)),
    map(splitEvery(this._itemsPerRow)),
  );

  private _firstRow = this._dogz.pipe(
    map(slice(this._itemsOnPartialRow, this._itemsOnPartialRow * 2)),
  );

  private get _wrapperEl() {
    return this.querySelector('.gallery') as HTMLDivElement;
  }

  private get _firstRowEl() {
    return this.querySelector('.gallery__firstRow') as HTMLDivElement;
  }

  private get _itemsOnPartialRow(): number {
    return this._itemsPerRow - 1;
  }

  private get _itemsPerRow(): number {
    return Math.ceil(window.innerWidth / 300);
  }

  upsertRow(models: DogzModel[], index: number) {
    let rowEl = this._getRowByIndex(index);

    if (!rowEl) {
      const galleryRow = this._getGalleryRow(models);
      this._wrapperEl.appendChild(galleryRow);
    } else {
      rowEl.models.next(models);
    }
  }

  constructor() {
    super();

    this._firstRow.pipe(takeUntil(this._destroy)).subscribe(([left, ...right]: DogzModel[]) => {
      const { leftRow, rightRow } = this._getGalleryFirstRow();

      leftRow.models.next([left].filter(Boolean));
      rightRow.models.next(right);
    });

    this._rows.pipe(takeUntil(this._destroy)).subscribe((rows: DogzModel[][]) => {
      rows.forEach((models: DogzModel[], index: number) => this.upsertRow(models, index));
    });
  }

  connectedCallback() {
    this.innerHTML = /*html*/ `
      <div class="gallery">
        <div class="gallery__firstRow">
          <dott-dogz-gallery-row></dott-dogz-gallery-row>
          <div class="gallery__controls">
            <dott-dogz-gallery-filter></dott-dogz-gallery-filter>
            <dott-dogz-file-drop></dott-dogz-file-drop>
          </div>
          <dott-dogz-gallery-row></dott-dogz-gallery-row>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    this._destroy.next();
    this._destroy.complete();
  }

  private _getRowByIndex(index: number): GalleryRowElement | undefined {
    return Array.from(this._wrapperEl.children)[index + 1] as GalleryRowElement;
  }

  private _getGalleryFirstRow(): { leftRow: GalleryRowElement; rightRow: GalleryRowElement } {
    const { 0: leftRow, 1: rightRow } = this._firstRowEl.querySelectorAll<GalleryRowElement>(
      'dott-dogz-gallery-row',
    );

    return { leftRow, rightRow };
  }

  private _getGalleryRow(models: DogzModel[]): GalleryRowElement {
    const item = document.createElement('dott-dogz-gallery-row') as GalleryRowElement;
    item.models.next(models);

    return item;
  }
}

customElements.define('dott-dogz-gallery', GalleryElement);
