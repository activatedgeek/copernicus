---
title: The Ultimate Guide to Building Cloud Applications
description: Revisiting basic principles to engineer products
date: Oct 24 2015, 00:27 +0530
area: tech
redirectsFrom:
  - /blog/cloud-app-guides/1
---

?> :warning: This post is archived.

The landscape of applications is an ever-expanding one from desktop to web to mobile.
With increasing popularity, a torrent of new development and automation tools are
popping in which are making the lives of developers blissful. It has also introduced
a new perplexities of choice between a new (flashy) tool because one is excited
and a battle-tested tool that you’ve got experience with (nil for a newbie). Among
all the automations and increasing levels of abstraction, a lot of fundamentals
are being obscured from the developer. What is left for a developer is just one
click of a button and automagically, everything is setup.

This article is a collection of highly opinionated principles and philosophies
around the lifecycle of a system and the thought process behind the engineering
decisions needed to make in today’s world of highly complex systems. It is a
refresher for the principles we’ve always known, mixed with new age requirements
and philosophies. So stop being the lazy developer you’ve become and be the
pragmatic engineer.

---

_WAIT! If you are looking for a tutorial on how to orchestrate things in a real
production environment, this is not the right place. Those will follow._

---

## Don’t Build for Scale

That’s right! Don’t try to achieve scale. While it may seem to be a contrarian
thought among all the noise about cloud systems but this is one single fact that
can help you achieve scale. To understand in terms of mathematical induction,

> Build for the base case, iterate for scale, restart for greater scale.

More concretely, if you are building a CRUD system, build the best on a single
machine and scale one machine at a time. When building a chat system, build the
best for two users and scale each user at a time. When building a distributed
database system, build the most efficient distributed database for two systems,
and scale them into a ring.

## Build Stateless

Given the minimal set of resources and context, does your application survive the
litmus test? That is what stateless is all about. An application should come with
it’s own batteries and make the least number of assumptions.

> Applications should be context free, configuration based.

This helps achieve two things — **_minimized side effects and maximized flexibility_**.
The former helps maximize development and debugging (in case you were still lazy
enough to leave that bug) velocity. The latter helps achieve a varied application
behaviors with a minimal configuration set.

## Single Source of Truth

Considering today’s highly distributed systems, it is very easy to loose consistency
across systems. Inconsistency could show itself in the form of inconsistent code
design patterns, inconsistent multi-machine behavior due to state mismatch across
machines or database inconsistencies due to network latencies. Such inconsistencies
compound over time if not taken care of, from day one.

> All systems must listen to one true master.

In more practical terms, a master machine (which itself could have redundant
deployments) should be the orchestrator of your infrastructure. It should always
persist the configuration for each moving part of your behemoth. On any changes
to the master, each service must obediently conform to the new configuration
(ideally in real time).

## Build maintainable and predictable systems

Predictability ensures replicability. I am an advocate of great code quality. If
you don’t write code conforming to standards (industry or even in house!), you
have failed as a developer.

> Don’t take your system to the grave.

If you can’t write code that your fellow developers and future contributors cannot
understand, you are the bug in the application’s lifetime which will never be fixed.
Code obfuscation is the root of all bugs. Be as verbose and as simplistic as possible.
Maintainability of the code is just as important as any other code characteristic
because tomorrow when somebody builds on top of your shaky efforts, you don’t want
everybody crashing down with you. High velocity teams cannot survive without high
code quality.

## Build a strict workflow

Building predictable systems demands vigorous compliance to certain protocols and
a protocol is only worth if everyone follows. Even though we always have a myriad
number of choices to work with, figuring out the best set of rules and standards
early on can help maximize productivity.

> Channel in only the sufficient and necessary direction.

The pipeline starts from the smallest idea to the complete product being served
to the end user. If the pipeline does not have a stringent set of guidelines, you
will soon be shipping needless features and consequently products. For instance,
consider the Medium editor — it is very strict in terms of its philosophy to allow
minimal distractions during writing, no unnecessary features but just plain simple
text and images. It is forcing the writer to focus on what was originally planned 
— **WRITING**, rather than tinkering around with options.

## Automate everything

This statement is generally perceived as an overkill by early stage projects. But
one very important thing we always forget is automation starts at the heart of the
project not at Google-scale infrastructures.

> Be the programmer, not the robot.

Strict workflow will bring in strict conformity requirements. Automation might
seem a heavy investment during the early stages of a system, but you can reap
tremendous benefits after the one time investment you made. Where you could be
debugging where things went wrong during your server deploy, automating with a
state management tool will bring predictability to the system.

---

If you now work backwards, **automation** is possible when we adhere to a strict-ruled
**pipeline**, helping achieve **predictable** system lifecycle. **Single source
of truth** separates **context** from systems, giving a constraint free environment
to **scale**.

These philosophies help achieve system clarity and work at any level of operation,
whether it be just local development or deploying mammoth clusters of heavy duty
applications.

---

What’s next? If we are on the same page, then following in line with these
principles, we’ll discover a more detailed and precise philosophies related to
various moving parts of a distributed system. Here is a complete list of high
level parts that we will explore in order of execution (ideally!).

1. [_The Ultimate Guide to Building Cloud Applications: Development_](../2)
2. _(In Progress!) The Ultimate Guide to Building Cloud Applications:_ **Testing**
3. _(Coming Soon!) The Ultimate Guide to Building Cloud Applications:_ **Logging and Monitoring**
4. _(Coming Soon!) The Ultimate Guide to Building Cloud Applications:_ **Deployments**
5. _(Coming Soon!) The Ultimate Guide to Building Cloud Applications:_ **Scaling**
6. _(Coming Soon!) The Ultimate Guide to Building Cloud Applications:_ **Migrations**
