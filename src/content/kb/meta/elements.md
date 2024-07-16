---
title: Elements of the Knowledge Base
description: Description of how content is organized around.
date: Jul 9 2020, 16:22 -0700
updated: Jun 29 2021, 11:24 +0530
area: meta
---

This website is an organization of all my knowledge. With the growing collection
of information, I've realized that I need a system to make sure it doesn't become
a large disconnected pile of text. Organizing also keeps the learning disciplined.
Albeit, content organization is tricky. Organizing too little is as good as nothing
and organizing too much becomes an categorization hell.

!> :information_source: I recommend my [knowledge organization philosophy](/kb/knowledge-base-organization-philosophy) to set the right context before reading further.

This post is about how I realize the philosophy. First things first - everything
starts as a text. For atomicity, the same text file contains _frontmatter_
which contains some basic details - title, description, creation and
modified date. Often times, I also commit posts in progress which I note as a
_draft_ boolean variable in the frontmatter. Other old posts which I think may
render inaccurately in some respects but still deserve to stay, are marked with
the _archive_ boolean variable. They are accompanied with a message on the top.

For categorization, I was inspired by the [Johnny Decimal system](/kb/johnny-decimal).
The system seems to be rather developed to organizes files and folders. I
repurpose it. Every page in the knowledge base is assigned
to a primary _area_ and _category_. For instance, this page is filed under area
"Meta" and category "System". This should be surfaced somewhere on this page
which is hopefully not too hard to find. All areas and categories are defined in
an [_orgsys_ file](https://github.com/activatedgeek/www/blob/main/api/cms.js#L9) and specified for every file in the _frontmatter_. Under the
`git` file system, all post files are organized in a two-level deep tree of
short codes for respective primary areas and categories.

Every post is assigned a friendly url transform of the title. Of course, the
assumption here is that no two posts will have the same title. I think that's a
reasonable assumption and forces me to disambiguate semantics in the title itself.
This also keeps things robust to any re-organization I might like on the file
system later. In case I wish to change the title, I provide a list of old redirect
urls in the file metadata (_frontmatter_). Conforming to the philosophy, none of
this is influenced by characteristics of the file system - the file name or
organization under a folder.

Pretty simple. The specific software to implement this is summarized in
[the stack](/kb/the-stack). Go visit my [knowledge Bayes](/kb).
