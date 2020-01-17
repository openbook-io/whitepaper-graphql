import { createParamDecorator } from 'type-graphql';
import { Context } from "../interface/Context";

const CurrentUser = () => {
  return createParamDecorator<Context>(({ context }) => context.req.user);
}

const CurrentOrganization = () => {
  return createParamDecorator<Context>(({ context }) => context.req.organization);
}

export {
  CurrentUser,
  CurrentOrganization
}