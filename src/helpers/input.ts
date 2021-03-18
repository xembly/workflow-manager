import * as core from '@actions/core';

/**
 * Outputs addition logs during execution.
 */
export const isVerbose = core.getInput('verbose') === 'true';

const run = (core.getInput('run') || 'clean, cancel')
	.trim()
	.toLowerCase()
	.split(/\s*,\s*/);

/**
 * Denotes if the clean action should be run.
 */
export const runClean = run.indexOf('clean') !== -1;

/**
 * Denotes if the cancel workflow action should be run.
 */
export const runCancel = run.indexOf('cancel') !== -1;

/**
 * The GitHub personal access token. Required only if cancel runner.
 */
export const token = core.getInput('token', { required: runCancel });
