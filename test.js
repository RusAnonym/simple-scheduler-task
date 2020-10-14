const scheduler = require(`./lib/cjs/main.js`);

(async function () {
	console.log(
		await scheduler.core.tasks.add({
			plannedTime: Number(new Date()) + 10000,
			code: async function () {
				console.log(`Hello`);
			},
		}),
	);
})();
