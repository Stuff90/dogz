import * as fetchMock from 'fetch-mock';
import { dogzApiService } from './dogz.api';

fetchMock.get('/api/dogz', [
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
fetchMock.post('/api/dogz/upload', [], {
  body: {
    id: '__ID_3__',
    path: '__PATH_3__',
    className: ['__CLASS_3__'],
  },
});

describe('DogzApiService', () => {
  it('should fetch the list of Dogz from endpoint', async () => {
    expect(await dogzApiService.list()).toEqual([
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

  // it('should ', async () => {
  //   expect(await dogzApiService.upload(('__FILE__' as unknown) as File)).toEqual({
  //     id: '__ID_1__',
  //     path: '__PATH_1__',
  //     className: ['__CLASS_1__'],
  //   });
  // });
});
