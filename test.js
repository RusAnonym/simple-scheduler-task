const scheduler = require(`./out/cjs/main.js`);

new scheduler.tasks.Task({
	plannedTime: new Date(),
	isInterval: true,
	intervalTimer: 1000,
	intervalTriggers: 10,
	inform: true,
	source: function () {
		console.log(`Hello from ${new Date()}`);
		return new Date();
	},
});

scheduler.events.on("executions", function (data) {
	console.log(data);
});
