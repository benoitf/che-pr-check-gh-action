# Eclipse Che - Pull Request Github Action

This Github action will add comment and/or status check with a link to open this project on online Che instance.



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
      - name: Eclipse Che Pull Request Check
        id: che-pr-check-gh-action
        uses: benoitf/che-pr-check-gh-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```


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

