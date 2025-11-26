import { adapter } from "../connectors/MongoDB";
import ApiKeyService from "./ApiKeyService";
import AuthService from "./AuthService";
import MembershipService from "./MembershipService";
import ProjectService from "./ProjectService";
import TeamService from "./TeamService";
import TimeService from "./TimeService";
import UserService from "./UserService";
import TaskService from "./TaskService";

export const apiKeysService: ApiKeyService = new ApiKeyService(
  adapter,
  "apiKeys"
);
export const projectService: ProjectService = new ProjectService(
  adapter,
  "projects"
);
export const taskService: TaskService = new TaskService(adapter, "tasks");
export const teamService: TeamService = new TeamService(adapter, "teams");
export const timeService: TimeService = new TimeService(adapter, "time");
export const userService: UserService = new UserService(adapter, "users");

export const membershipService: MembershipService = new MembershipService(
  adapter,
  "memberships",
  {
    teamService,
    userService,
  }
);

export const authService: AuthService = new AuthService({
  userService,
  membershipService,
});
