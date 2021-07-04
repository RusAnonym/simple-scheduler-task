import Task from "./Task";
import { IInputTask } from "../types";

/**
 * @class
 * @classdesc This is a interval constructor
 * @returns {Task} An instance of the Task class
 * @example
 * const { Interval } = require(`simple-scheduler-task`);
 * // It will output every 5 minutes: "Hello, world!"
 * new Interval({
 *  intervalTimer: 5 * 60 * 1000,
 * 	source: function () {
 * 		console.log(`Hello, world!`);
 * 	}
 * });
 *
 * // Shorter entry
 * new Interval(() => console.log(`Hello, world!`), 5 * 60 * 1000);
 *
 * // Also with the third argument, you can specify additional parameters
 * // For example, now the interval will be executed 10 times and deleted
 * new Interval(() => console.log(`Hello, world!`), 5 * 60 * 1000, {
 * 	intervalTriggers: 10
 * });
 */
class Interval extends Task {
	/**
	 * @example
	 * const { Interval } = require(`simple-scheduler-task`);
	 * //  It will output every 5 minutes: "Hello, world!"
	 * new Interval({
	 * 	plannedTime: Date.now() + 5 * 60 * 1000,
	 * 	source: function () {
	 * 		console.log(`Hello, world!`);
	 * 	}
	 * });
	 */
	constructor(params: IInputTask);
	/**
	 * @example
	 * // Shorter entry
	 * new Interval(() => console.log(`Hello, world!`), 5 * 60 * 1000);
	 *
	 * // Also with the third argument, you can specify additional parameters
	 * // For example, now after completing a task, there will be an event about it
	 * new Interval(() => console.log(`Hello, world!`), 5 * 60 * 1000, {
	 * 	inform: true
	 * });
	 */
	constructor(
		func: () => Promise<unknown> | unknown,
		ms: Date | number,
		params?: IInputTask,
	);
	constructor(
		paramsOrFunction: IInputTask | (() => Promise<unknown> | unknown),
		ms?: Date | number,
		additionalParams?: IInputTask,
	) {
		if (typeof paramsOrFunction === "function") {
			const TaskParams = Object.assign(
				{
					plannedTime: Date.now() + Number(ms),
					isInterval: true,
					intervalTimer: Number(ms),
					source: paramsOrFunction,
				},
				additionalParams || {},
			);
			super(TaskParams);
		} else {
			paramsOrFunction.isInterval = true;
			super(paramsOrFunction);
		}
	}
}

export default Interval;
