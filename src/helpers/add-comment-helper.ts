import { inject, injectable } from 'inversify';

import { Octokit } from '@octokit/rest';
import { WebhookPayloadPullRequest } from '@octokit/webhooks';

@injectable()
export class AddCommentHelper {
  @inject(Octokit)
  private octokit: Octokit;

  public async addComment(comment: string, payload: WebhookPayloadPullRequest): Promise<void> {
    const createCommentParams: Octokit.IssuesCreateCommentParams = {
      body: comment,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: payload.pull_request.number,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
    };

    this.octokit.issues.createComment(createCommentParams);
  }
}
