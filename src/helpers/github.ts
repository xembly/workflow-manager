import { context } from '@actions/github';

let [_, __, ...ref] = (context.payload.pull_request
	? context.payload.pull_request.head.ref
	: context.payload.workflow_run
		? context.payload.workflow_run.head_branch
		: context.ref
	).split('/');
export const refName = ref.join('/');

export const headSha = context.payload.pull_request
	? context.payload.pull_request.head.sha
	: context.payload.workflow_run
		? context.payload.workflow_run.head_sha
		: context.sha;
