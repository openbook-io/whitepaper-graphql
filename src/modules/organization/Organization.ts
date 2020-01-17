import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { Organization } from "../../entity/Organization";
import { UserOrganization } from "../../entity/UserOrganization";
import { CurrentUser } from "../../decorators/current";
import { User } from '../../entity/User';
import { OrganizationInput } from "./organization/OrganizationInput";

@Resolver()
export class OrganizationResolver {
  @Query(() => [Organization])
  async getOrganizations() : Promise<Organization[]> {
    const organizations = await Organization.find();

    return organizations;
  }

  @Query(() => [UserOrganization])
  async getOrganizationUsers() : Promise<UserOrganization[]> {
    const userOrganization = await UserOrganization.find();

    return userOrganization;
  }

  @Authorized('user')
  @Mutation(() => Organization)
  async createOrganization(
    @Arg("data") { name, slug }: OrganizationInput,
    @CurrentUser() user: User
  ): Promise<Organization> {
    const newOrganization = new Organization();
    newOrganization.name = name;
    newOrganization.slug = slug;
  
    const newUserOrganization = new UserOrganization();
    newUserOrganization.roles = ['admin'];
    newUserOrganization.user = user;
    newUserOrganization.organization = newOrganization;
    const userOrganization = await newUserOrganization.save();

    return userOrganization.organization
  }
}
