const scheduler = require(`./out/cjs/main.js`);

new scheduler.Task({
	plannedTime: new Date(),
	source: function () {
		console.log(`Heyyy now`);
	},
});

new scheduler.Task({
	plannedTime: new Date(`2020-12-30T15:00:00`),
	source: function () {
		console.log(`Heyyy`);
	},
});

scheduler.settings.startInterval();
