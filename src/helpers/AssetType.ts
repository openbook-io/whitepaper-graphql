import { registerEnumType } from "type-graphql";

export enum AssetType {
  UserAvatar = 'UserAvatar'
}

registerEnumType(AssetType, {
  name: "AssetType",
});