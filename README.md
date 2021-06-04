# Workflow Manager : A GitHub Action

A helper action that can manage self hosted runner cleanup and workflow cancellations.

- `Clean Workspace`: Removes any old workspace files and directories while leaving runner cache intact.

- `Cancel Workflows`: Cancels any previous runs that are not `completed` for the current workflow.

## Usage

### Prerequisites
- A workflow `.yaml|.yml` file in your repositories `.github/workflows` directory. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).
- The action _**MUST**_ be the first step inside each job. If you place it after another step, it will not function correctly.

  ```yaml
  ...
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: xembly/workflow-manager@v1
        # other steps
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: xembly/workflow-manager@v1
        # other steps
  ...
  ```

### Inputs
- `token`: Your GitHub API token. Recommended to use `${{ secrets.GITHUB_TOKEN }}` _**[required only if cancel option specified]**_
- `run`: A comma separated list of helper functions to run. Valid options are: `clean`, `cancel`. Default: `clean`
- `verbose`: Outputs addition logs during execution. Default: `false`

### Outputs
- `REF_NAME`: The branch or tag name if ref is from a tag push. (this is set as an environment variable)

### Example Usage

```yaml
uses: xembly/workflow-manager@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Github Actions, you do not need to create your own token
  run: clean, cancel  # Optional, Default: clean
  verbose: true # Optional, Default: false
```
