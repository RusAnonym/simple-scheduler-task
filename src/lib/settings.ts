import core from "./core";

class SchedulerSettings {
	public useInterval(): boolean {
		if (core.config.mode === "interval") {
			return false;
		} else {
			this.stopTimeouts();
			core.config.interval = setInterval(() => {
				const now = Number(new Date());
				const maximalIndex = core.tasks.list.findIndex(
					(x) => x.plannedTime > now,
				);
				if (maximalIndex === -1) {
					core.tasks.list.map((task) => {
						if (now >= task.plannedTime && task.status === "await") {
							core.tasks.execute(task);
						}
					});
				} else {
					for (let index = 0; index < maximalIndex; ++index) {
						core.tasks.list[index].status === "await"
							? core.tasks.execute(core.tasks.list[index])
							: null;
					}
				}
			}, core.config.intervalMS);
			core.config.mode = "interval";
			return true;
		}
	}

	public stopInterval(): boolean {
		if (core.config.mode === "interval" && core.config.interval !== null) {
			clearInterval(core.config.interval);
			return true;
		} else {
			return false;
		}
	}

	public useTimeouts(): boolean {
		if (core.config.mode === "timeout") {
			return false;
		} else {
			this.stopInterval();
			core.config.mode = "timeout";
			for (const task of core.tasks.list) {
				if (task.plannedTime < Number(new Date())) {
					core.tasks.execute(task);
				} else {
					task.service.timeoutID = setTimeout(() => {
						core.tasks.execute(task);
					}, task.plannedTime - Number(new Date()));
				}
			}
			return true;
		}
	}

	public stopTimeouts(): boolean {
		if (core.config.mode === "timeout") {
			for (const task of core.tasks.list) {
				if (task.service.timeoutID !== null) {
					clearTimeout(task.service.timeoutID);
					task.service.timeoutID = null;
				}
			}
			return true;
		} else {
			return false;
		}
	}
}

export default SchedulerSettings;
