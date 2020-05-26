# Eclipse Che - Pull Request Github Action

This Github action will add comment and/or status check with a link to open this project on online Che instance.

#### Adding online link as PR check:
![PR Status Check](../images/status-check-highlight.png?raw=true)

#### Commenting Pull Request:
![PR Comment](../images/comment-pr.png?raw=true)


# Usage

```yaml
# Add Che link on PRs
name: che

on:
  pull_request: 
    types: [opened, synchronize]

jobs:
  add-link:
    runs-on: ubuntu-latest
    steps:
      - name: Eclipse Che Pull Request Link
        id: che-pr-check-gh-action
        uses: benoitf/che-pr-check-gh-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

# Scenarios

- [Add comment on pull requests](#add-comment-on-pull-requests)
- [Disable status check on pull requests](#disable-status-check-on-pull-requests)
- [Customize the link to online Eclipse Che instance](#customize-the-link-to-online-eclipse-che-instance)



## Add comment on pull requests

```yaml
- name: Eclipse Che Pull Request Check
  id: che-pr-check-gh-action
  uses: benoitf/che-pr-check-gh-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    add-comment: true
```

## Disable status check on pull requests

```yaml
- name: Eclipse Che Pull Request Check
  id: che-pr-check-gh-action
  uses: benoitf/che-pr-check-gh-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    add-status: false
```

## Customize the link to online Eclipse Che instance

```yaml
- name: Eclipse Che Pull Request Check
  id: che-pr-check-gh-action
  uses: benoitf/che-pr-check-gh-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    che-instance: https://my-online-eclipse-che-instance.com
```

