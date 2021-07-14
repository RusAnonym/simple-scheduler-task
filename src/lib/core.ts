import SchedulerTasks from "./tasks";

import { ISchedulerConfig } from "./../types/scheduler";

class Scheduler {
	public config: ISchedulerConfig = {
		mode: "not_work",
		interval: null,
		intervalMS: 1000,
	};

	public tasks = new SchedulerTasks();
}

const scheduler = new Scheduler();

export default scheduler;
