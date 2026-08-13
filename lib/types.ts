import type { Database } from "@/lib/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type ChecklistItem = { id: string; label: string; done: boolean };

export const TASK_TYPES = ["Client", "Product", "Market", "Follow-up", "Internal"] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_PRIORITIES = ["High", "Medium", "Low"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["Not Started", "In Progress", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
