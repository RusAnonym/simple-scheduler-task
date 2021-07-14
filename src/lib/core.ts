import { ISchedulerConfig } from "./../types/scheduler";

class Scheduler {
	public config: ISchedulerConfig = {
		mode: "not_work",
		interval: null,
		intervalMS: 1000,
	};
}

const scheduler = new Scheduler();

export default scheduler;
