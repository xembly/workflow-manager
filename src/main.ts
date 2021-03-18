import * as core from '@actions/core';

import { clean } from './clean';
import { cancelWorkflows } from './cancel-workflows'
import { runClean, runCancel } from './helpers/input';
import { refName } from './helpers/github';

if (runClean) clean()
	.then(() => core.info('Clean Complete.'))
	.catch(e => core.setFailed(e.message));

if (runCancel) cancelWorkflows()
	.then(() => core.info('Cancel Workflows Complete.'))
	.catch(e => core.setFailed(e.message));

// Exports a clean reference name based on the branch or tag that was referenced.
core.exportVariable('REF_NAME', refName);
