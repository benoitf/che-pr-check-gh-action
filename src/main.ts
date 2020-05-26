import * as core from '@actions/core';
import * as github from '@actions/github';

import { Analysis } from './analysis';
import { InversifyBinding } from './inversify-binding';

export class Main {
  public static readonly GITHUB_TOKEN: string = 'github-token';
  public static readonly ADD_COMMENT: string = 'add-comment';
  public static readonly ADD_STATUS: string = 'add-status';
  public static readonly CHE_INSTANCE: string = 'che-instance';

  protected async doStart(): Promise<void> {
    // github write token
    const githubToken = core.getInput(Main.GITHUB_TOKEN, { required: true });
    if (!githubToken) {
      throw new Error(`No Github Token provided (${Main.GITHUB_TOKEN})`);
    }

    let addComment = core.getInput(Main.ADD_COMMENT);
    if (!addComment) {
      addComment = 'false';
    }

    let addStatus = core.getInput(Main.ADD_STATUS);
    if (!addStatus) {
      addStatus = 'true';
    }

    let cheInstance = core.getInput(Main.CHE_INSTANCE);
    if (!cheInstance) {
      cheInstance = 'https://che.openshift.io';
    }

    const inversifyBinbding = new InversifyBinding(
      githubToken,
      addComment === 'true',
      addStatus === 'true',
      cheInstance
    );
    const container = inversifyBinbding.initBindings();
    const analysis = container.get(Analysis);
    await analysis.analyze(github.context);
  }

  async start(): Promise<boolean> {
    try {
      await this.doStart();
      return true;
    } catch (error) {
      core.setFailed(error.message);
      return false;
    }
  }
}
