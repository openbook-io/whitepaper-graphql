import { User } from "../entity/User";

const queryUser = async (req, _res, next)  => {
  if(req.auth) {
    const user = await User.findOne(req.auth.id);

    req.user = user;
  }

  return next();
}

export { queryUser };