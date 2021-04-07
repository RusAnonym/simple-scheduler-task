type taskStatus = "await" | "works" | "pause" | "executed";

export interface ITask {
	plannedTime: number;
	id: string;
	type: string;
	hidden: boolean;
	params: Record<string, unknown>;
	status: taskStatus;
	isInterval: boolean;
	service: {
		timeoutID: NodeJS.Timer | null;
		create: number;
		intervalTime: number;
		source: () => Promise<unknown> | unknown;
		inform: boolean;
		infinityInterval: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
}

export interface IParseTask {
	id: string;
	type: string;
	params: Record<string, unknown>;
	status: taskStatus;
	inform: boolean;
	isInterval: boolean;
	intervalData?: {
		infinityInterval: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
	created: Date;
	nextExecute: Date;
	source: () => Promise<unknown> | unknown;
}
