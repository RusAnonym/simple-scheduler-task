export type TSchedulerTaskStatus = "await" | "executed" | "pause" | "done";

export interface ISchedulerInputTask {
	plannedTime?: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	inform?: boolean;
	intervalTimer?: number;
	intervalTriggers?: number;
	isInterval?: boolean;
	source(): Promise<unknown> | unknown;
}

export interface ISchedulerTaskInfo {
	plannedTime: number;
	id: string;
	hidden: boolean;
	status: TSchedulerTaskStatus;
	timeout: NodeJS.Timer | null;
	interval: {
		is: boolean;
		time: number;
		isNextExecutionAfterDone: boolean;
		isInfinity: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
	service: {
		type: string;
		params: Record<string, unknown>;
		created: Date;
		inform: boolean;
	};
	source(): Promise<unknown> | unknown;
}
