import { Resolver, Query, Mutation, Arg, Authorized, ID } from 'type-graphql';
import { Organization } from "../../entity/Organization";
import { OrganizationLink } from "../../entity/OrganizationLink";
import { SocialProvider } from "../../entity/SocialProvider";
import { UserOrganization } from "../../entity/UserOrganization";
import { CurrentUser, CurrentOrganization } from "../../decorators/current";
import { User } from '../../entity/User';
import { Asset } from '../../entity/Asset';
import { OrganizationInput, OrganizationEditInput, OrganizationLinkInput, OrganizationEditLinkInput } from "./organization/OrganizationInput";
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

  @IsMyOrganization()
  @Authorized('user')
  @Mutation(() => Organization)
  async editOrganization(
    @Arg("data") { name, website, about, assetId }: OrganizationEditInput,
    @CurrentOrganization() organization: Organization
  ): Promise<Organization> {
    const asset = assetId ? await Asset.findOne(assetId) : null;
    if(assetId && !asset) throw new Error("Asset not found");

    organization.about = about;
    organization.website = website;
    organization.name = name;
    organization.picture = asset;
    const userOrganization = await organization.save();

    return userOrganization
  }

  @IsMyOrganization()
  @Authorized('user')
  @Mutation(() => OrganizationLink)
  async addOrganizationLink(
    @Arg("data") { url, socialProviderId }: OrganizationLinkInput,
    @CurrentOrganization() organization: Organization
  ): Promise<OrganizationLink> {
    const socialProvider = await SocialProvider.findOne(socialProviderId);
    if(!socialProvider) throw new Error("Social provider not found");

    const organizationLink = new OrganizationLink();

    organizationLink.url = url;
    organizationLink.socialProvider = socialProvider;
    organizationLink.organization = organization;
    const newOrganizationLink = organizationLink.save();

    return newOrganizationLink;
  }

  @Authorized('user')
  @Mutation(() => OrganizationLink)
  async editOrganizationLink(
    @Arg("data") { url, id }: OrganizationEditLinkInput
  ): Promise<OrganizationLink> {
    const organizationLink = await OrganizationLink.findOne({where: {
      id: id
    }});

    if(!organizationLink) throw new Error("Organization link not found");

    organizationLink.url = url;
    const newProjectLink = organizationLink.save();

    return newProjectLink;
  }

  @Authorized('user')
  @Mutation(() => Boolean)
  async deleteOrganizationLink(
    @Arg("id", () => ID) id: number
  ) : Promise<Boolean> {
    await OrganizationLink.delete({
      id
    });

    return true;
  }
}
