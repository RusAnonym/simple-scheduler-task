import SchedulerTasks from "./tasks/core";
import SchedulerLogger from "./logger/core";
import SchedulerSettings from "./settings/core";

import { ISchedulerConfig } from "./../types/scheduler";

class Scheduler {
	public config: ISchedulerConfig = {
		mode: "not_work",
		interval: null,
		intervalMS: 1000,
	};

	public tasks = new SchedulerTasks();
	public logger = new SchedulerLogger();
	public settings = new SchedulerSettings();
}

const scheduler = new Scheduler();

export default scheduler;
