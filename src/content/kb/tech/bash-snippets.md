---
title: Bash code snippets
date: Jul 5 2020, 15:29 -0700
updated: May 3 2021, 17:09 +0530
area: tech
---

## Articles

- [Bash Pitfalls](https://mywiki.wooledge.org/BashPitfalls)

## Snippets

### Script Directory

To get the absolute path to directory in which the bash script resides

```bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
```

### Multiline strings

Always forgetting this very important utility.

```bash
strvar=$(cat << EOF

# all content goes here, bash variables work.

EOF
)
```

To directly put the output into a file

```bash
cat << EOF > /path/to/file

# all content goes here, bash variables work.

EOF
)
```
