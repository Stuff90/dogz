import { compose, flatten, pluck, uniq } from 'ramda';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { dogzStore } from './dogz.store';

class BreedStore {
  private _breedFromDogz = compose(uniq, flatten, pluck('className'));

  private _selectedBreed = new ReplaySubject<string>();

  entities = dogzStore.entities.pipe(map(this._breedFromDogz));

  selectedBreed = this._selectedBreed.asObservable();

  selectBreed(breed: string): void {
    if (this.breedExists(breed)) {
      this._selectedBreed.next(breed);
    }
  }

  breedExists(breed: string): boolean {
    return this._breedFromDogz(dogzStore.getAllEntities()).includes(breed);
  }
}

export const breedStore = new BreedStore();
