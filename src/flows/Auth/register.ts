type RegisterFlowParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default class RegisterFlow {
  authService: any;
  constructor({
    authService,
  }: //responseAdapter,
  any) {
    this.authService = authService;
    //this.responseAdapter = responseAdapter;
  }

  execute = async ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterFlowParams) => {
    /*
    const user = await getUser({ email });
    if (user) {
      return next({ code: 10105 });
    }
    const passwordHash = await hashPassword(password);
    const newUser = {
      userId: uuidv4(),
      email,
      password: passwordHash,
      firstName,
      lastName,
      registerDate: new Date(),
    };
    await createUser(newUser);
    if (!organizationId) {
      const newOrganizationId = uuidv4();
      await createOrganization({
        organizationId: newOrganizationId,
        name: "My organization",
      });
      await createMembership({
        userId: newUser.userId,
        organizationId: newOrganizationId,
        role: "owner",
        status: "active",
      });
    } else {
      const membership = await setMembership(
        {
          userId: newUser.userId,
          organizationId,
        },
        { status: "active" }
      );

      if (!membership) {
        return next({ code: 10106 });
      }
    }

    /*
    const user = await this.authService.userService.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const isValid = await this.authService.verifyPassword(
      user.getId(),
      password
    );
    if (!isValid) throw new Error("Invalid password");

    return this.authService.generateToken(user);
    */
  };
}
