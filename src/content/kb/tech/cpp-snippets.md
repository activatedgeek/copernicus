---
title: C++ code snippets
description: C++ related quirks.
date: Oct 06 2020, 13:05 +0530
area: tech
---

## Finding the C++ standard from g++

Thanks to [this SO answer](https://stackoverflow.com/a/44735016/2425365),
one can find the C++ standard version supported by your `g++` binary
(this is _not_ the version of the compiler).

```shell
g++ -dM -E -x c++ /dev/null | grep -F __cplusplus
```

A hacky way to list all possible standard versions is to pass an invalid
`-std` flag. For instance,

```shell
g++ -std=foobar -dM -E -x c++ /dev/null | grep -F __cplusplus
```

Pick your favorite.

```shell
error: invalid value 'foobar' in '-std=foobar'
note: use 'c++98' or 'c++03' for 'ISO C++ 1998 with amendments' standard
note: use 'gnu++98' or 'gnu++03' for 'ISO C++ 1998 with amendments and GNU extensions' standard
note: use 'c++11' for 'ISO C++ 2011 with amendments' standard
note: use 'gnu++11' for 'ISO C++ 2011 with amendments and GNU extensions' standard
note: use 'c++14' for 'ISO C++ 2014 with amendments' standard
note: use 'gnu++14' for 'ISO C++ 2014 with amendments and GNU extensions' standard
note: use 'c++17' for 'ISO C++ 2017 with amendments' standard
note: use 'gnu++17' for 'ISO C++ 2017 with amendments and GNU extensions' standard
note: use 'c++2a' for 'Working draft for ISO C++ 2020' standard
note: use 'gnu++2a' for 'Working draft for ISO C++ 2020 with GNU extensions' standard
```
