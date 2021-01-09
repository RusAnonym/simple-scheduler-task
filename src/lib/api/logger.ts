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

const Events = new Logger();

const logger = {
	/**
	 * @event Text
	 * @description Allow you to receive text logs of the module's operation
	 * @example
	 * // Handling logs
	 * const scheduler = require(`simple-scheduler-task`);
	 * scheduler.events.on("logs", function (log) {
	 *    console.log(log); // => string
	 * });
	 */
	text: (text: string) => {
		return Events.emitText(text);
	},
	/**
	 * @event Error
	 * @description Allows you to handle events with an error structure ({@link ErrorLog})
	 * @example
	 * // Handling errors
	 * const scheduler = require(`simple-scheduler-task`);
	 * scheduler.events.on("errors", function (error) {
	 *    console.log(error); // => Error structure
	 * });
	 */
	error: (error: SchedulerErrorLog) => {
		return Events.emitError(error);
	},
	/**
	 * @event Success
	 * @description Allows you to handle events with an SuccessLog structure ({@link SuccessLog})
	 * @example
	 * // Handling events
	 * const scheduler = require(`simple-scheduler-task`);
	 * scheduler.events.on("executions", function (data) {
	 *    console.log(data); // => SuccessLog structure
	 * });
	 */ success: (task: SchedulerInformLog) => {
		return Events.emitSuccess(task);
	},
};

export { logger, Events };
