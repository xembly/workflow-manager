import * as core from '@actions/core';
import del from 'del';
import makeDir from 'make-dir';

import { isPost, rootDirectory, workspaceDirectory } from './helpers/state';
import { isVerbose } from './helpers/input';

export async function clean() {
	try {
		core.info('Cleaning: ' + rootDirectory);
		const paths = isPost
			? [ rootDirectory + '/**' ]
			: [
				rootDirectory + '/**',
				`!${rootDirectory}/_**`,
				`!${rootDirectory}/_**/**`,
			];
		const files = await del(paths, { force: true });
		if (isVerbose) core.info(`isPost: ${(isPost ? 'yes' : 'no')}`);
		if (isVerbose) core.info('Files: ' + JSON.stringify(files, null, '  '));
	} catch (error: any) {
		core.setFailed(error.message);
	}

	if (!isPost) {
		try {
			// need to rebuild workspace in pre-action
			core.info(`Rebuilding Workspace: ${workspaceDirectory}`);
			await makeDir(workspaceDirectory);
		} catch (error: any) {
			core.setFailed(error.message);
		}
	}
}
