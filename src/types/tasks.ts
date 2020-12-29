type taskStatus = "await" | "executed";

export interface ITask {
	plannedTime: number;
	id: string;
	type: string;
	hidden: boolean;
	params: Record<string, any>;
	status: taskStatus;
	isInterval: boolean;
	backup: boolean;
	service: {
		timeoutID: NodeJS.Timer | null;
		create: number;
		intervalTime: number;
		source: () => void;
		inform: boolean;
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
	source: Function;
}
