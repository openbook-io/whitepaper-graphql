import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import { Organization } from "../../../entity/Organization";

@ValidatorConstraint({ async: true })
export class IsSlugAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(slug: string) {
    return Organization.findOne({ where: { slug } }).then(organization => {
      if (organization) return false;
      return true;
    });
  }
}

export function IsSlugAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSlugAlreadyExistConstraint
    });
  };
}
