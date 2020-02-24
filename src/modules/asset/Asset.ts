import {Resolver, Authorized, Mutation, Arg, Query} from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { config } from 'node-config-ts'

import { Asset } from "../../entity/Asset";
import { User } from "../../entity/User";
import { Organization } from "../../entity/Organization";
import { AssetType } from "../../helpers/AssetType";
import { CurrentUser, CurrentOrganization } from "../../decorators/current";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

@Resolver()
export class AssetResolver {
  @Authorized('user')
  @Query(() => [Asset])
  async getAssets(
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization,
    @Arg("type", () => AssetType, { nullable: true }) type?: AssetType
  ):Promise<Asset[]> {
    const assets = await Asset.find({
      user: user,
      organization,
      ...(type) && {type}
    });

    return assets;
  }

  @Authorized('user')
  @Mutation(() => Asset)
  async uploadAsset(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Arg('type', () => AssetType) type: AssetType,
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization
  ): Promise<Asset> {
    const result:any = await new Promise((resolve, reject) => {
      const upload_stream:any = cloudinary.uploader.upload_stream((err, image) => {
        if(err)
          reject(err)

        resolve(image)
      });
  
      file.createReadStream().pipe(upload_stream)
    });

    const asset = await Asset.create({
      publicId: result.public_id,
      version: result.version,
      type: type,
      user: user,
      ...(organization) && {organization}
    }).save();

    return asset
  }
}
