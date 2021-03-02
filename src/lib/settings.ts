import { tasks, config } from "./core";
import * as TasksAPI from "./tasks";

const startInterval = (): boolean => {
	if (config.mode === "interval") {
		return false;
	} else {
		stopTimeout();
		config.interval = setInterval(() => {
			const now = Number(new Date());
			const maximalIndex = tasks.findIndex((x) => x.plannedTime > now);
			if (maximalIndex === -1) {
				tasks.map((task) => {
					if (now >= task.plannedTime && task.status === "await") {
						TasksAPI.execute(task);
					}
				});
			} else {
				for (let index = 0; index < maximalIndex; ++index) {
					tasks[index].status === "await"
						? TasksAPI.execute(tasks[index])
						: null;
				}
			}
		}, config.intervalMS);
		config.mode = "interval";
		return true;
	}
};

const startTimeout = (): boolean => {
	if (config.mode === "timeout") {
		return false;
	} else {
		stopInterval();
		config.mode = "timeout";
		for (const task of tasks) {
			if (task.plannedTime < Number(new Date())) {
				TasksAPI.execute(task);
			} else {
				task.service.timeoutID = setTimeout(() => {
					TasksAPI.execute(task);
				}, task.plannedTime - Number(new Date()));
			}
		}
		return true;
	}
};

const stopInterval = (): boolean => {
	if (config.mode === "interval" && config.interval !== null) {
		clearInterval(config.interval);
		return true;
	} else {
		return false;
	}
};

const stopTimeout = (): boolean => {
	if (config.mode === "timeout") {
		for (const task of tasks) {
			if (task.service.timeoutID !== null) {
				clearTimeout(task.service.timeoutID);
				task.service.timeoutID = null;
			}
		}
		return true;
	} else {
		return false;
	}
};

export { startInterval, startTimeout, stopInterval, stopTimeout };
