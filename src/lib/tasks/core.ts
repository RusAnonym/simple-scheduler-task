import scheduler from "../core";

import { ISchedulerTaskInfo, IParseTask } from "./../../types/tasks";

class SchedulerTask {
	public info: ISchedulerTaskInfo;

	constructor(task: ISchedulerTaskInfo) {
		this.info = task;
		scheduler.tasks.list.push(this);
	}

	public async execute(): Promise<void> {
		return;
	}

	public get parseTask(): IParseTask {
		return {
			id: this.info.id,
			type: this.info.type,
			params: this.info.params,
			status: this.info.status,
			nextExecute: new Date(this.info.plannedTime),
			created: this.info.created,
			isInform: this.info.isInform,
			isInterval: this.info.interval.is,
			source: this.info.source,
		};
	}
}

class SchedulerTasks {
	public list: SchedulerTask[] = [];
}

export default SchedulerTasks;
