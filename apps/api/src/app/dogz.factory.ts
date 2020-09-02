import { DogzModel } from '@dott/dogz-entity';
import { pluck } from 'ramda';
import { classificationService } from './classification.service';

export class DogzFactory {
  constructor() {}

  async getDogz(path: string): Promise<DogzModel> {
    const classification = await classificationService.classify(path);

    return new DogzModel(path, pluck('className', classification));
  }

  async getAllDogz(paths: string[]): Promise<DogzModel[]> {
    return Promise.all(paths.map((path) => this.getDogz(path)));
  }
}
