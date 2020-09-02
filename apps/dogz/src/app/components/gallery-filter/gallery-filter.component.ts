import '@material/mwc-list/mwc-list-item';
import { ListItem } from '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import { Subject } from 'rxjs';
import { startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import { breedStore } from '../../services/store/breed.store';
import './gallery-filter.component.scss';

export class GalleryFilterElement extends HTMLElement {
  private _destroy = new Subject<null>();

  constructor() {
    super();

    this.innerHTML = /*html*/ `
      <mwc-select label="Breeds" outlined class="galleryFilter">
      </mwc-select>
    `;
  }

  connectedCallback() {
    const selectEl = this.querySelector('mwc-select');

    selectEl.addEventListener(
      'change',
      () => {
        if (selectEl.value) {
          breedStore.selectBreed(selectEl.value);
        }
      },
      false,
    );

    breedStore.selectedBreed.pipe(takeUntil(this._destroy)).subscribe((selectedBreed: string) => {
      if (selectEl.value !== selectedBreed) {
        selectEl.value = selectedBreed;
      }
    });

    breedStore.entities
      .pipe(
        withLatestFrom(breedStore.selectedBreed.pipe(startWith(null))),
        takeUntil(this._destroy),
      )
      .subscribe(([breeds, selected]: [string[], string]) => {
        this._buildSelectOptions(breeds.sort(), selected);
      });
  }

  disconnectedCallback() {
    this._destroy.next();
    this._destroy.complete();
  }

  private _buildSelectOptions(breeds: string[], selected: string | null): void {
    const itemsFragment = document.createDocumentFragment();

    breeds.forEach((breed) => {
      const item = this._getBreedListItem(breed);
      if (selected && breed === selected) {
        item.selected = true;
      }
      itemsFragment.appendChild(item);
    });

    const parent = this.querySelector('mwc-select');
    parent.innerHTML = '';
    parent.appendChild(itemsFragment);
  }

  private _getBreedListItem(breed: string): ListItem {
    const item = document.createElement('mwc-list-item') as ListItem;
    item.value = breed;
    item.innerHTML = breed;

    return item;
  }
}

customElements.define('dott-dogz-gallery-filter', GalleryFilterElement);
