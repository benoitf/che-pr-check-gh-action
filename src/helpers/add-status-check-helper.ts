import { inject, injectable } from 'inversify';

import { Octokit } from '@octokit/rest';
import { WebhookPayloadPullRequest } from '@octokit/webhooks';

@injectable()
export class AddStatusCheckHelper {
  @inject(Octokit)
  private octokit: Octokit;

  public async addStatusCheck(
    description: string,
    context: string,
    targetUrl: string,
    payload: WebhookPayloadPullRequest
  ): Promise<void> {
    const statusParams: Octokit.ReposCreateStatusParams = {
      repo: payload.repository.name,
      owner: payload.repository.owner.login,
      sha: payload.pull_request.head.sha,
      state: 'success',
      description: description,
      context: context,
      // eslint-disable-next-line @typescript-eslint/camelcase
      target_url: targetUrl,
    };

    this.octokit.repos.createStatus(statusParams);
  }
}
