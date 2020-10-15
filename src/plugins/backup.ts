import { SchedulerTask, SchedulerBackupTask } from "./types";
import fs from "fs";
import path from "path";
import { config, internal } from "./core";

const backup = {
	run: async (): Promise<boolean> => {
		try {
			let mainDIR = require.main?.path;
			let backupDIR = mainDIR + config.backup.folder;
			for (let i in config.scheduledTasks) {
				let tempTask: SchedulerTask = config.scheduledTasks[i];
				if (tempTask.type !== config.reservedType && !tempTask.params.service) {
					let parseTaskToBackup: SchedulerBackupTask = {
						plannedTime: tempTask.plannedTime,
						id: tempTask.id,
						type: tempTask.type,
						params: tempTask.params,
						status: tempTask.status,
						isInterval: tempTask.isInterval,
						service: {
							timeoutID: tempTask.service.timeoutID,
							create: tempTask.service.create,
							intervalTime: tempTask.service.intervalTime,
							inform: tempTask.service.inform,
							triggeringQuantity: tempTask.service.triggeringQuantity,
							remainingTriggers: tempTask.service.remainingTriggers,
							endlessInterval:
								tempTask.isInterval &&
								tempTask.service.remainingTriggers === Infinity
									? true
									: false,
						},
					};
					fs.writeFileSync(
						backupDIR + tempTask.id + `.json`,
						JSON.stringify(parseTaskToBackup),
					);
					fs.writeFileSync(
						backupDIR + tempTask.id + `.js`,
						`module.exports = ` + tempTask.service.source.toString(),
					);
				}
			}
			return true;
		} catch (err) {
			return false;
		}
	},
	load: async (): Promise<boolean> => {
		try {
			let mainDIR = require.main?.path;
			let backupDIR = mainDIR + config.backup.folder;
			let tasksInDIR = fs
				.readdirSync(backupDIR)
				.filter((x) => path.extname(x) === `.json`);
			for (let i in tasksInDIR) {
				try {
					let taskScript = require(backupDIR +
						path.basename(tasksInDIR[i], `.json`) +
						`.js`);
					let pathToJSON = backupDIR + tasksInDIR[i];
					let BufferWithJSON = fs.readFileSync(pathToJSON);
					let task: SchedulerBackupTask = JSON.parse(BufferWithJSON.toString());
					let tempTask: SchedulerTask = {
						plannedTime: task.plannedTime,
						id: task.id,
						type: task.type,
						params: task.params,
						status: task.status,
						isInterval: task.isInterval,
						service: {
							timeoutID: task.service.timeoutID,
							create: task.service.create,
							intervalTime: task.service.intervalTime,
							source: taskScript,
							inform: task.service.inform,
							triggeringQuantity: task.service.triggeringQuantity,
							remainingTriggers:
								task.service.endlessInterval === true
									? Infinity
									: task.service.remainingTriggers,
						},
					};
					await internal.addBackUpTask(tempTask);
				} catch (err) {
					continue;
				}
			}
			return true;
		} catch (err) {
			return false;
		}
	},
	init: async (): Promise<boolean> => {
		try {
			let mainDIR = require.main?.path;
			let backupDIR = mainDIR + config.backup.folder;
			let checkDir = fs.existsSync(backupDIR);
			if (!checkDir) {
				fs.mkdirSync(backupDIR);
			}
			return true;
		} catch (err) {
			return false;
		}
	},
	// auto: {
	// 	setInterval: async (ms: number): Promise<true> => {
	// 		return true;
	// 	},
	// 	enable: async (): Promise<true> => {
	// 		return true;
	// 	},
	// 	disable: async (): Promise<true> => {
	// 		return true;
	// 	},
	// },
};

export { backup };
