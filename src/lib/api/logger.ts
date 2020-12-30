import {
	SchedulerErrorLog,
	SchedulerInformLog,
	Logger,
} from "../../types/scheduler";

/**
 * @module Logger
 * @description Module for working with events
 */

/**
 * You can even define your own types in JSDoc
 *
 * @typedef {Object} Error
 * @property {String} first      Some example property
 * @property {String} another    Another property
 */

/**
 * You can get the value returned by the scheduled task, and you can also get the errors that occur during the execution of the task when using events.
 * More about how events work: {@link https://nodejs.org/api/events.html}
 *
 * @example <caption>Logs is text messages without a date</caption>
 * // Handling logs
 * const scheduler = require(`simple-scheduler-task`);
 * scheduler.events.on("logs", function (log) {
 *    console.log(log); // => Log structure
 * });
 * @returns {Error}
 *
 *
 * @example
 * // Handling executions
 * const scheduler = require(`simple-scheduler-task`);
 * scheduler.events.on("executions", function (execution) {
 *    console.log(execution); // => Execution structure
 * });
 *
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
