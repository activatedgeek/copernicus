---
title: Microservices is not the solution you think
description: A conservative take on adopting microservices
date: Feb 24 2016, 23:50 +0530
area: tech
redirectsFrom:
  - /blog/microservices-is-not-the-solution
---

?> :warning: This post is archived.

**_Microservices_** have suddenly become the hip thing to do. While
it would be imbecile to question the potential of microservices,
what I am surprised at why wasn't it popular enough pre-2014. While
microservices solves plenty of problems which otherwise would have bugged a
seasoned developer, but to keep things in the larger perspective,
a microservices approach is not the best way to get started as a
potential high performance developer. The path to microservices is
hard, very hard.

## The sudden rise to popularity

To put things in perspective, have a look at the following Google Trends
on the popularity of the term **"microservices"**.

<script
  src="//www.google.co.in/trends/embed.js?hl=en-US&q=microservices&cmpt=q&tz=Etc/GMT-5:30&tz=Etc/GMT-5:30&content=1&cid=TIMESERIES_GRAPH_0&export=5&w=500&h=330">
</script>

<script
  type="text/javascript"
  src="//www.google.co.in/trends/embed.js?hl=en-US&q=microservices&tz=Etc/GMT-5:30&content=1&cid=GEO_MAP_0_1&export=5&w=500&h=600">
</script>

Interestingly, if we dig deeper into data here, it turns out that the
hubs for new age internet companies are the ones that are most infatuating
with this term. Now juxtaposed to the above graph, have a look at the following
stats from the [Global Startup Ecosystem Ranking 2015](https://startup-ecosystem.compass.co/ser2015/):

![Global Startup Ecosystem Ranking 2015](https://ec2-50-17-15-93.compute-1.amazonaws.com/wp-content/uploads/2015/08/SER_2015_ranking_table_Final.png)

If you have a look at the **top half of the countries trending** with this search
term versus **the bottom half of the Ecosystem Ranking** above, you will find a
clear connection. The newer startup economies tend to be finally accepting the
ways of engineering, which more mature economies have already been doing for
quite a while now. This brings us to the question,

## Are microservices really new?

While microservices might be the latest trending term across various
ecosystems, the process is not new. In fact,

> Microservices are the natural evolution of large monolithic architectures.

A software is the contract between the business and the client. Businesses
tend to optimize processes at various levels in their timeline. It is
because of this same optimization process that innovations in software
engineering, some revolutionary and some naturally destined, happen.

Microservices is the product of the same evolutionary process which follows
the principle of **loose coupling and high cohesion**. And why not? After
all, large teams do need space to move with high velocity. Microservices
provide that space and flexibility to make autonomous decisions in the
fast paced competitive environment.

Microservices brings separation of concerns to the engineering trying to
build the next product, helps clear the state of mind and keeps a clear
vision with fast iterative development in perspective. But if you have
made the decision to transistion to the loosely coupled microservices
architecture, think before you go ahead, because the road is full of
immeasurable roadblocks.

## Do you really need microservices?

For all the developers out there who have had the privilege to build
system designs from scratch, would agree with me that everything starts
from a single large monolithic application. A novice programmer might as
well start without any existing frameworks and services, eventually moving
to build bloated piece of code.

As more people tend to contribute to the core of your business, it
becomes difficult to restrict everything to a single codebase. In the
desperate need to find space, we branch out when the single monolith
starts going out of our hands. Here are a fraction of the problems that
will arise during building polyglot microservices:

### Polyglot Micro-Service Deployments

Considering a polyglot environment, everybody chooses their own preferred
technology stack, deployments will become a mess.

### A Million Interfaces

For all the services that have been created, will require a different set
of interfaces to interact with. The design of such interfaces will vary
from developer to developer which adds additional overhead for the newbie.

### Maintenance Hell

In this wild web of inter-service communication, one has to absolutely
cautious about how to maintain them, bring them down, upgrade the services
and so forth.

### Continuous Integration and Continuous Delivery

With microservices in place, one will need an automated infrastructure
to test and reliably deploy the new code pushed into the central
repository store. This brings us new build architecture challenges which
one would never care about if it were a monolith.

### Overwhelming Logs

Streams of data will start flowing with different services deployed.
One needs to plan for the storage, debugging and usability of those
logs as well.

Conclusively,

> Microservices are a trade-off between maintainability and production velocity.

## What should you really do?

Don't fall for the new shiny things and listen to your business first.

This is the least one can do. Apply the generic principles of
software engineering, one view at a time -

> Fix your module, then your component and then your architecture.

Let your system evolve, microservices will follow thereafter.

Microservices is the booby trap you don't want to fall into!
