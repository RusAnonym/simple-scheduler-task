const array = {
	insert: function (inputArray: any[], index: number, element: any) {
		let outputArray = inputArray.concat();
		outputArray.splice(index, 0, element);
		return outputArray;
	},
};
