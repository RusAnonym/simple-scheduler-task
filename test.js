/* eslint-disable */

const { Task, tasks } = require(`./dist/cjs/main.js`);

(async function () {
    console.log(new Task({ source: () => { console.log(`Using params`) }, plannedTime: 1000 }));
    console.log(new Task(() => console.log(`Using single`), 1000))
    console.log(tasks.add(() => console.log(`Tasks add using single`), 1000))
    console.log(tasks.add(({ source: () => { console.log(`Tasks add using params`) }, plannedTime: 1000 })))
})();