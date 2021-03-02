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
 *
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
	constructor(
		params: userTypes.inputTask | (() => Promise<unknown> | unknown),
		plannedTime?: Date | number,
	) {
		if (typeof params === "function") {
			if (
				(!params && !plannedTime) ||
				new Date(plannedTime || "").toString() === "Invalid Date"
			) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
			}

			this.TaskID = create({
				plannedTime: Number(plannedTime),
				type: "missing",
				params: {},
				inform: false,
				isInterval: false,
				intervalTimer: Number(plannedTime) - Number(new Date()),
				intervalTriggers: 0,
				service: false,
				source: params,
			});
		} else {
			const {
				plannedTime = new Date(),
				type = "missing",
				inform = false,
				isInterval = false,
				intervalTimer = Number(plannedTime) - Number(new Date()),
				intervalTriggers = 0,
				source,
			} = params;

			if (
				(!isInterval && !plannedTime) ||
				!source ||
				new Date(plannedTime).toString() === "Invalid Date"
			) {
				throw new Error(
					"One of the required parameters is missing or incorrect",
				);
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
 * This is a function that adds a new task, analogous to new Task
 * @param {Object} params {@link inputTask}
 */
const add = (
	params: userTypes.inputTask | (() => Promise<never> | never),
	plannedTime?: Date | number,
): string => {
	return new Task(params, plannedTime ? plannedTime : undefined).ID;
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

export { Task, add, getTaskByID, getAllTasks, getFilterTasks };
