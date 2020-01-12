import {AuthChecker} from 'type-graphql';
import {Context} from "./interface/Context";

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { req } }, roles) => {
  if(!req.user) {
    return false
  }

  if (req.user.roles.some(role => roles.includes(role))) {
    // grant access if the roles overlap
    return true;
  }

  return false;
};
