---
title: For better software delivery
description: Building the swiss-knife for DevOps
date: Jan 3 2016, 1:00 +0530
area: tech
redirectsFrom:
  - /blog/for-better-software-delivery
---

?> :warning: This post is archived.

For the past couple years, I have been working as the Dev and the Ops for my team
at [StoryXpress](https://storyxpress.co). I promise you it has been an amazing
learning ride but for all that matters, it has been an exhaustive one. We have
been hosting our services on Azure and by no means do I think is Azure developer
friendly. Yes, you heard that right!

For all the .NET developers, probably Microsoft Azure is a dream come true. It
is tightly bound into the ecosystem of using .NET + Power Shell + Azure. But for
somebody who is working on a service oriented architecture with myriad number of
technologies, Windows Azure sucks. I have completely transformed all my infrastructure
into code (yes yes, I know the new hot topic around, but not why I went ahead and
did it). But despite all that, I have been frustrated about the state of
deployment on Azure from a platform and technology agnostic perspective. Well,
I went on to tell this to the Azure platform maintainers.

{/_ Tweet ID: 651845691971530752 _/}

I was rather expecting these guys to get more serious about their documentation
but unfortunately it was the wrong thing to demand. As a more responsible citizen,
I should have contributed to their open-source efforts.

After all this rant against the Azure platform, I decided to embark on this journey
to build the complete end-to-end solution from development to deployment which just
works out-of-the-box. I’ll take you through **the WHY, the WHAT and the HOW**.

---

### Why?

I do not want to reinvent the wheel because there have been mammoth giants before
me, who operate at scale. The amazing folks at Google, Twitter, Facebook, WhatsApp
have shown the world what it is like to operate at the amazing scale. After all
this, [people are so reckless as to go crazy the second these services go down](https://twitter.com/search?q=whatsapp%20down).

A whole bunch of services are being used everyday, you name your purpose — logging,
monitoring, deployment, continuous integration and what not. With the rising popularity
of containers, new problems have come to light and you have a service that is
trying to solve those as well. Heck! **Just give me a service that spits out code
and builds me a money-making business overnight**.

As obvious, the development-to-deployment market is so fragmented, I would end up
paying dozens of service providers to do my job for me. After my tryst with Ops,
I must confess it is a very hard job keeping a service up and running. It is a very
steep learning curve if one wants to become the **full-stack developer** that everybody
aspires to be. Probably why such a fragmented expertise exists to solve these problems.

Almost all big technology houses have built massive internal systems to solve
their problems (just look up every company’s engineering blogs), because of course,
everybody says they have their own solution to their own “**pseudo-unique**” problems!
THEY LIE. EVERYBODY HAS LARGELY THE SAME PROBLEM — **Moving from development to
production with minimal human interference**. Everybody wants to achieve everything
automagically.

Then,

> Let’s build a system which works out-of-the-box to solve the problem of
> software delivery with existing battle-tested solutions.

### What?

I named this project, [Orchestrator](https://github.com/activatedgeek/orchestrator). I would welcome name recommendations any day!
Like any complex system, Orchestrator is a composition of frameworks and services
(some existing and some to-be custom built), for the modern micro-services architecture
which just works out-of-the box. To be very clear, this project aims to change the
way you develop and deliver code right from day one. After my long ordeal with software
delivery, especially when I have been a self-learner reading out blogs from the
big guns, I have conceptualized and hardened on certain philosophies that will
fit every software project, big or small.

- Always build compositional systems because the world is compositional
- Each component of the large system is complete on its own (it could be meaningless
  without the other though)
- Separation of concerns
- Forget all the new shiny things, stick to fundamentals, implement what you can
  (if you have the time of course)
- Build platform agnostic

From an engineering perspective, here is what this project aims to achieve.

- An out-of-the-box configured build system based on Jenkins and Mesos.
- An out-of-the-box availability of containerization of micro-services based on
  Docker with support for a reliable private registry.
- An out-of-the-box ability for service discovery using Weave without developer
  interference.
- An out-of-the-box ability to scale virtually painlessly via the usage of Docker
  and Mesos.
- An out-of-the-box ability for centralized logging using Elasticsearch for storage
  and Kibana for visualization.
- An out-of-the-box ability to monitor every running service, persistent or
  ephemeral without any developer interference.
- An out-of-the-box reactive load balancer for all ephemeral services and persistent
  data stores alike.
- An out-of-the-box platform agnostic deployment manager with access control over
  all deployed resources including virtual machines, containers, data stores etc.
  This is the most challenging part of this project which takes infrastructure as
  a code one step further.
- The simplest configurations to start with, allowing for configurability and
  extensibility wherever worth (allows to adjust course for the large spectrum of
  projects out there).

### How?

A large part of technologies that I have discussed above have been used for a while
now in the industry and everyone is convinced about their success. But it could
all be just another facade. To get around that limitation, **I would like to invite
all the readers to pour in their industry and technology experience to help build
this end-to-end software delivery experience**.

The choice of technologies above is highly opinionated based on a personal development
expertise and experience. By no means they are hardened to exist but have largely
been popular tooling for the past few years.

It is an ambitious take to build a better DevOps experience in 2016. The one we all deserve!
