import * as core from '@actions/core';
import * as github from '@actions/github';

import { refName, headSha } from './helpers/github';
import { token, isVerbose } from './helpers/input';

export async function cancelWorkflows() {
	const { eventName, sha, repo: { owner, repo } } = github.context;
	const { GITHUB_RUN_ID } = process.env;

	if (isVerbose) core.info(JSON.stringify({ eventName, sha, headSha, refName, owner, repo, GITHUB_RUN_ID }, null, '  '));

	const octokit = github.getOctokit(token);
	const { data: current_run } = await octokit.actions.getWorkflowRun({
		owner,
		repo,
		run_id: Number(GITHUB_RUN_ID)
	});
	const workflow_id = String(current_run.workflow_id);
	if (isVerbose) core.info(`Found workflow_id: ${workflow_id}`);

	try {
		const { data } = await octokit.actions.listWorkflowRuns({
			owner,
			repo,
			// @ts-ignore
			workflow_id,
			refName,
		});

		const branchWorkflows = data.workflow_runs.filter(run => run.head_branch === refName);
		core.info(`Found ${branchWorkflows.length} runs for workflow ${workflow_id} from ref ${refName}`);
		core.info(branchWorkflows.map(run => `- ${run.html_url}`).join('\n'));

		const runningWorkflows = branchWorkflows.filter(run =>
			run.head_sha !== headSha &&
			run.status !== 'completed' &&
			new Date(run.created_at) < new Date(current_run.created_at)
		);
		core.info(`with ${runningWorkflows.length} runs to cancel.`);

		await Promise.all(runningWorkflows.map(async ({id, head_sha, status, html_url}) => {
			if (isVerbose) core.info('Canceling run: ' + JSON.stringify({id, head_sha, status, html_url}));
			return octokit.actions.cancelWorkflowRun({
				owner,
				repo,
				run_id: id
			});
		}));
	} catch (e) {
		const msg = e.message || e;
		core.warning(`Error while canceling workflow_id ${workflow_id}: ${msg}`);
	}
}
