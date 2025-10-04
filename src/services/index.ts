import { adapter } from "../connectors/MongoDB";
import ApiKeyService from "./ApiKeyService";
import AuthService from "./AuthService";
import MembershipService from "./MembershipService";
import ProjectService from "./ProjectService";
import ProjectAnalyticsService from "./ProjectAnalytics";
import TeamService from "./TeamService";
import TimeService from "./TimeService";
import UserService from "./UserService";

export const apiKeys: ApiKeyService = new ApiKeyService(adapter, "apiKeys");
export const projects: ProjectService = new ProjectService(adapter, "projects");
export const teams: TeamService = new TeamService(adapter, "teams");
export const time: TimeService = new TimeService(adapter, "time");
export const users: UserService = new UserService(adapter, "users");

export const memberships: MembershipService = new MembershipService(
  adapter,
  "memberships",
  {
    teams,
    users,
  }
);

export const authService: AuthService = new AuthService({ users, memberships });
export const projectAnalytics: ProjectAnalyticsService =
  new ProjectAnalyticsService(projects, time);
