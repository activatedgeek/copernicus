---
title: Knowledge Base Organization Philosophy
description: My core philosophy for pragmatic organization of knowledge.
date: Jul 4 2020, 11:14 -0700
area: phil
---

Personal knowledge organization is a very intimate choice. An alternate (admittedly fancy) expression I came across was _Digital garden_. Something
that works for one, may not work for another. Instead of providing a system, I'm going
meta - a system to think about knowledge organization. Outlining the key philosophical
principles allows clarity of thought. This document should prove helpful to anyone
who's scouring the internet for panacea.

To understand how to organize, we need to identify the key system elements. I stress a
lot on interoperability - our ability to avoid vendor lock-in and stay flexible
to adapt new systems to the content. This is in contrast to choices where one
would adapt content to systems and make migration hell. Along the way, we address
any crossroads that may pop up.

!> :information_source: A realization of this philosophy is outlined in [Elements of the Knowledge Base](/kb/elements-of-the-knowledge-base).

## Content

Everything starts with just raw letters and words and a single unit of content
would be a _text file_. This is _the_ source of truth for all content in the knowledge base.
Value is added to this content by applying appropriate transforms to this raw piece of text -
e.g. converting to HTML and styling with CSS for interactive web presentation, converting to
a PDF for static document exchange, categorizing in a navigation menu etc.
Starting with simple files allows extreme interoperability. In case a
better system becomes available in the future, files will be the least
painful to migrate. Of course, under this philosophy, the new system must operate
with files or else it wouldn't be better in the first place. This page itself
started as a simple text file.

### Metadata

Each unit of content needs associated _metadata_ - a simple key-value store
associated with the file. Metadata allows flexible configuration for the transforms
mentioned before. For instance, a system that allows date-based sorting can be
facilitated via metadata fields. Metadata should be stored within the
_text file_ for maximum portability and _atomicity_ of the content - everything
that one wants to know about the file is within the file. Further, allowing only
primitive values (text, integers and lists) in metadata maximizes portability. This
page has its own metadata for creation date, modified date, descriptions etc.

### Interaction

We need an interface to interact with the _text files_ and _metadata_.
Naturally, _text editors_ come to mind. A key principle to remember is that the
_text editor_ shouldn't dictate how the interaction happens. Its only purpose is
to facilitate the interaction and then move out of the way. Enforcing
this principle maximizes interoperability. In this spirit, stay away from
WYSIWYG editors and their enticing custom configurations when possible. It is
more distraction and less writing.

### Storage

A collection of such units of content need a _storage medium_. The storage medium
should have no bearing on the presentation of content to maximize interoperabilty.
_Storage medium_ should be strategically picked to optimize for ease of access and
flexibility of read/write operations. The good news is that the _filesystem_
on our computers is the best to work with _text files_. However, this is a good
place to start thinking about organization. A filesystem augmented with `git`
allows further goodies like tracking changes.

### Transformation

Arguably, the most popular format is Markdown which provides a reasonable hierarchy
for organizing text within the _unit of content_, our text file. This page was
itself written in markdown and subsequent transforms were applied for layouts
and styling.

## Navigation

_Navigation_ connects all units of content in a knowledge base. We realize the
greatest benefit from a knowledge base, when we are able to discover connections
between disparate items. This is _the_ purpose of this exercise.

Deliberately thinking about navigation while writing content also largely reduces
the need to have advanced search. Once we've semantically categorized knowledge,
random search queries play a less significant role. Search effectively becomes
a guided navigation than a haphazard spray of letters.

### Identification

Before anything else, the system needs a way to identify uniquely what to navigate
to. Each unit of content must be assigned a unique _identifier_. These allow us
to stay robust to pretty much all externalities. For instance, when using URLs,
_aliases_ can be utilized in the event of change of URLs.

Clearly, the _storage medium_ should not dictate the generation of identifiers.
Most static site generators rely heavily on this. Even the Apache Web Server
relied on this _anti-pattern_. I think this is reckless. Of course, I am guilty of
doing this multiple times in the past. Changing the storage medium or organization
within that shouldn't change identifiers.

### Clasification

Every unit of content should be assigned a primary _classification_. Indeed,
content may not be exclusive to a single class and can be easily
extended in _metadata_. To exponentiate capacity of any classification, it is
easy to introduce _sub-classification_. For instance, using 10 classifiers with
another 10 sub-classifiers within each already allows us a 100 classification
schemes. Going beyond these two levels may defeat the purpose and may not be
really needed. Remember everything is fluid. No unit of content
is ever complete and no organization will ever be enough.

Classifications should largely stay static. Sub-classifications however can be
_semi-fluid_. I say _semi-fluid_ to convey that we don't want an outpour of
sub-classes with every new unit of content. This forces us to rethink the semantics
of the knowledge we gather and stay organized.

### Overviews and Portals

Once we've written, stored and organized content, we need a systematic way to
surface _what we know_. It is easy for information to get stale.

Every _classification_ should be introduced via an _overview_ page. Think of this
as a meta-page contextualizing information within the class. The precise content is
of course subjective and can be presented in varied style. In addition, we want
to make sure everything under the classification is surfaced in a _list page_.
This list could also be a part of the _overview_ page and also contain any
_sub classification_.

Overview pages are a way to discover intra-class connections. Inter-class
connections should be surfaced in a _portal_ page. This is the place where we
realize connections between previously disparate pieces of information.

The concept of _overviews_ and _portals_ obviates the need to have an advanced
search system. Sophisticated linking between units of content and visually-appealing
graphs is largely a _good to have_ feature. Learning happens when one deliberately
contextualizes information and draws connections. Links are an effect of learning
and not the cause.

## Remarks

It is easy to fall into the trap of alternative systems. For instance, relying on
custom relational databases with all normalized column definitions and a content
management system on top. These cut away a lot of the writing and thinking time.
However, without doubt there is broader utility of such systems. Wikipedia couldn't
possibly be run using _text files_. We aren't trying to build _Wikipedia_ though,
are we?
