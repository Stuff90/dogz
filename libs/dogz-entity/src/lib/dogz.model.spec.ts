import { DogzModel } from './dogz.model';

describe('DogzModel', () => {
  it('should instantiate model with path only', () => {
    expect(new DogzModel('__PATH/TO/IMG__')).toEqual({
      id: '21a9ec3f5a04947b34805b4a01caed11e4661b5d',
      path: '__PATH/TO/IMG__',
      className: [],
    });
  });

  it('should instantiate model and class names', () => {
    expect(new DogzModel('__PATH/TO/IMG__', ['__CLASS_1__', '__CLASS_2__'])).toEqual({
      id: '21a9ec3f5a04947b34805b4a01caed11e4661b5d',
      path: '__PATH/TO/IMG__',
      className: ['__CLASS_1__', '__CLASS_2__'],
    });
  });

  it('should instantiate model with custom id', () => {
    expect(new DogzModel('__PATH/TO/IMG__', ['__CLASS_1__', '__CLASS_2__'], '__ID__')).toEqual({
      id: '__ID__',
      path: '__PATH/TO/IMG__',
      className: ['__CLASS_1__', '__CLASS_2__'],
    });
  });
});
