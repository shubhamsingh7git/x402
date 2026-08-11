import { TeamModel, ITeamDoc } from "../models/Team.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class TeamRepository {
  async create(data: Partial<ITeamDoc>): Promise<ITeamDoc> {
    const doc = new TeamModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<ITeamDoc[]> {
    return TeamModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return TeamModel.countDocuments().exec();
  }
}

export const teamRepository = new TeamRepository();

export class TeamService {
  async createTeam(data: { organizationId: string; name: string; description?: string }) {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const team = await teamRepository.create({
      ...data,
      teamId,
      memberCount: 1,
    });

    logger.info(`👥 TeamService created Team [${teamId}] (${data.name})`);
    eventBus.emitEvent("controlplane:teamCreated" as any, team as any);
    return team;
  }

  async getTeams() {
    return teamRepository.find(50);
  }
}

export const teamService = new TeamService();
