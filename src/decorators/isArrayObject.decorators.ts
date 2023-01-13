import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsArrayOfObjects(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsArrayOfObjects',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((element: any) => element instanceof Object && !(element instanceof Array))
          );
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments ? validationArguments.property : 'property'} must be an array of objects`,
      },
    });
  };
}
