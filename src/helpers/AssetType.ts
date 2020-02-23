import { registerEnumType } from "type-graphql";

export enum AssetType {
  UserAvatar = 'UserAvatar',
  OrganizationAvatar = 'OrganizationAvatar'
}

registerEnumType(AssetType, {
  name: "AssetType",
});