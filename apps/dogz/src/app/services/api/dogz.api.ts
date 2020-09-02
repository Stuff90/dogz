import { IDogz } from '@dott/dogz-entity';

class DogzApiService {
  private readonly _endpoint = '/api/dogz';

  async list(): Promise<IDogz[]> {
    const res = await fetch(`${this._endpoint}`);
    const models: IDogz[] = await res.json();

    return models;
  }

  async upload(file: File): Promise<IDogz> {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch(`${this._endpoint}/upload`, { method: 'POST', body: formData });
    return await res.json();
  }
}

export const dogzApiService = new DogzApiService();
