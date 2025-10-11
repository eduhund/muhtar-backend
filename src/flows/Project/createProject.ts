import User from "../../models/User";
import { membershipService, projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type AddProjectParams = {
  name: string;
  description?: string;
  teamId: string;
};

export default async function createProject(
  { name, description = "", teamId }: AddProjectParams,
  currentUser: User
) {
  const currentMembership = await membershipService.getMembership({
    userId: currentUser.getId(),
    teamId: teamId,
  });
  if (!currentMembership) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not a member of this project team"
    );
  }

  if (!currentMembership.isOwner() && !currentMembership.isAdmin()) {
    throw new BusinessError(
      "FORBIDDEN",
      "You are not allowed to create a project in this team"
    );
  }

  const newProject = await projectService.createProject(
    {
      name,
      description,
    },
    currentMembership
  );
  return newProject;
}
