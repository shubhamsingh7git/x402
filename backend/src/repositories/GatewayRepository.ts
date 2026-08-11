import { RouteDefinitionModel, IRouteDefinitionDoc } from "../models/RouteDefinition.model";
import { GatewayPolicyModel, IGatewayPolicyDoc } from "../models/GatewayPolicy.model";

export class GatewayRepository {
  async upsertRoute(data: Partial<IRouteDefinitionDoc>): Promise<IRouteDefinitionDoc> {
    return RouteDefinitionModel.findOneAndUpdate(
      { routeId: data.routeId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IRouteDefinitionDoc>;
  }

  async findRoutes(limit = 50): Promise<IRouteDefinitionDoc[]> {
    return RouteDefinitionModel.find({}).sort({ pathPattern: 1 }).limit(limit).exec();
  }

  async countRoutes(): Promise<number> {
    return RouteDefinitionModel.countDocuments().exec();
  }

  async upsertPolicy(data: Partial<IGatewayPolicyDoc>): Promise<IGatewayPolicyDoc> {
    return GatewayPolicyModel.findOneAndUpdate(
      { policyId: data.policyId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IGatewayPolicyDoc>;
  }

  async findPolicies(limit = 50): Promise<IGatewayPolicyDoc[]> {
    return GatewayPolicyModel.find({}).sort({ scope: 1 }).limit(limit).exec();
  }
}

export const gatewayRepository = new GatewayRepository();
