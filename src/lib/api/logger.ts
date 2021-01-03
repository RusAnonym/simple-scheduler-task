import {
	SchedulerErrorLog,
	SchedulerInformLog,
	Logger,
} from "../../types/scheduler";

/**
 * @module Logger
 * @description Module for working with events
 * You can get the value returned by the scheduled task, and you can also get the errors that occur during the execution of the task when using events.
 * More about how events work: {@link https://nodejs.org/api/events.html}
 */

/**
 * @event Error
 * @method .on("logs")
 * @description Allows you to handle events with an error structure ({@link ErrorLog})
 * @example
 * // Handling errors
 * const scheduler = require(`simple-scheduler-task`);
 * scheduler.events.on("errors", function (error) {
 *    console.log(error); // => Error structure
 * });
 */

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
