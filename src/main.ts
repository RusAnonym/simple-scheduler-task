import scheduler from "./lib/core";

import Task from "./lib/tasks/plugins/Task";
import Timeout from "./lib/tasks/plugins/Timeout";

class Core {
	public Task = Task;
	public Timeout = Timeout;

	public events = scheduler.logger;
	public settings = scheduler.settings;
}

export default new Core();

export { Task, Timeout };
