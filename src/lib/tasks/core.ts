import { ISchedulerTaskInfo } from "./../../types/tasks";

class SchedulerTask {
	public info: ISchedulerTaskInfo;

	constructor(task: ISchedulerTaskInfo) {
		this.info = task;
	}

	// public async execute(): Promise<void> {
	// 	const currentDate = new Date();
	// 	this.info.status = "executed";
	// 	if (!this.info.interval.isNextExecutionAfterDone) {
	// 		this.info.plannedTime = Number(currentDate) + this.info.interval.time;
	// 	}

	// 	return;
	// }
}

class SchedulerTasks {
	public list: SchedulerTask[] = [];
}

export default SchedulerTasks;
