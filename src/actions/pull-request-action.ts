import { WebhookPayloadPullRequest } from '@octokit/webhooks';

import { PullRequestListener } from '../api/pull-request-listener';
import { injectable } from 'inversify';

@injectable()
export class PullRequestAction implements PullRequestListener {
  private pulllRequesCallbacks: Map<string, Array<(payload: WebhookPayloadPullRequest) => Promise<void>>>;

  constructor() {
    this.pulllRequesCallbacks = new Map();
  }

  /**
   * Add the callback provided by given action name
   */
  registerCallback(events: string[], callback: (payload: WebhookPayloadPullRequest) => Promise<void>): void {
    events.forEach((eventName) => {
      if (!this.pulllRequesCallbacks.has(eventName)) {
        this.pulllRequesCallbacks.set(eventName, []);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pulllRequesCallbacks.get(eventName)!.push(callback);
    });
  }

  async execute(payload: WebhookPayloadPullRequest): Promise<void> {
    const eventName = payload.action;

    const callbacks = this.pulllRequesCallbacks.get(eventName);
    if (callbacks) {
      for await (const callback of callbacks) {
        callback(payload);
      }
    }
  }
}
