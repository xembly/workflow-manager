import * as core from '@actions/core'
import { resolve } from 'path';

/**
 * Indicates whether the POST action is running
 */
export const isPost = core.getState('isPost') === 'true';

/**
 * The executing directory for the current workspace.
 */
export const workspaceDirectory = process.env['GITHUB_WORKSPACE']!;  // tslint:disable-line:no-string-literal

/**
 * The root '_work' directory of the runner.
 */
export const rootDirectory = resolve(workspaceDirectory, '..', '..');

// Publish a variable so that when the POST action runs, it can determine it should run the cleanup logic.
// This is necessary since we don't have a separate entry point.
if (!isPost) {
	core.saveState('isPost', 'true');
}
