import { Express } from 'express';
import * as formidable from 'formidable';
import { DogzFactory } from './dogz.factory';
import { FileServiceInstance } from './file.service';

export class DogzApi {
  private readonly _apiName = 'dogz';

  private _factory = new DogzFactory();

  private get _apiRoot() {
    return `${this._prefix}/${this._apiName}`;
  }

  constructor(private _app: Express, private _prefix: string = '/api') {
    this._app.get(`${this._apiRoot}`, (req, res) => this._list(req, res));
    this._app.post(`${this._apiRoot}/upload`, (req, res) => this._upload(req, res));
  }

  private async _list(req, res): Promise<void> {
    try {
      const paths = await FileServiceInstance.list();
      const models = await this._factory.getAllDogz(paths);

      res.send(models);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  private _upload(req, res): void {
    try {
      const form = formidable({ multiples: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          throw err;
        }
        const { photo } = files;
        const path = await FileServiceInstance.upload(photo);

        res.send(await this._factory.getDogz(path));
      });

      return;
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
