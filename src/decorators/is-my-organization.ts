import { createMethodDecorator, UnauthorizedError } from 'type-graphql';
import { Context } from "../interface/Context";

const IsMyOrganization = (roles?) => {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    if(!context.req.user || !context.req.organization)
      throw new UnauthorizedError()
    
    const userOrganization = await context.req.organization.userOrganization;

    if(userOrganization.length < 1) throw new UnauthorizedError();

    if(roles) {
      if (userOrganization[0].roles.some(role => roles.includes(role))) {
        // grant access if the roles overlap
        return next();
      } else {
        throw new UnauthorizedError()
      }
    } else {
      return next();
    }
  })
}

export {
  IsMyOrganization
}