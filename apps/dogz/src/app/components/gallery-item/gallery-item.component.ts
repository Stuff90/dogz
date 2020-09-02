import { DogzModel } from '@dott/dogz-entity';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { ListItem } from '@material/mwc-list/mwc-list-item';
import { asyncScheduler, scheduled, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { breedStore } from '../services/store/breed.store';
import './gallery-item.component.scss';

export class GalleryItemElement extends HTMLElement {
  private _destroy = new Subject<null>();

  private _selectedBreed = scheduled(breedStore.selectedBreed, asyncScheduler);

  private _isItemSelected = this._selectedBreed.pipe(
    map((breed: string) => (this.model.className ?? []).includes(breed)),
  );

  model: DogzModel;

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = /*html*/ `
        <div class="galleryItem galleryItem--noneSelected">
          <div class="galleryItem__className">
            <mwc-list></mwc-list>
          </div>
          <img class="galleryItem__img"  src="${this.model.path}" />
        </div>
      `;

    this.querySelector('mwc-list').addEventListener(
      'click',
      ({ target }: Event) => {
        const value = (target as ListItem).innerHTML;

        if (value) {
          breedStore.selectBreed(value);
        }
      },
      false,
    );

    this._selectedBreed.pipe(startWith(null)).subscribe((e) => {
      this._buildSelectOptions(this.model.className, e);
    });

    this._isItemSelected
      .pipe(takeUntil(this._destroy))
      .subscribe((isSelected: boolean) => this._updateSelectionState(isSelected));
  }

  disconnectedCallback() {
    this._destroy.next();
    this._destroy.complete();
  }

  private _updateSelectionState(isSelected: boolean) {
    const parent = this.querySelector('.galleryItem');
    parent.classList.remove('galleryItem--noneSelected');

    if (isSelected) {
      parent.classList.add('galleryItem--selected');
    } else {
      parent.classList.remove('galleryItem--selected');
    }
  }

  private _buildSelectOptions(breeds: string[], selected: string | null): void {
    const itemsFragment = document.createDocumentFragment();

    breeds.forEach((breed) => {
      const item = this._getBreedListItem(breed);
      if (selected && breed === selected) {
        item.activated = true;
      }
      itemsFragment.appendChild(item);
    });

    const parent = this.querySelector('mwc-list');
    parent.innerHTML = '';
    parent.appendChild(itemsFragment);
  }

  private _getBreedListItem(breed: string): ListItem {
    const item = document.createElement('mwc-list-item') as ListItem;
    item.innerHTML = breed;

    return item;
  }
}

customElements.define('dott-dogz-gallery-item', GalleryItemElement);
