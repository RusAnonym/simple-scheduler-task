import { ITask, IParseTask } from "./../../types/tasks";
import { tasks } from "../core";
import { create, parseTask, execute } from "../tasks";
import * as userTypes from "./types";

/**
 * @module Tasks
 * @description Methods for interacting with tasks
 * @example
 * const scheduler = require(`simple-scheduler-task`);
 */

/**
 * @class
 * @classdesc This is a task constructor
 * @example
 * const { Task } = require(`simple-scheduler-task`);
 * // Outputs in 5 minutes to the console: "Hello, world!
 * new Task({
 * 	plannedTime: Number(new Date()) + 5 * 60 * 1000,
 * 	source: function () {
 * 		console.log(`Hey`);
 * 	}
 * });
 */

class Task {
	private TaskID: string;
	/**
	 * This is task constructor
	 * @param {Object} params {@link inputTask}
	 */
	constructor(params: userTypes.inputTask) {
		let { plannedTime = 0 } = params;
		const {
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTimer = 0,
			intervalTriggers = Infinity,
			source,
		} = params;

		if (
			(!isInterval && !plannedTime) ||
			!source ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		if (isInterval && plannedTime === 0) {
			plannedTime = Number(new Date()) + intervalTimer;
		}

		this.TaskID = create({
			plannedTime: Number(plannedTime),
			type: type,
			params: params.params || {},
			inform: inform,
			isInterval: isInterval,
			intervalTimer: intervalTimer,
			intervalTriggers: intervalTriggers,
			service: false,
			source: source,
		});
	}

	private get task(): ITask {
		const task = tasks.find((x) => x.id === this.TaskID);
		if (task) {
			return task;
		}
		throw new Error("Task not found");
	}

	/**
	 * Allows you to find out task data
	 */
	public get data(): IParseTask {
		return parseTask(this.task);
	}

	/**
	 * Allows you to know the task ID
	 */
	public get ID(): string {
		return this.TaskID;
	}

	/**
	 * Allows you to know the status of the task
	 */
	public get status(): string {
		return this.task.status;
	}

	/**
	 * Allows you to pause a task
	 */
	public pause(): void {
		this.task.status = "pause";
	}

	/**
	 * Allows you to resume the task
	 */
	public unpause(): void {
		this.task.status = "await";
	}

	/**
	 * Allows you to force the task
	 */
	public async execute(): Promise<void> {
		await execute(this.task);
	}
}

/**
 * @class
 * @classdesc This is a task constructor
 * @returns {Task} An instance of the Task class
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
 * // Shorter entry
 * new Timeout(() => console.log(`Hello, world!`), 5 * 60 * 1000);
 *
 * // Also with the third argument, you can specify additional parameters
 * // For example, now after completing a task, there will be an event about it
 * new Interval(() => console.log(`Hello, world!`), 5 * 60 * 1000, {
 * 	inform: true
 * });
 */
class Timeout extends Task {
	constructor(
		params: userTypes.inputTask | (() => Promise<unknown> | unknown),
		ms?: Date | number,
		additionalParams?: userTypes.inputTask,
	) {
		if (typeof params === "function") {
			if (
				(!params && !ms) ||
				new Date(ms || "").toString() === "Invalid Date"
			) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
			}
			const TaskParams = Object.assign(
				{
					plannedTime: Date.now() + Number(ms),
					source: params,
				},
				additionalParams,
			);
			super(TaskParams);
		} else {
			super(params);
		}
	}
}

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
	constructor(
		params: userTypes.inputTask | (() => Promise<unknown> | unknown),
		ms?: Date | number,
		additionalParams?: userTypes.inputTask,
	) {
		if (typeof params === "function") {
			const TaskParams = Object.assign(
				{
					plannedTime: Date.now() + Number(ms),
					isInterval: true,
					intervalTimer: Number(ms),
					source: params,
				},
				additionalParams,
			);
			super(TaskParams);
		} else {
			params.isInterval = true;
			super(params);
		}
	}
}

/**
 * This is a function that adds a new task, analogous to new Task
 * @param {Object} params {@link inputTask}
 */
const add = (params: userTypes.inputTask): string => {
	return new Task(params).ID;
};

/**
 * Allows you to get a list of all scheduled tasks
 * @example
 * scheduler.task.getAllTasks(); // => Array with all tasks
 */
const getAllTasks = (): IParseTask[] => {
	return tasks.filter((task) => task.hidden !== true).map(parseTask);
};

/**
 * Allows you to get the task by its ID
 * @param {taskId} - ID of task
 */
const getTaskByID = (taskId: string): IParseTask => {
	const task = tasks.find((x) => x.id === taskId);
	if (!task) {
		throw new Error(`No task with this ID was found`);
	} else {
		return parseTask(task);
	}
};

/**
 * @param {Object} params - Set of parameters to filter tasks
 * @param {string} params.type - Type of task
 * @param {Object} params.params - Additional parameters, to search tasks
 */
const getFilterTasks = (params: {
	type?: string;
	params?: Record<string, unknown>;
}): IParseTask[] => {
	let findTasks: ITask[] = [];
	if (params.type) {
		findTasks = tasks.filter((x) => x.type === params.type);
	}
	findTasks.length === 0 ? (findTasks = tasks) : null;
	if (params.params) {
		findTasks.filter((x) => x.params === params.params);
	}
	return findTasks.map(parseTask);
};

export {
	Task,
	Interval,
	Timeout,
	add,
	getTaskByID,
	getAllTasks,
	getFilterTasks,
};
