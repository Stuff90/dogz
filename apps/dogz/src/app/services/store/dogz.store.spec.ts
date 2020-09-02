import { skip, take } from 'rxjs/operators';
import { dogzStore } from './dogz.store';

describe('DogzStore', () => {
  afterEach(() => {
    dogzStore.reset();
  });

  it('should upsert one dogz models', (done) => {
    const expected = [
      {
        id: '__ID_1__',
        path: '__PATH_1__',
        className: ['__CLASS_1__'],
      },
    ];

    dogzStore.entities
      .pipe(skip(1), take(1))
      .subscribe((output) => expect(output).toEqual(expected), done, done);

    dogzStore.upsertOne({
      id: '__ID_1__',
      path: '__PATH_1__',
      className: ['__CLASS_1__'],
    });
  });

  it('should upsert many dogz models', (done) => {
    const expected = [
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
    ];

    dogzStore.entities
      .pipe(skip(1), take(1))
      .subscribe((output) => expect(output).toEqual(expected), done, done);

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
    ]);
  });

  it('should return dogz models', (done) => {
    const expected = [
      [],
      [
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
      ],
    ];

    dogzStore.entities
      .pipe(take(2))
      .subscribe((output) => expect(output).toEqual(expected.shift()), done, done);

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
    ]);
  });

  it('should get all entities', () => {
    const expected = [
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
    ];

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
    ]);

    expect(dogzStore.getAllEntities()).toEqual(expected);
  });

  it('should get entity by id', () => {
    const expected = {
      id: '__ID_1__',
      path: '__PATH_1__',
      className: ['__CLASS_1__'],
    };

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
    ]);

    expect(dogzStore.getById('__ID_1__')).toEqual(expected);
  });
});
