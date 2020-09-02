import { skip, take } from 'rxjs/operators';
import { breedStore } from './breed.store';
import { dogzStore } from './dogz.store';

describe('BreedStore', () => {
  beforeEach(() =>
    dogzStore.upsertMany([
      {
        id: '__ID_1__',
        path: '__PATH_1__',
        className: ['__CLASS_1__'],
      },
      {
        id: '__ID_2__',
        path: '__PATH_2__',
        className: ['__CLASS_2__'],
      },
    ]),
  );

  afterEach(() => {
    dogzStore.reset();
  });

  it('should return class names from dogs', (done) => {
    breedStore.entities.pipe(take(1)).subscribe(
      (output) => {
        expect(output).toEqual(['__CLASS_1__', '__CLASS_2__']);
      },
      done,
      done,
    );
  });

  it('should return selected class names', (done) => {
    breedStore.selectedBreed.pipe(take(1)).subscribe(
      (output) => {
        expect(output).toEqual('__CLASS_2__');
      },
      done,
      done,
    );

    breedStore.selectBreed('__CLASS_2__');
  });

  it('should not emit when selecting unknown class name', (done) => {
    const subscription = jest.fn();
    breedStore.selectedBreed.pipe(skip(1)).subscribe((e) => {
      console.log(564654, e);
      subscription();
    });

    setTimeout(() => {
      expect(subscription).not.toHaveBeenCalled();
      done();
    }, 1);

    breedStore.selectBreed('__UNKNOWN__');
  });

  it('should return boolean on wether the class name exists or not', () => {
    expect(breedStore.breedExists('__CLASS_2__')).toBeTruthy();
    expect(breedStore.breedExists('__UNKNOWN__')).toBeFalsy();
  });
});
