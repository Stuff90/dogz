import { DogzModel } from '@dott/dogz-entity';
import { propEq, uniq } from 'ramda';
import { BehaviorSubject } from 'rxjs';

class DogzStore {
  private _entities = new BehaviorSubject<DogzModel[]>([]);

  entities = this._entities.asObservable();

  reset(): void {
    return this._entities.next([]);
  }

  upsertOne(model: DogzModel): void {
    this._entities.next(uniq([...this._entities.value, model]));
  }

  upsertMany(models: DogzModel[]): void {
    this._entities.next(uniq([...this._entities.value, ...models]));
  }

  getById(id: string): DogzModel {
    return this._entities.value.find(propEq('id', id));
  }

  getAllEntities(): DogzModel[] {
    return this._entities.value;
  }
}

export const dogzStore = new DogzStore();
