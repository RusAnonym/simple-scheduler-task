import { ISchedulerLogDone, ISchedulerLogError } from "../../../types/logs";
import Task from "./Task";

export interface TimeoutParams {
	plannedTime: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	isInform?: boolean;
	isNextExecutionAfterDone?: boolean;
	source(): Promise<unknown> | unknown;
	onDone?(log: ISchedulerLogDone): unknown;
	onError?(log: ISchedulerLogError): unknown;
}

class Timeout extends Task {
	constructor(params: TimeoutParams);
	constructor(
		func: () => Promise<unknown> | unknown,
		ms: number,
		params?: TimeoutParams,
	);
	constructor(
		paramsOrFunction: TimeoutParams | (() => Promise<unknown> | unknown),
		ms?: number,
		additionalParams?: TimeoutParams,
	) {
		if (typeof paramsOrFunction === "function") {
			if (!paramsOrFunction && !ms) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
			}
			super({
				source: paramsOrFunction,
				plannedTime: Date.now() + Number(ms),
				...additionalParams,
			});
		} else {
			super(paramsOrFunction);
		}
	}
}

export default Timeout;
