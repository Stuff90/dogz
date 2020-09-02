export function Bind(): any {
  // const suffix = 'Change';

  return function OnChangeHandler(target: unknown, propertyKey: string): void {
    const _key = ` __${propertyKey}Value`;

    console.log(_key);

    Object.defineProperty(target, propertyKey, {
      get(): unknown {
        console.log('GET');

        return this[_key];
      },
      set(value: unknown): void {
        try {
          const prevValue = this[_key];
          this[_key] = value;

          console.log(prevValue, value);

          if (prevValue !== value) {
            // if (customHandlerName) {
            //   const handler = this[customHandlerName];
            //   if (handler instanceof Subject) {
            //     handler.next(value);
            //   } else if (handler instanceof EventEmitter) {
            //     handler.emit(value);
            //   } else if (typeof handler === 'function') {
            //     handler.bind(this)(value);
            //   }
            // } else {
            //   const publicHandler = this[propertyKey + suffix];
            //   const privateHandler = this['_' + propertyKey + suffix];
            //   if (privateHandler instanceof Subject) {
            //     privateHandler.next(value);
            //   } else if (privateHandler instanceof EventEmitter) {
            //     privateHandler.emit(value);
            //   } else if (typeof privateHandler === 'function') {
            //     privateHandler.bind(this)(value);
            //   } else if (publicHandler instanceof Subject) {
            //     publicHandler.next(value);
            //   } else if (publicHandler instanceof EventEmitter) {
            //     publicHandler.emit(value);
            //   } else if (typeof publicHandler === 'function') {
            //     publicHandler.bind(this)(value);
            //   } else {
            //     throw new CdkError([
            //       'Handler not found!',
            //       `To use @PropertyChangeHook decorator, you must specify a Handler object or method named ${
            //         customHandlerName ? customHandlerName : propertyKey + suffix
            //       }`,
            //     ]);
            //   }
            // }
          }
        } catch (e) {
          // throw new CdkError([`Error while binding property ${propertyKey}`], e);
          // throw e;
        }
      },
    });
  };
}

export class Blue {
  @Bind()
  prop = 'str';

  constructor() {
    console.log(this.prop);

    this.prop = 'blue';
  }
}
