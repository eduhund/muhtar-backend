import User from "../../models/User";

export default async function getMe(actorUser: User) {
  return {
    user: actorUser,
  };
}
