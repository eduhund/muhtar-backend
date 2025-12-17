import Membership from "../../models/Membership";
import { projectService } from "../../services";
import { BusinessError } from "../../utils/Rejection";

type AddProjectParams = {
  name: string;
  description?: string;
};

export default async function createProject(
  { name, description = "" }: AddProjectParams,
  actorMembership: Membership
) {
  if (!actorMembership.isAdmin() && !actorMembership.isMember()) {
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
    actorMembership
  );
  return newProject;
}
