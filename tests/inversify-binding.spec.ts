import 'reflect-metadata';

import { AddCommentHelper } from '../src/helpers/add-comment-helper';
import { AddStatusCheckHelper } from '../src/helpers/add-status-check-helper';
import { Analysis } from '../src/analysis';
import { Configuration } from '../src/api/configuration';
import { Container } from 'inversify';
import { HandlePullRequestLogic } from '../src/logic/handle-pull-request-logic';
import { Handler } from '../src/api/handler';
import { InversifyBinding } from '../src/inversify-binding';
import { Logic } from '../src/api/logic';
import { OctokitBuilder } from '../src/github/octokit-builder';
import { PullRequestAction } from '../src/actions/pull-request-action';
import { PullRequestHandler } from '../src/handler/pull-request-handler';
import { PullRequestListener } from '../src/api/pull-request-listener';
import { TemplateReader } from '../src/template/template-reader';

describe('Test InversifyBinding', () => {
  test('test bindings', async () => {
    const addComment = true;
    const addStatus = true;
    const cheInstance = 'https://foo.com';

    const inversifyBinding = new InversifyBinding('foo', addComment, addStatus, cheInstance);
    const container: Container = inversifyBinding.initBindings();

    expect(inversifyBinding).toBeDefined();

    // check all actions
    const pullRequestAction = container.get(PullRequestAction);
    expect(pullRequestAction).toBeDefined();
    const pullRequestListeners: PullRequestListener[] = container.getAll(PullRequestListener);
    expect(pullRequestListeners).toBeDefined();
    expect(pullRequestListeners.includes(pullRequestAction)).toBeTruthy();

    // Handler
    const handlers: Handler[] = container.getAll(Handler);
    expect(handlers.find((handler) => handler.constructor.name === PullRequestHandler.name)).toBeTruthy();

    // config
    const configuration: Configuration = container.get(Configuration);
    expect(configuration).toBeDefined();
    expect(configuration.addComment()).toEqual(addComment);
    expect(configuration.addStatus()).toEqual(addStatus);
    expect(configuration.cheInstance()).toEqual(cheInstance);

    // helpers
    expect(container.get(AddCommentHelper)).toBeDefined();
    expect(container.get(AddStatusCheckHelper)).toBeDefined();

    // template
    expect(container.get(TemplateReader)).toBeDefined();

    // logic
    const logics: Logic[] = container.getAll(Logic);
    expect(logics).toBeDefined();
    expect(logics.find((logic) => logic.constructor.name === HandlePullRequestLogic.name)).toBeTruthy();

    const octokitBuilder = container.get(OctokitBuilder);
    expect(octokitBuilder).toBeDefined();

    const analysis = container.get(Analysis);
    expect(analysis).toBeDefined();
  });
});
