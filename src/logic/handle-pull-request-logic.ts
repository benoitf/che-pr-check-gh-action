import { inject, injectable, postConstruct } from 'inversify';

import { AddCommentHelper } from '../helpers/add-comment-helper';
import { AddStatusCheckHelper } from '../helpers/add-status-check-helper';
import { Configuration } from '../api/configuration';
import { Logic } from '../api/logic';
import { PullRequestAction } from '../actions/pull-request-action';
import { WebhookPayloadPullRequest } from '@octokit/webhooks';

@injectable()
export class HandlePullRequestLogic implements Logic {
  public static readonly PR_EVENTS: string[] = ['opened', 'synchronize'];

  @inject(Configuration)
  private configuration: Configuration;

  @inject(PullRequestAction)
  private pullRequestAction: PullRequestAction;

  @inject(AddCommentHelper)
  private addCommentHelper: AddCommentHelper;

  @inject(AddStatusCheckHelper)
  private addStatusCheckHelper: AddStatusCheckHelper;

  // Add the given milestone
  @postConstruct()
  public setup(): void {
    const callback = async (payload: WebhookPayloadPullRequest): Promise<void> => {
      const prBranchName = payload.pull_request.head.ref;
      const repoUrl = payload.pull_request.head.repo.html_url;

      const targetUrl = `${this.configuration.cheInstance()}/f/?url=${repoUrl}/tree/${prBranchName}`;

      if (this.configuration.addComment()) {
        await this.handleComment(payload, targetUrl);
      }
      if (this.configuration.addStatus()) {
        await this.handleStatus(payload, targetUrl);
      }
    };

    this.pullRequestAction.registerCallback(HandlePullRequestLogic.PR_EVENTS, callback);
  }

  protected async handleComment(payload: WebhookPayloadPullRequest, targetUrl: string): Promise<void> {
    const comment = `Open Developer Workspace:\n[![Contribute](https://che.openshift.io/factory/resources/factory-contribute.svg)](${targetUrl})`;
    await this.addCommentHelper.addComment(comment, payload);
  }

  protected async handleStatus(payload: WebhookPayloadPullRequest, targetUrl: string): Promise<void> {
    await this.addStatusCheckHelper.addStatusCheck(
      'Open Cloud Developer Workspace',
      'che.openshift.io',
      targetUrl,
      payload
    );
  }
}
