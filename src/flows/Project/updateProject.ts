import Membership from "../../models/Membership";
import Project from "../../models/Project";
import User from "../../models/User";
import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type RecourceParams = {
  workRole: string;
  limit: number;
  price: number;
  budget?: number;
};

type PlanParams = {
  startDate?: string;
  endDate?: string;
  currency?: "RUB" | "USD" | "EUR";
  resources?: RecourceParams[];
};

type updateTimeParams = {
  name?: string;
  description?: string;
  plan?: any;
};

async function canUpdateProject(
  currentMembership: Membership,
  project: Project
) {
  if (currentMembership.isOwner() || currentMembership.isAdmin()) return true;

  const currentMembershipId = currentMembership.getId();

  const projectActorMembershipRole =
    project.getProjectMembershipRole(currentMembershipId);

  if (projectActorMembershipRole === "admin") return true;
  throw new BusinessError(
    "FORBIDDEN",
    "You are not allowed to update the project"
  );
}

export default async function updateProject(
  id: string,
  { name, description, plan }: updateTimeParams,
  currentUser: User
) {
  const project = await projectService.getProjectById(id);
  if (!project) {
    throw new BusinessError("NOT_FOUND", `Project not found`);
  }

  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: project.teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  await canUpdateProject(currentMembership, project);

  if (plan) {
    const { startDate, endDate, currency, resources } = plan;
    resources.forEach((resource: RecourceParams) => {
      resource.budget = resource.price * resource.limit;
    });
    const totalLimit = resources.reduce(
      (acc: number, resource: RecourceParams) => {
        if (resource.limit < 0) {
          throw new BusinessError(
            "INVALID_ARGUMENT",
            "Resource hours limit cannot be negative"
          );
        }
        return acc + resource.limit;
      },
      0
    );

    const totalBudget = resources.reduce(
      (acc: number, resource: RecourceParams) => {
        if (resource.price < 0) {
          throw new BusinessError(
            "INVALID_ARGUMENT",
            "Resource price cannot be negative"
          );
        }
        return acc + resource.price * resource.limit;
      },
      0
    );

    /*
    await project.updatePlan(
      {
        startDate,
        endDate,
        totalLimit,
        totalBudget,
        currency,
        resources,
      },
      currentMembership
    );
    */
  }

  await project.update(
    {
      name,
      description,
    },
    currentMembership
  );
  return {};
}
