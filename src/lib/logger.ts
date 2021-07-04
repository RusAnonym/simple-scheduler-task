import { ISchedulerInformLog, ISchedulerErrorLog } from "../types/scheduler";
import Logger from "./api/logger";

class SchedulerLogger {
	public text(data: string): void {
		Logger.Events.emitText(data);
	}

	public success(data: ISchedulerInformLog): void {
		Logger.Events.emitSuccess(data);
	}

	public error(data: ISchedulerErrorLog): void {
		Logger.Events.emitError(data);
	}
}

export default SchedulerLogger;
