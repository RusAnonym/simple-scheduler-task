type taskStatus = "await" | "works" | "executed";

export interface ITask {
	plannedTime: number;
	id: string;
	type: string;
	hidden: boolean;
	params: Record<string, any>;
	status: taskStatus;
	isInterval: boolean;
	service: {
		timeoutID: NodeJS.Timer | null;
		create: number;
		intervalTime: number;
		source: () => Promise<any> | any;
		inform: boolean;
		infinityInterval: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
}

export interface IParseTask {
	id: string;
	type: string;
	params: Record<string, any>;
	status: string;
	inform: boolean;
	isInterval: boolean;
	intervalData?: {
		infinityInterval: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
	nextExecute: Date;
	source: () => Promise<any> | any;
}
