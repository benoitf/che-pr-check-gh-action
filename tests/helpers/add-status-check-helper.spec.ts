/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'reflect-metadata';

import { AddStatusCheckHelper } from '../../src/helpers/add-status-check-helper';
import { Container } from 'inversify';
import { Octokit } from '@octokit/rest';
import { WebhookPayloadPullRequest } from '@octokit/webhooks';

describe('Test Helper AddCommentHelper', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind(AddStatusCheckHelper).toSelf().inSingletonScope();
  });

  // check with label existing
  test('test call correct API', async () => {
    const octokit: any = { repos: { createStatus: jest.fn() } };

    container.bind(Octokit).toConstantValue(octokit);
    const addStatusCheckHelper = container.get(AddStatusCheckHelper);

    const payload: WebhookPayloadPullRequest = {
      pull_request: {
        head: {
          sha: 456,
        },
        number: 123,
      },
      repository: {
        owner: {
          login: 'foo',
        },
        name: 'bar',
      },
    } as any;

    const description = 'my-desc';
    const context = 'my-context';
    const targetUrl = 'https://foobar.com';

    await addStatusCheckHelper.addStatusCheck(description, context, targetUrl, payload);

    expect(octokit.repos.createStatus).toBeCalled();
    const params: Octokit.ReposCreateStatusParams = octokit.repos.createStatus.mock.calls[0][0];

    expect(params.description).toBe(description);
    expect(params.target_url).toBe(targetUrl);
    expect(params.context).toBe(context);
    expect(params.owner).toBe('foo');
    expect(params.repo).toBe('bar');
    expect(params.sha).toBe(456);
    expect(params.state).toBe('success');
  });
});
