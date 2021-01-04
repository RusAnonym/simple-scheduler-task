import { ITask, IParseTask } from "./../../types/tasks";
import { tasks } from "../core";
import { create, parseTask } from "../tasks";
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
 * new scheduler.tasks.Task({
 * 	plannedTime: Number(new Date()) + 5 * 60 * 1000,
 * 	source: function () {
 * 		console.log(`Hey`);
 * 	}
 * });
 */
class Task {
	/**
	 * This is task constructor
	 * @param {Object} params {@link inputTask}
	 */
	constructor(params: userTypes.inputTask) {
		const {
			plannedTime,
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTimer = Number(plannedTime) - Number(new Date()),
			intervalTriggers = 0,
			backup = false,
			source,
		} = params;

		if (
			!plannedTime ||
			!source ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		return create({
			plannedTime: Number(plannedTime),
			type: type,
			params: params.params || {},
			inform: inform,
			isInterval: isInterval,
			intervalTimer: intervalTimer,
			intervalTriggers: intervalTriggers,
			backup: backup,
			service: false,
			source: source,
		});
	}
}

/**
 * This is a function that adds a new task, analogous to new Task
 * @param {Object} params {@link inputTask}
 */
function add(params: userTypes.inputTask) {
	const {
		plannedTime,
		type = "missing",
		inform = false,
		isInterval = false,
		intervalTimer = Number(plannedTime) - Number(new Date()),
		intervalTriggers = 0,
		backup = false,
		source,
	} = params;

	if (
		!plannedTime ||
		!source ||
		new Date(plannedTime).toString() === "Invalid Date"
	) {
		throw new Error("One of the required parameters is missing or incorrect");
	}

	return create({
		plannedTime: Number(plannedTime),
		type: type,
		params: params.params || {},
		inform: inform,
		isInterval: isInterval,
		intervalTimer: intervalTimer,
		intervalTriggers: intervalTriggers,
		backup: backup,
		service: false,
		source: source,
	});
}

/**
 * Allows you to get a list of all scheduled tasks
 * @example
 * scheduler.task.getAllTasks(); // => Array with all tasks
 */
function getAllTasks(): IParseTask[] {
	return tasks.filter((task) => task.hidden !== true).map(parseTask);
}

/**
 * Allows you to get the task by its ID
 * @param {taskId} - ID of task
 */
function getTaskByID(taskId: string): IParseTask {
	let task = tasks.find((x) => x.id === taskId);
	if (!task) {
		throw new Error(`No task with this ID was found`);
	} else {
		return parseTask(task);
	}
}

/**
 * @param {Object} params - Set of parameters to filter tasks
 * @param {string} params.type - Type of task
 * @param {Object} params.params - Additional parameters, to search tasks
 */
function getFilterTasks(params: {
	type?: string;
	params?: Record<string, any>;
}) {
	let findTasks: ITask[] = [];
	if (params.type) {
		findTasks = tasks.filter((x) => x.type === params.type);
	}
	findTasks.length === 0 ? (findTasks = tasks) : null;
	if (params.params) {
		findTasks.filter((x) => x.params === params.params);
	}
	return findTasks.map(parseTask);
}

export { Task, add, getTaskByID, getAllTasks, getFilterTasks };
