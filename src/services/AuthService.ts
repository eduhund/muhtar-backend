import { compareHash } from "../utils/hash";
import { BusinessError } from "../utils/Rejection";
import { setAccessToken } from "../utils/tokens";
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
    const { hash, salt } =
      (await this.userService.getUserCredentials(userId)) || {};
    if (!hash || !salt)
      throw new BusinessError("NOT_FOUND", "User credentials not found");
    return compareHash(inputPassword, hash, salt);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");

    const { hash, salt } = user.getPassword() || {};
    if (!hash || !salt) throw new Error("User credentials not found");

    const isMatch = await compareHash(oldPassword, hash, salt);
    if (!isMatch) throw new Error("Incorrect old password");

    await user.changePassword(newPassword);

    return { message: "Password changed successfully" };
  }

  generateToken(user: any) {
    return setAccessToken("user", user._id);
  }
}
