import scheduler from "../core";

class SchedulerSettings {
	public useInterval(): void {
		if (scheduler.config.mode === "interval") {
			return;
		} else {
			scheduler.config.mode = "interval";
			scheduler.tasks.clearTimeouts();
			scheduler.config.interval = setInterval(() => {
				scheduler.tasks.executeOutdatedTasks();
				scheduler.tasks.sort();
			}, scheduler.config.intervalMS);
			return;
		}
	}
	public useTimeouts(): void {
		if (scheduler.config.mode === "timeout") {
			return;
		} else {
			scheduler.config.mode = "timeout";
			if (scheduler.config.interval !== null) {
				clearInterval(scheduler.config.interval);
			}
			scheduler.tasks.setTimeouts();
		}
	}
}

export default SchedulerSettings;
