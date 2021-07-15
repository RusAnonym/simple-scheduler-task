import { EventEmitter } from "events";

import {
	TSchedulerLog,
	ISchedulerLogDone,
	ISchedulerLogError,
} from "../../types/logs";

interface SchedulerLogger {
	on(event: "log", listener: (data: TSchedulerLog) => void): this;
	on(event: "done", listener: (data: ISchedulerLogDone) => void): this;
	on(event: "error", listener: (data: ISchedulerLogError) => void): this;

	emit(event: "log", data: TSchedulerLog): boolean;
	emit(event: "done", data: ISchedulerLogDone): boolean;
	emit(event: "error", data: ISchedulerLogError): boolean;
}

class SchedulerLogger extends EventEmitter {}

export default SchedulerLogger;
