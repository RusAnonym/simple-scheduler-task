/* eslint-disable */

const scheduler = require(`./dist/cjs/main.js`);

(async function () {
    scheduler.tasks.add({
        plannedTime: new Date()
    })
})();