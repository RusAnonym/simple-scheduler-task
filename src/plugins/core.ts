import { performance } from "perf_hooks";
import { logger, Events } from "./logger";
import { tasks } from "./tasks";
import { settings } from "./settings";
import {
	SchedulerTask,
	SchedulerConfig,
	SchedulerParseTask,
	SchedulerInformLog,
	SchedulerErrorLog,
} from "./types";

const config: SchedulerConfig = {
	type: `interval`,
	work: false,
	interval: null,
	intervalMS: 1000,
	reservedType: `scheduler_service_`,
	scheduledTasks: [],
};

const internal = {
	getRandomTaskID: async (): Promise<string> => {
		let chars: string = `defbca1234567890`;
		let taskID: string = ``;
		for (let i = 0; i < 16; i++) {
			taskID += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		let checkTaskID = await config.scheduledTasks.find((x) => x.id === taskID);
		if (!checkTaskID) {
			return taskID;
		} else {
			return await internal.getRandomTaskID();
		}
	},
	parseTask: async (task: SchedulerTask): Promise<SchedulerParseTask> => {
		let parseTaskData: SchedulerParseTask = {
			id: task.id,
			type: task.type,
			params: task.params,
			status: task.status,
			isInterval: task.isInterval,
			source: task.service.source,
		};
		if (task.isInterval) {
			parseTaskData = Object.assign(parseTaskData, {
				intervalData: {
					interval: task.service.intervalTime,
					triggeringQuantity: task.service.triggeringQuantity,
					remainingTriggers: task.service.remainingTriggers,
				},
			});
		}
		return parseTaskData;
	},
	executeTask: async (task: SchedulerTask): Promise<true> => {
		task.status = `works`;
		let startTaskTimeStamp: number = Number(new Date());
		let startExecute: number = performance.now();
		try {
			if (task.isInterval) {
				task.service.triggeringQuantity += 1;
				task.plannedTime = startTaskTimeStamp + task.service.intervalTime;
				task.service.remainingTriggers--;
				if (task.service.remainingTriggers > 0) {
					task.status = `awaiting`;
					if (config.type === `timeout`) {
						task.service.timeoutID = setTimeout(async () => {
							await internal.executeTask(task);
						}, task.plannedTime - Number(new Date()));
					}
				} else {
					task.status = `executed`;
				}
			} else {
				task.status = `executed`;
			}
			let data: any = await task.service.source();
			let endExecute: number = performance.now();
			if (task.service.inform === true) {
				let logData: SchedulerInformLog = {
					task: await internal.parseTask(task),
					response: data,
					executionTime: endExecute - startExecute,
				};
				logger.success(logData);
			}
			if (!task.params.service) {
				logger.text(`Executed task #${task.id}`);
			}
		} catch (error) {
			let endExecute: number = performance.now();
			if (task.service.inform === true) {
				let data: SchedulerErrorLog = {
					task: await internal.parseTask(task),
					error: error,
					executionTime: endExecute - startExecute,
				};
				logger.error(data);
			}
			if (!task.params.service) {
				logger.text(`Error executed task #${task.id}`);
			}
		}
		return true;
	},
	deleteTaskByID: async (taskID: string): Promise<true> => {
		let index = config.scheduledTasks.findIndex((x) => x.id === taskID);
		config.scheduledTasks.splice(index, 1);
		logger.text(`Delete task #${taskID}`);
		return true;
	},
	clearCompletedTasks: async (): Promise<true> => {
		async function deleteTask(task: SchedulerTask) {
			return await internal.deleteTaskByID(task.id);
		}
		const promises = config.scheduledTasks
			.filter((x) => x.status === `executed`)
			.map(deleteTask);
		await Promise.all(promises);
		logger.text(`Completed tasks deleted`);
		return true;
	},
	addTaskToCheckCompletedTask: async (): Promise<string> => {
		logger.text(`Included verification of completed tasks`);
		return await tasks.add({
			type: config.reservedType,
			params: {
				description: `checkCompletedTasks`,
				service: true,
			},
			isInterval: true,
			intervalTimer: 5000,
			code: async function () {
				await internal.clearCompletedTasks();
				logger.text(`Clear completed task`);
				return;
			},
			inform: false,
		});
	},
	clearTimeouts: async (): Promise<true> => {
		async function stopTimeout(task: SchedulerTask) {
			clearTimeout(task.service.timeoutID);
			return true;
		}
		const promises = config.scheduledTasks
			.filter((x) => x.service.timeoutID !== null)
			.map(stopTimeout);
		await Promise.all(promises);
		logger.text(`Clear timeouts`);
		return true;
	},
	runTimeouts: async (): Promise<true> => {
		async function startTimeout(task: SchedulerTask) {
			if (task.status === `awaiting` && task.service.timeoutID === null) {
				task.service.timeoutID = setTimeout(async () => {
					await internal.executeTask(task);
				}, task.plannedTime - Number(new Date()));
			}
			return true;
		}
		const promises = config.scheduledTasks.map(startTimeout);
		await Promise.all(promises);
		logger.text(`Run timeouts`);
		return true;
	},
	stopInterval: async (): Promise<boolean> => {
		if (config.work === false) return false;
		clearInterval(config.interval);
		config.interval = null;
		config.work = false;
		logger.text(`Interval stop`);
		return true;
	},
	startInterval: async (): Promise<boolean> => {
		if (config.work === true) return false;
		async function startTask(task: SchedulerTask) {
			if (
				Number(new Date()) >= task.plannedTime &&
				task.status === `awaiting`
			) {
				await internal.executeTask(task);
			}
			return true;
		}
		config.interval = setInterval(async () => {
			const promises = await config.scheduledTasks.map(startTask);
			await Promise.all(promises);
		}, config.intervalMS);
		config.work = true;
		logger.text(`Interval start`);
		return true;
	},
};

async function startSchedulerService() {}

export { config, internal, tasks, logger, Events, settings };
