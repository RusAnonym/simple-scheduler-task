import { tasks } from "../../core";
import { create, parseTask, execute, remove } from "../../tasks";
import { inputTask } from "../types";
import { ITask, IParseTask } from "../../../types/tasks";

/**
 * @class
 * @classdesc This is a task constructor
 * @returns {Task} An instance of the Task class
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
	constructor(params: inputTask) {
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

	/**
	 * Allows you to delete the task
	 */
	public delete(): void {
		remove(this.task);
	}

	/**
	 * Allows you to change the time of the next execution after creating a task
	 */
	public setPlannedTime(newPlannedTime: number): void {
		this.task.plannedTime = newPlannedTime;
	}
}

export default Task;
