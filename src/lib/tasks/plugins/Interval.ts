import { ISchedulerLogDone, ISchedulerLogError } from "../../../types/logs";
import Task from "./Task";

export interface IntervalParams {
	plannedTime: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	isInform?: boolean;
	intervalTimer?: number;
	intervalTriggers?: number;
	isNextExecutionAfterDone?: boolean;
	source(): Promise<unknown> | unknown;
	onDone?(log: ISchedulerLogDone): unknown;
	onError?(log: ISchedulerLogError): unknown;
}

class Interval extends Task {
	constructor(params: IntervalParams);
	constructor(
		func: () => Promise<unknown> | unknown,
		ms: number,
		params?: IntervalParams,
	);
	constructor(
		paramsOrFunction: IntervalParams | (() => Promise<unknown> | unknown),
		ms?: number,
		additionalParams?: IntervalParams,
	) {
		if (typeof paramsOrFunction === "function") {
			if (!paramsOrFunction && !ms) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
			}
			super({
				isInterval: true,
				source: paramsOrFunction,
				plannedTime: Date.now() + Number(ms),
				...additionalParams,
			});
		} else {
			super({
				isInterval: true,
				...paramsOrFunction,
			});
		}
	}
}

export default Interval;
