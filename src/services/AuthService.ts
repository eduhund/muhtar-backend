import { compare } from "../utils/hash";
import { setToken } from "../utils/tokens";
import MembershipService from "./MembershipService";
import UserService from "./UserService";

export default class AuthService {
  userService: UserService;
  membershipService: MembershipService;
  constructor(services: any) {
    this.userService = services.users;
    this.membershipService = services.memberships;
  }
  async verifyPassword(userId: string, inputPassword: string) {
    const { password } = await this.userService.getUserCredentials(userId);
    return compare(inputPassword, password);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await compare(oldPassword, user.getPassword());
    if (!isMatch) throw new Error("Incorrect old password");

    await user.changePassword(newPassword);

    return { message: "Password changed successfully" };
  }

  generateToken(user: any) {
    return setToken(user._id);
  }
}
