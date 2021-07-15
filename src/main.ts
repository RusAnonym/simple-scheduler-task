import scheduler from "./lib/core";
import Task from "./lib/tasks/plugins/Task";

class Core {
	public Task = Task;

	public events = scheduler.logger;
	public settings = scheduler.settings;
}

export default new Core();

export { Task };
