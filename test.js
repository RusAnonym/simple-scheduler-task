let array = [{ id: "test" }, { id: "test2" }];

const task = array.find((x) => x.id === "test2");

task.id = "hui";
console.log(array.indexOf(task));
