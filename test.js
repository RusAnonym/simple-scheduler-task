const scheduler = require(`./out/cjs/main.js`);

new scheduler.Task({
	plannedTime: new Date(),
	isInterval: true,
	intervalTimer: 1000,
	intervalTriggers: 10,
	source: function () {
		console.log(scheduler.settings.useInterval());
	},
});
