import { SchedulerErrorLog, SchedulerInformLog, Logger } from "./types";

const Events = new Logger();

const logger = {
	text: (text: string) => {
		return Events.emitText(text);
	},
	error: (error: SchedulerErrorLog) => {
		return Events.emitError(error);
	},
	success: (task: SchedulerInformLog) => {
		return Events.emitSuccess(task);
	},
};

export { logger, Events };
