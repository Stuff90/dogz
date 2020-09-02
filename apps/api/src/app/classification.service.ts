import * as mobilenet from '@tensorflow-models/mobilenet';
import { node, Tensor3D } from '@tensorflow/tfjs-node';
import * as request from 'request';

export interface IClassification {
  className: string;
  probability: number;
}

class ClassificationService {
  private _threshold = 0.2;

  private _cache = new Map<string, IClassification[]>();

  private get _classificationModel() {
    return mobilenet.load();
  }

  async classify(imageUrl: string): Promise<IClassification[]> {
    if (!this._cache.has(imageUrl)) {
      try {
        this._cache.set(imageUrl, await this._classify(imageUrl));
      } catch (error) {
        console.error(error);

        return [];
      }
    }

    return this._cache.get(imageUrl);
  }

  private async _classify(imageUrl: string): Promise<IClassification[]> {
    const image = await this._getTensorFlowImage(imageUrl);
    const classificationModel = await this._classificationModel;
    const classification = await classificationModel.classify(image);

    return classification.filter(({ probability }) => probability >= this._threshold);
  }

  private _getTensorFlowImage(imageUrl: string): Promise<Tensor3D> {
    return new Promise((resolve, reject) => {
      request(
        { url: imageUrl, encoding: null },
        (err: Error | null, _resp: unknown, buffer: Buffer) => {
          if (err) {
            reject(err);
          }

          try {
            const tfImage = node.decodeImage(buffer);

            resolve(tfImage as Tensor3D);
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }
}

export const classificationService = new ClassificationService();
