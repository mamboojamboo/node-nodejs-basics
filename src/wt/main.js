import { Worker, workerData as wd} from 'worker_threads';
import {cpus} from 'os'

const promiseWorker = (workerData) => {
	return new Promise((resolve) => {
		const __filename = new URL('./worker.js', import.meta.url).pathname;
		const worker = new Worker(__filename, {
			workerData,
		});
		worker.on('message', result => {
			resolve({state: 'resolved', data: result})
		});
		worker.on('error', (wtf) => {
			console.log('wtf', wtf)
			resolve({state: 'error', data: null})
		});
	})
}

const performCalculations = async () => {
	const cpusNumber = cpus().length;
	const res = [];

	for (let id = 0; id < cpusNumber; id++) {
		res.push(promiseWorker(id + 10));
	};

	return Promise.all(res.map((worker) => worker))
		.then(console.log);
};

await performCalculations();