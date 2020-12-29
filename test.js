let arr = [];

const array = {
	insert: function (inputArray, index, element) {
		inputArray.splice(index, 0, element);
		return true;
	},
};

function getBetweenIndex(time) {
	let maximalIndex = arr.findIndex((x) => x.plannedTime >= time);
	maximalIndex === -1 ? (maximalIndex = arr.length) : null;
	console.log(maximalIndex);
	return maximalIndex;
}

let index = getBetweenIndex(5000);
array.insert(arr, index, { plannedTime: 50001 });
console.log(arr);
