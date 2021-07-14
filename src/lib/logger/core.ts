import { EventEmitter } from "events";

import {
	TSchedulerLog,
	ISchedulerLogInform,
	ISchedulerLogError,
} from "../../types/logs";

interface SchedulerLogger {
	on(event: "log", listener: (data: TSchedulerLog) => void): this;
	on(event: "done", listener: (data: ISchedulerLogInform) => void): this;
	on(event: "error", listener: (data: ISchedulerLogError) => void): this;
}

class SchedulerLogger extends EventEmitter {}

export default SchedulerLogger;
