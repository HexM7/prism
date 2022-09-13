/**
 * @typedef {() => (void | Promise<void>)} Task
 */

/**
 * @param {string} name
 * @param {Task} task
 * @returns {Task}
 */
function wrapTask(name, task) {
	return async function $() {
		console.log(`[Starting: ${name}]`);
		const start = Date.now();
		await task();
		const duration = (Date.now() - start) / 1000;
		console.log(`[Done: ${name} (${duration.toFixed(2)}s)]`);
	};
}

/**
 * @param {Task} task
 * @returns {Task}
 */
function wrapUnnamedTask(task) {
	const name = task.name;
	if (!name.startsWith('$')) {
		task = wrapTask(name, task);
	}
	return task;
}

/**
 * @param {Task[]} tasks
 * @returns {Task}
 */
export function series(...tasks) {
	return async function $() {
		for (const task of tasks.map(wrapUnnamedTask)) {
			await task();
		}
	};
}

/**
 * @param {Task[]} tasks
 * @returns {Task}
 */
export function parallel(...tasks) {
	return async function $() {
		await Promise.all(tasks.map(async (task) => {
			await wrapUnnamedTask(task)();
		}));
	};
}

/**
 * @param {Partial<Record<string, Task>>} tasks
 */
export function run(tasks) {
	// eslint-disable-next-line no-undef
	const selected = String(process.argv[2]);
	const task = tasks[selected];
	if (!task) {
		console.error(`No such task ${selected}. Available tasks: ${Object.keys(tasks).join(', ')}`);
	} else {
		const namedTask = wrapTask(selected, task);
		Promise.resolve().then(() => namedTask()).catch(
			(reason) => {
				console.error('Error:');
				console.error(reason);
			}
		);
	}
}
