/**
 * Set of parameters to create a task {@link inputTask}
 * @see inputTask
 */

export interface inputTask {
	/**
	 * The time when the task should be completed
	 */
	plannedTime: Date | number;
	/**
	 * Type of task, does not influence anything, but you can use it to get the list of tasks with the selected type
	 * @default missing
	 */
	type?: string;
	/**
	 * Additional parameters, to search tasks
	 * @default {}
	 */
	params?: Record<string, any>;
	/**
	 * Informing about finish/error after task execution
	 * @default false
	 */
	inform?: boolean;
	/**
	 * Whether the task is an interval
	 * @default false
	 */
	isInterval?: boolean;
	/**
	 * The interval interval in ms
	 * @default plannedTime-currentDate
	 */
	intervalTimer?: number;
	/**
	 * The number of times the interval will be triggered before it should end
	 * @default 0
	 */
	intervalTriggers?: number;
	/**
	 * Whether to save this task in automatic mode
	 * @default false
	 */
	backup?: boolean;
	/**
	 * Function to be executed
	 */
	source: () => void;
}

/**
 * Task Structure ({@link parseTask})
 * @see parseTask
 */
export interface parseTask {
	/**
	 * Unique task identifier
	 */
	id: string;
	/**
	 * Type of task
	 */
	type: string;
	/**
	 * Set of task parameters
	 */
	params: Record<string, any>;
	/**
	 * Current task status
	 */
	status: string;
	/**
	 * Informing about finish/error after task execution
	 */
	inform: boolean;
	/**
	 * This is the interval
	 */
	isInterval: boolean;
	/**
	 * Interval data, available only if isInterval = true
	 */
	intervalData?: {
		/**
		 * Endless interval
		 */
		infinityInterval: boolean;
		/**
		 * Number of interval triggers
		 */
		triggeringQuantity: number;
		/**
		 * Remaining actuations
		 */
		remainingTriggers: number;
	};
	/**
	 * Next task execution
	 */
	nextExecute: Date;
	/**
	 * The function the task should perform
	 */
	source: () => Promise<any> | any;
}

/**
 * Structure of the error log ({@link ErrorLog})
 * @see ErrorLog
 */
export interface ErrorLog {
	/**
	 * Task structure ({@link ParseTask})
	 */
	task: parseTask;
	/**
	 * Error structure
	 */
	error: Error;
	/**
	 * The number of milliseconds spent on the function
	 */
	executionTime: number;
}

/**
 * Structure of the task log ({@link SuccessLog})
 * @see SuccessLog
 */
export interface SuccessLog {
	/**
	 * Task structure ({@link ParseTask})
	 */
	task: parseTask;
	/**
	 * The value returned by the executed function
	 */
	response: any;
	/**
	 * The number of milliseconds spent on the function
	 */
	executionTime: number;
}
