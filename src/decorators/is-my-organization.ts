import { createMethodDecorator, UnauthorizedError } from 'type-graphql';
import { Context } from "../interface/Context";
import { Organization } from "../entity/Organization";

const IsMyOrganization = (roles?) => {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    const organizationSlug = context.req.headers['w-organization'];

    if(!context.req.user || !organizationSlug)
      throw new UnauthorizedError()

    const organization = await Organization.createQueryBuilder('organization')
    .innerJoinAndSelect("organization.userOrganization", "userOrganization")
    .where("organization.slug = :slug", { slug: organizationSlug })
    .andWhere("userOrganization.user = :userId", { userId: context.req.user.id })
    .getOne();

    if(!organization) throw new UnauthorizedError()
    
    const userOrganization = await organization.userOrganization;

    if(userOrganization.length < 1) throw new UnauthorizedError();
    
    context.req.organization = organization;

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