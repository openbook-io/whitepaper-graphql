import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { Organization } from "../../entity/Organization";
import { UserOrganization } from "../../entity/UserOrganization";
import { CurrentUser, CurrentOrganization } from "../../decorators/current";
import { User } from '../../entity/User';
import { OrganizationInput } from "./organization/OrganizationInput";
import { IsMyOrganization } from '../../decorators/is-my-organization';

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

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => Organization)
  async whatIsMyCurrentOrganization(
    @CurrentOrganization() organization: Organization
  ): Promise<Organization> {
    return organization
  }

  @Authorized('user')
  @Query(() => [Organization])
  async myOrganizations(
    @CurrentUser() user: User
  ): Promise<Organization[]> {
    const userOrganizations = await UserOrganization.find({
      where: {
        user
      },
      relations: ['organization']
    })

    const organizations = userOrganizations.map((userOrganization) => userOrganization.organization)

    return Promise.all(organizations);
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
    newOrganization.owner = user;
  
    const newUserOrganization = new UserOrganization();
    newUserOrganization.roles = ['admin'];
    newUserOrganization.user = user;
    newUserOrganization.organization = newOrganization;
    const userOrganization = await newUserOrganization.save();

    return userOrganization.organization
  }
}
