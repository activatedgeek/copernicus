---
title: Choosing the right keys
description: Learnings to choose better database keys
date: Apr 3 2017, 1:57 +0530
area: tech
redirectsFrom:
  - /blog/choosing-the-right-keys
---

Deciding the keys in an SQL table is one of the most important decisions in
the lifecycle of the database. The ramifications of this decision will last
as long as the database is alive and serving. Therefore, much thought needs to be
put in deciding the trade-offs - fast lookups versus complex queries, ad-hoc
queries versus analytical queries, so on and so forth.

## Why do we need indexes?

In databases, indexes are data structures which help achieve fast lookups for
data which could either be random or ordered. They serve a purpose similar to
the alphabetically arranged words and phrases at the conclusion of a book (which
is obviously known as index for the very same reason). In SQL, we more popularly
know them as _PRIMARY_, _UNIQUE_ or _FOREIGN_ keys. At the end of the day, the
priority of any such index is to minimize **page faults**.

For the uninitiated, pages are the smallest logical blocks of data in the memory.
These are mapped onto the the physical memory and on any disk I/O request,
pages are searched for in the main memory. When the search fails, it is called
a **page fault** and the page is searched for on the secondary memory and loaded.
Further, in case of a shortage of space on the main memory, the existing pages are
**swapped** out to make way for the new ones. Unfortunately, **page faults** and
**swapping** consume a huge amount of time, wasting many CPU cycles.

The performance of a database is bottlenecked on the health of these indices and
are the first-class citizens of any database design discussions.

## Clustered and Non-clustered indices

It is very important to understand how indices are stored to make decisions
about what columns of the tables to create indices on. The differentiation
comes by having logical indices versus physical indices. When an index is
clustered, it implies that the physical blocks on the disk are re-ordered.
When an index is non-clustered, the data is re-ordered only logically and not on
the physical disk. Only new references are stored to the physical disk locations.

By design, a table can have at most one clustered index because it only makes sense
to have one physical ordering on the disk. On the contrary, a table can have multiple
non-clustered indices. In other cases, it is also possible to not have any index
on the table but we try and avoid that as much as possible. The only situation
where having no key makes sense is the intermediate table defining _one-to-many_
or _many-to-many_ relations between two tables.

## Choosing the right keys

### _PRIMARY_ Key

This decision can single-handedly decide the fate of your database performance
because as mentioned earlier, this is a clustered index and should be the
smallest set of columns that identify a row uniquely. More formally, this is
known as the **smallest superkey**.

As a thumb rule,

> Smaller the primary key, smaller the number of pages.

One of the most common ways of structuring primary keys is via B-Trees and the
structural logic of B-Trees is built upon comparisons. So fundamentally, faster
the comparisons, faster the lookups. Hence, it is generally recommended to have
integers as primary keys which have an added benefit of compact storage. This
doesn't necessarily make sense always and in places where it makes sense, overflow
issues are bound to happen.

I should mention that it is preferable to have integer values as your keys as
the comparisons would be blazing fast as compared to strings. But again, this
need not be a hard constraint and in some cases UUIDs work much better. For
instance, consider a database system which tracks a huge number of ephemeral tasks
by ids. Integers would increment just too fast in such a flexible environment
and cause integer overflow soon.

Now is the right time to think about whether you want a natural key or a surrogate
key. One doesn't necessarily win over the other and must be analyzed on a case by
case basis. By definition, a natural key is the key which comes by nature of data
and will _NEVER EVER_ change (which would imply a full rewrite of the complete
database on the physical disk and not a pretty sight for the uptime). Surrogate
keys on the other hand are generally artificially generated and the mean pretty
much what you think. As a thumb rule,

> In the event of a slightest doubt in natural keys not being practically "**primary**",
> surrogate keys should always be made.

In one instance, imagine a Driving License number. It looks like a natural key
because it will be unique for each person. But is it really worthy to make it
primary? Most likely no. Driving License numbers for a person might change after
the previous has expired. Not so unique anymore.

The best answer lies in answering this question,

> Will this table serve **data** or **answers to questions**?

Once the answer to the above question is procured, the puzzle is solved for the
most part.

### _UNIQUE_ Keys

By default, Unique keys are non-clustered which means only references to the
original disk locations are stored. As you might have already guessed, the
lesser the non-clustered unique keys, the better.

### _FOREIGN_ Keys

Foreign keys are not partition tolerant. As a thumb rule,

> In case of a network partition, each logical unit
> should self-suffice to conform to integrity constraints.

More simply put, data across shards should be organized in such a way that all
foreign key checks never need to cross over machines (because they simply can't).

---

Data is a already a hard thing to deal with. Databases are even harder considering
the fact that there's no panacea. Defining the purpose of data helps making
the decision of **choosing the right keys** saner.
