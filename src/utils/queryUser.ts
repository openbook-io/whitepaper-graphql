import { User } from "../entity/User";
import { Organization } from "../entity/Organization";

const queryUserAndOrganization = async (req, _res, next)  => {
  if(req.auth) {
    const user = User.findOne(req.auth.id);
    
    const organizationSlug = req.headers['w-organization'];

    let organization:any = null

    if(organizationSlug) {
      organization = Organization.createQueryBuilder('organization')
        .innerJoinAndSelect("organization.userOrganization", "userOrganization")
        .where("organization.slug = :slug", { slug: organizationSlug })
        .andWhere("userOrganization.user = :userId", { userId: req.auth.id })
        .getOne();
    }

    const promiseResults = await Promise.all([user, organization])

    req.organization = promiseResults[1];
    req.user = promiseResults[0];
  }

  return next();
}

export { queryUserAndOrganization };