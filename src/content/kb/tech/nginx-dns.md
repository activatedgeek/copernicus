---
title: Nginx and dynamic DNS upstreams
description: Adventures of using Nginx to proxy internal ELBs on AWS
date: May 13 2017, 20:59 +0530
area: tech
redirectsFrom:
  - /blog/nginx-dns
---

?> :warning: This post is archived and may not be up to date with latest versions.

Recently, I was fiddling around with [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
to run our Nginx reverse proxy server at [Headout](https://www.headout.com) and
observed an interesting behavior with regards to DNS resolution in Nginx.

## Setup

A fairly simple deployment architecture that I have followed is that each internal
service is deployed in its own Auto-Scaling group and load balanced via its own
Internal Load Balancer (ELB). Note the the load balancer is internal and does not have
a public IP address. An `nginx` instance is responsible to proxy requests to the
internal service based on the incoming `server_name`.

Since, these Load Balancers are assigned a random generated DNS name, I sought
out to standardize the DNS names for the various services to make configurations
simpler and less dynamic. Subsequently, I ended up using the [Private Hosted
Zones](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html)
in Route53 where one can setup familiar names to be resolved inside an AWS VPC.
I setup a simple naming structure in the form `<service>.<public-domain>.internal`
making it easier when developing any new service to connect to a dependent service.

Extending this, just creating a `CNAME` record to each of the internal ELBs
works right away. As a result, the `nginx` upstream configuration looks something
like this -

```
upstream myservice1_backend {
  server myservice1.domain.internal;
}

upstream myservice2_backend {
  server myservice2.domain.internal;
}

upstream myservice3_backend {
  server myservice3.domain.internal;
}
```

These upstream servers are being used to configure the `proxy_pass` directive
inside the `server` and `location` context of Nginx configuration which looks
something like this -

```
server {
  server_name publicservice1.domain.com;
  location / {
    proxy_pass http://myservice1_backend;
  }
}

server {
  server_name publicservice2.domain.com;
  location / {
    proxy_pass http://myservice2_backend;
  }
}

server {
  server_name publicservice3.domain.com;
  location / {
    proxy_pass http://myservice3_backend;
  }
}
```

Using the `CNAME` entries for upstream servers provides one great benefit that
I manually don't have to keep updating the upstream list but instead delegating
that to ELB does that job fairly well in itself. Less custom management, less hassle.

## Problem

Now interestingly, after a few minutes, I started getting `502 Bad Gateway`
errors. Restarting the nginx servers restored the application back to normal.
But alas, the problem cropped around 15 minutes later again. What went wrong?

## Diagnosis

### Recreate Everything

One of my first instincts was to reproduce the problem. To ensure sanity, I
destroyed the existing `nginx` application servers and recreated the complete
environment from scratch. Due to the equal parity between development and
production environments (yay Docker!) I was confident enough that if the same
`nginx` configuration was working on my local machine, it should work when deployed.
Check.

### Health Checks

I haven't appreciated the beauty of health checks enough. While in itself, they
aren't a holistic check of the service at logical level, they do provide a very
powerful construct of a starting point to debug the point of failure. Each
service that we run internally has a HTTP endpoint which when pinged returns some
body and a `2xx` response code. These checks ensure reachability and liveness
from the ELBs to each of the instances. The ELB dashboard was reporting that each
service was healthy which felt weird because `502 Bad Gateway` errors generally
refer to the scenario when `nginx` is unable to connect to the upstream.

I manually SSHed into the machines and ensured the health check calls via `curl`.

```
$ curl -I myservice1.domain.internal/health-check
```

which thankfully responded with

```
HTTP/1.1 200 OK
...
```

### Nginx Logs

While many of you would have suggested me to have directly taken a look at the
logs right in the first place, but there were just too many logs to be visually
grepped. Unfortunately, this is when I felt the need for structured logging which
would have made the next problem obvious right away. One of the logs reported

```
... *9 connect() to 10.0.1.43:80 failed ...
```

which was very weird. When I tried using the same IP address to connect, voila!
error reproduced. The AWS dashboard reported a different IP address for that
particular service's internal ELB. And now we know, the fault lies inside `nginx`.

## Solution

On startup, the `nginx` instance resolves all the DNS names it encounters and
caches them to the TTL value of that particular Resource Record (RR). If the IP
address of the upstream changes before the RR expires, you are out of luck. The
only time these DNS queries are re-sent is either on a restart or a reload.

After reading Best Practices in Evaluating Elastic Load Balancing [https://aws.amazon.com/articles/1636185810492479](https://aws.amazon.com/articles/1636185810492479).
Take a look at this excerpt -

> The Elastic Load Balancing service will update the Domain Name System (DNS) record
> of the load balancer when it scales so that the new resources have their respective
> IP addresses registered in DNS. The DNS record that is created includes a Time-to-Live
> (TTL) setting of 60 seconds, with the expectation that clients will re-lookup the
> DNS at least every 60 seconds. By default, Elastic Load Balancing will return multiple
> IP addresses when clients perform a DNS resolution, with the records being randomly
> ordered on each DNS resolution request.

It looks like each load balancer has a DNS A record which points to multiple IP
addresses which might change over time. When I set a CNAME entry to the host of the
load balancer's A record, I set the TTL as `3600s` which is 1 hour before the record
expires. So effectively, the `nginx` instance would have recovered after 1 hour
automatically when the DNS record expires.

Quoting another statement from the AWS article -

> If clients do not re-resolve the DNS at least once per minute, then the new
> resources Elastic Load Balancing adds to DNS will not be used by clients.

Which we clearly know that `nginx` respects the TTL values of the _RRs_ returned.

**NOTE**: Interestingly, before version `1.9`, Nginx had a hardcoded expiry which
was not configurable.

Hence, the solution that immediately worked was changing the TTL of the CNAME
records in the Private Hosted Zones to `60s` which has stabilized the system now.

## Conclusion

Using `A` type `ALIAS` records instead of `CNAME` records might have proven to not
cause this issue in the first place because the new Resource Record would essentially
proxy to the host that the `ALIAS` record was pointing to. Think of it as a forward
proxy in the DNS world and all properties of the proxied record would be applied.
One of the advantages is that this record allows other records to be created with
the same host. A `CNAME` record cannot co-exist with other _RRs_ like `MX` (though
this limitation is something that might not actually be a limitation in most cases).

On further thoughts, it seems like using `nginx` to point to the internal ELBs
might be not so good an idea because for every quantum time of 60 seconds, it will
essentially resolve to the same IP address and hence be served from the same instance
of the service. This defeats the whole purpose of load balancing that the ELBs are
providing. Changing it to an even smaller time of `10s` might work in the short run
but might cause increased latency due to excessive frequency of DNS lookups. The
exact ramifications of very short DNS TTLs is something that I'm still uncertain
about.
