export type TSchedulerMode = "timeout" | "interval" | "not_work";

export interface ISchedulerConfig {
	mode: TSchedulerMode;
	interval: NodeJS.Timer | null;
	intervalMS: number;
}
