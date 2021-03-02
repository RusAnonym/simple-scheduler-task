import * as core from "./lib/core";

const settings = core.settings;
const tasks = core.TasksAPI;
const events = core.Events;
const TaskConstructor = core.TasksAPI.Task;

export { settings, tasks, events, TaskConstructor as Task };
