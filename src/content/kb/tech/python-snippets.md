---
title: Python code snippets
date: Aug 27 2020, 17:02 +0530
area: tech
---

## Debugging

[`pdb`](https://docs.python.org/3/library/pdb.html) should be the tool for
usual debugging in Python. However, segmentation faults (SIGSEGV) cannot
be handled by `pdb`. Use `gdb` instead as

```shell
(gdb) file python
(gdb) run file.py [args]
```
