import scheduler from "./lib/core";

import Task from "./lib/tasks/plugins/Task";
import Timeout from "./lib/tasks/plugins/Timeout";
import Interval from "./lib/tasks/plugins/Interval";

class Core {
	public Task = Task;
	public Timeout = Timeout;
	public Interval = Interval;

	public events = scheduler.logger;
	public settings = scheduler.settings;
}

export default new Core();

export { Task, Timeout, Interval };
