import { IRequestContext } from "./RequestContext";
import { logger } from "../utils/logger";

export class RequestTransformer {
  transformRequest(headers: Record<string, string>, context: IRequestContext): Record<string, string> {
    const updated = { ...headers };
    updated["x-request-id"] = context.requestId;
    updated["x-correlation-id"] = context.correlationId;
    updated["x-organization-id"] = context.organizationId || "";
    updated["x-workspace-id"] = context.workspaceId || "";
    updated["x-project-id"] = context.projectId || "";
    
    logger.debug(`🔀 RequestTransformer injected headers for Request [${context.requestId}]`);
    return updated;
  }
}

export const requestTransformer = new RequestTransformer();
