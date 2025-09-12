import Project from "../models/Project";
import Time from "../models/Time";
import ProjectService from "./ProjectService";
import TimeService from "./TimeService";

export default class ProjectAnalyticsService {
  constructor(
    private projectService: ProjectService,
    private timeService: TimeService
  ) {}

  async calculateTotalHoursByMembership(
    project: Project,
    membershipId: string
  ) {
    const timeList = await this.timeService.getTimeByMembership(membershipId);
    if (!project) {
      throw new Error("Project not found");
    }

    const multiplier =
      project.getProjectMembership(membershipId)?.multiplier || 1;

    const totalHours = timeList.reduce((sum: number, t: Time) => {
      return sum + t.duration;
    }, 0);

    return Math.round((totalHours * multiplier) / 60);
  }

  async calculateTotalHours(project: Project) {
    const totalHoursByUser = await Promise.all(
      project.memberships.map(async (m) => {
        return await this.calculateTotalHoursByMembership(
          project,
          m.membershipId
        );
      })
    );

    const totalHours = totalHoursByUser.reduce((sum, h) => sum + h, 0);

    return totalHours;
  }

  async calculateTotalAmountByMembership(
    project: Project,
    membershipId: string
  ) {
    const totalHours = await this.calculateTotalHoursByMembership(
      project,
      membershipId
    );
    const projectMembership = project.getProjectMembership(membershipId);
    if (!projectMembership) {
      throw new Error("Membership not found");
    }

    return totalHours * projectMembership.rate;
  }

  async calculateTotalAmount(project: Project) {
    const totalAmountPerMembership = await Promise.all(
      project.memberships.map(async (m) => {
        return await this.calculateTotalAmountByMembership(
          project,
          m.membershipId
        );
      })
    );

    return totalAmountPerMembership.reduce((sum, a) => sum + a, 0);
  }
}
