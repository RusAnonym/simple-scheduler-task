import { tasks, config } from "./core";
import * as TasksAPI from "./tasks";

function startInterval(): boolean {
	if (config.mode === "interval") {
		return false;
	} else {
		stopTimeout();
		config.interval = setInterval(() => {
			const now = Number(new Date());
			let maximalIndex = tasks.findIndex((x) => x.plannedTime > now);
			console.log(tasks);
			console.log(maximalIndex);
			for (let index = 0; index < maximalIndex; index++) {
				TasksAPI.execute(tasks[index]);
			}
		}, config.intervalMS);
		config.mode = "interval";
		return true;
	}
}

function startTimeout(): boolean {
	if (config.mode === "timeout") {
		return false;
	} else {
		stopTimeout();

		config.mode = "timeout";
		return true;
	}
}

function stopInterval(): boolean {
	if (config.mode === "interval" && config.interval !== null) {
		clearInterval(config.interval);
		return true;
	} else {
		return false;
	}
}

function stopTimeout(): boolean {
	if (config.mode === "timeout") {
		return true;
	} else {
		return false;
	}
}

export { startInterval, startTimeout, stopInterval, stopTimeout };
