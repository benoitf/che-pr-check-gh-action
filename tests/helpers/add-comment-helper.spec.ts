/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'reflect-metadata';

import { AddCommentHelper } from '../../src/helpers/add-comment-helper';
import { Container } from 'inversify';
import { Octokit } from '@octokit/rest';
import { WebhookPayloadPullRequest } from '@octokit/webhooks';

describe('Test Helper AddCommentHelper', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(AddCommentHelper).toSelf().inSingletonScope();
  });

  // check with label existing
  test('test call correct API', async () => {
    const octokit: any = { issues: { createComment: jest.fn() } };

    container.bind(Octokit).toConstantValue(octokit);
    const addCommentHelper = container.get(AddCommentHelper);

    const payload: WebhookPayloadPullRequest = {
      pull_request: {
        number: 123,
      },
      repository: {
        owner: {
          login: 'foo',
        },
        name: 'bar',
      },
    } as any;

    const comment = 'my-comment';

    await addCommentHelper.addComment(comment, payload);

    expect(octokit.issues.createComment).toBeCalled();
    const params: Octokit.IssuesCreateCommentParams = octokit.issues.createComment.mock.calls[0][0];

    expect(params.body).toBe(comment);
    expect(params.owner).toBe('foo');
    expect(params.repo).toBe('bar');
    expect(params.issue_number).toBe(123);
  });
});
