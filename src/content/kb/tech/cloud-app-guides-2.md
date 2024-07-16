---
title: The Ultimate Guide to Building Cloud Applications - Development
description: Developing better code with simplistic philosophies
date: Dec 6 2015, 00:27 +0530
area: tech
redirectsFrom:
  - /blog/cloud-app-guides/2
---

?> :warning: This post is archived.

Every big project ever dreamt of, always started from that one folder sitting on
a local development machine. While, it could be highly likely that many projects
never saw the light of the day, don’t forget the fact that you are the architect
of a system which could potentially increase the happiness of a million others
(**_\$\$\$_**).

Here is a collection of ideas, which will help making the right decisions from
day one of development.

> This article is the second installment to the discussion at
> The Ultimate Guide to Building Cloud Applications. To be in line with some
> primer philosophies, I recommend reading [this](/kb/the-ultimate-guide-to-building-cloud-applications) first.

---

## Plan your code

One of the biggest mistakes I have ever made in life is directly jumping into
writing code. Why? Because it is exciting. But as I have come to build larger
projects, it becomes a mess if there is no proper planning.

The most important decisions that anyone will want to make before starting out
to code will be regarding data storage and communications to the end user. Rest
is just plain, simple and redundant code. A variety of new design patterns have
emerged in both databases and communications, of which, many might not be a fit
for your use case. But for a start, it is very important to list out one’s
requirements. e.g. There has been much hustle about NoSQL but nobody really ever
understands why do they need that kind of database structure.

Many decisions as a developer are made based on what appeals more rather than
what is needed. One must be wary of that.

---

## Write Simple and Clear

While you might be the champion of code obfuscation, but that will not work for
a production level environment. It is important to be clear in terms of code
design with appropriate aesthetics (for instance, tabs or spaces indicating
relevant level of nesting). What this helps achieve is easier code comprehension
as well as easier code debugging.

For instance, you could make a choice between the following two statements.

```cpp
// example for C++
myfunc(i, ++i);
myfunc(i, i + 1);
```

The first statement is ambiguous as the compiler or interpreter can evaluate this
statement as per its own evaluation order - it could evaluate `++i` and then
substitute `i` in the arguments or the other way round, whereas the second
statement makes it explicitly clear without ever having a side-effect on the
variable `i`. This brings me to my second point.

---

## Build immutable structures

In the recent few months, I have become a great fan of the functional programming
paradigm. This paradigm revolves around the idea of building structural and modular
code which treats each statement as the evaluation of a function without changing
state of any existing data. Everything is ideally immutable. This ensures that any
new results that are ever received, never modify an existing data structure and
always build a new copy. One very basic example of this concept is explained via
a special operator called `filter()`.

```js
// example for Javascript ES6+
const continents = [
  "asia",
  "africa",
  "antarctica",
  "north america",
  "south america",
  "europe",
  "australasia",
];
const continentsStartingWithS = continents.filter((continent) => {
  return continent[0] === "s";
});
// "continentsStartingWithA" now contains ["south america"]
```

This code outlines two important aspects - note that the variables `continents`
and `continentsStartingWithS` are immutable and the filter tries to get all
continent names starting with the letter `S` into a new immutable data structure.
This prevents accidental modification of an existing data structures, saving a
lot of debugging time!

---

## Make no assumptions (or the least of them)

Following in line with the functional programming paradigm and extending the REST
principles to general development, one must never make any assumptions during
development. When the doomsday comes, one of those assumptions will come crashing
down on your code before you realize. When making assumptions, it must be effectively
logged (more on logging later). One bad example of making assumptions is default
argument variables especially in a reactive application which responds to events
in real time. Consider a function which responds to state change:

```js
// the bad way
function changeState(stateVariable1, stateVariable2 = defaultVal) {
  this.state = {
    // Oops! You could just set that to an undefined variable as well
    variable1: stateVariable1,
    variable2: stateVariable2,
  };
}

// the right way
function changeState(stateVariable1, stateVariable2) {
  if (stateVariable1) {
    this.state.variable1 = stateVariable1;
  }
  if (stateVariable2) {
    this.state.variable2 = stateVariable2;
  }
}
```

Well, there could be a million ways you could solve the above problem. The take
away here is to have minimal number of assumptions so that tomorrow you have a
better grip on the rusting code.

---

## Build Consistent and Configurable Interfaces

There is a thing about Open Source Projects which makes them successful. More
than just spitting out code into the open and letting it evolve on its own will,
the success of an Open Source Project lies in the way it appeals to fellow programmers.
Because if nobody else except you is willingly contributing, then probably, you
should stop.

Building a consistent interaction to the code will give not only give one the
ability to move faster, but others as well who are excited by what is being built.
For instance, this year I was immensely excited by some huge open source projects
that gained profound momentum from both a DevOps and Business perspectives -
[Docker](https://www.docker.com), [Mesos](https://mesos.apache.org) and
[Ansible](https://www.ansible.com). The projects have brought solutions to very
complex problems to the hands of everyday programmers like you and me. It has been
made possible because they follow a strict policy of providing the easiest of
interfaces which are simple enough to get started and complex enough to be extensible
to the core. e.g. You can plugin extensions to **Docker Event System** to create
complex system interaction protocols for your containers, you can plugin extensions
to the **Mesos Framework** and build your own complex datacenter (of course, don’t
think it is a piece of cake) or you can start creating custom modules to manage
your infrastructure consistency using **Ansible**. Of course, there were already
solutions which existed before the advent of these projects. But why did they not
gain such a momentum in recent years? It is because these guys made it sound easy.
In fact they made it work easy.

Deciding on a pattern and sticking to it helps maintain the predictability and
repeatability of the system behaviour.

---

## Prevent Premature Optimization

> Premature optimization is the root of all evil. -Donald Knuth

One of the famous quotes by one of the most prominent figures in the history of
Computer Science. There you have it. Don’t try to be the perfectionist. Be the one
who executes things on time. This comes after I have learned things the hard way.
We are all attracted to building the perfect thing. But the reality of this world
is, nobody really wants the perfect system. It should simply just do the job it was
assigned for, and do it well. That is what we all must strive for.

From a technical standpoint, imagine you have a rating system (which feels very
popular and trivial nowadays) for products. One query that your users could ask
for is the average rating of your product. Now rather than thinking over optimizing
your queries just simply ship the feature by using:

```sql
SELECT name, AVG(rating) FROM products GROUP BY name;
```

This is very simple query which lets MySQL do all the heavy lifting. Many would
consider calculating averages online is such an inefficient way. Yes it is! But
before that, get those users to crash your database and then optimize using offline
workers (and all the hi-tech things!).

---

One of the versions of the popular [Broken Windows Theory](https://en.wikipedia.org/wiki/Broken_windows_theory)
(a theory about norm setting and signaling effect) - given a shiny polished car,
it will remain in excellent state until the first scratch, after the first scratch
it will deteriorate to the worst of conditions. In an analogous situation, the
moment you let loose on the above ideas, you know your project’s demise has started.

You think I missed out something? Comment!
