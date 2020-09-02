import * as sha1 from 'sha1';

export interface IDogz {
  id: string;
  path: string;
  className: string[];
}

export class DogzModel implements IDogz {
  constructor(
    public path: string,
    public className: string[] = [],
    public id: string = sha1(path),
  ) {}
}
