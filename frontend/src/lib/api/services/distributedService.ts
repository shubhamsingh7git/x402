import { apiClient } from "../axios";
import {
  ApiResponse,
  JobRecord,
  QueueRecord,
  WorkerRecord,
  ScheduledTaskRecord,
  EventStoreRecord,
} from "@/types";

export const distributedService = {
  getJobs: async (): Promise<JobRecord[]> => {
    const res = await apiClient.get<ApiResponse<JobRecord[]>>("/distributed/jobs");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  createJob: async (payload: { queueName?: string; category?: string; payload: Record<string, any>; priority?: number }): Promise<JobRecord> => {
    const res = await apiClient.post<ApiResponse<JobRecord>>("/distributed/jobs", payload);
    return res.data?.data || res.data;
  },

  getJobById: async (id: string): Promise<JobRecord> => {
    const res = await apiClient.get<ApiResponse<JobRecord>>(`/distributed/jobs/${id}`);
    return res.data?.data || res.data;
  },

  retryJob: async (id: string): Promise<JobRecord> => {
    const res = await apiClient.post<ApiResponse<JobRecord>>(`/distributed/jobs/${id}/retry`);
    return res.data?.data || res.data;
  },

  cancelJob: async (id: string): Promise<JobRecord> => {
    const res = await apiClient.post<ApiResponse<JobRecord>>(`/distributed/jobs/${id}/cancel`);
    return res.data?.data || res.data;
  },

  getQueues: async (): Promise<QueueRecord[]> => {
    const res = await apiClient.get<ApiResponse<QueueRecord[]>>("/distributed/queues");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getWorkers: async (): Promise<WorkerRecord[]> => {
    const res = await apiClient.get<ApiResponse<WorkerRecord[]>>("/distributed/workers");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getSchedulerTasks: async (): Promise<ScheduledTaskRecord[]> => {
    const res = await apiClient.get<ApiResponse<ScheduledTaskRecord[]>>("/distributed/scheduler");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getDeadLetterJobs: async (): Promise<JobRecord[]> => {
    const res = await apiClient.get<ApiResponse<JobRecord[]>>("/distributed/dead-letter");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  replayDeadLetterJob: async (id: string): Promise<JobRecord> => {
    const res = await apiClient.post<ApiResponse<JobRecord>>(`/distributed/dead-letter/${id}/replay`);
    return res.data?.data || res.data;
  },

  getEvents: async (): Promise<EventStoreRecord[]> => {
    const res = await apiClient.get<ApiResponse<EventStoreRecord[]>>("/distributed/events");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },
};
