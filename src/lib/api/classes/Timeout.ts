import Task from "./Task";
import { inputTask } from "../types";

/**
 * @class
 * @classdesc This is a timeout constructor
 * @returns {Task} An instance of the Task class
 *
 * @example
 * const { Timeout } = require(`simple-scheduler-task`);
 * // Outputs in 5 minutes to the console: "Hello, world!
 * new Timeout({
 * 	plannedTime: Date.now() + 5 * 60 * 1000,
 * 	source: function () {
 * 		console.log(`Hello, world!`);
 * 	}
 * });
 *
 * @example
 * // Shorter entry
 * new Timeout(() => console.log(`Hello, world!`), 5 * 60 * 1000);
 *
 * @example
 * // Also with the third argument, you can specify additional parameters
 * // For example, now after completing a task, there will be an event about it
 * new Timeout(() => console.log(`Hello, world!`), 5 * 60 * 1000, {
 * 	inform: true
 * });
 */
class Timeout extends Task {
	/**
	 * @example
	 * const { Timeout } = require(`simple-scheduler-task`);
	 * // Outputs in 5 minutes to the console: "Hello, world!
	 * new Timeout({
	 * 	plannedTime: Date.now() + 5 * 60 * 1000,
	 * 	source: function () {
	 * 		console.log(`Hello, world!`);
	 * 	}
	 * });
	 */
	constructor(params: inputTask);
	/**
	 * @example
	 * // Shorter entry
	 * new Timeout(() => console.log(`Hello, world!`), 5 * 60 * 1000);
	 *
	 * // Also with the third argument, you can specify additional parameters
	 * // For example, now after completing a task, there will be an event about it
	 * new Timeout(() => console.log(`Hello, world!`), 5 * 60 * 1000, {
	 * 	inform: true
	 * });
	 */
	constructor(
		func: () => Promise<unknown> | unknown,
		ms: Date | number,
		params?: inputTask,
	);
	constructor(
		paramsOrFunction: inputTask | (() => Promise<unknown> | unknown),
		ms?: Date | number,
		additionalParams?: inputTask,
	) {
		if (typeof paramsOrFunction === "function") {
			if (
				(!paramsOrFunction && !ms) ||
				new Date(ms || "").toString() === "Invalid Date"
			) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
			}
			const TaskParams = Object.assign(
				{
					plannedTime: Date.now() + Number(ms),
					source: paramsOrFunction,
				},
				additionalParams || {},
			);
			super(TaskParams);
		} else {
			super(paramsOrFunction);
		}
	}
}

export default Timeout;
