---
title: Setup custom email addresses
description: Using Mailgun's MX server with your custom domain for emails
date: Oct 17 2016, 13:20 +0530
area: tech
redirectsFrom:
  - /blog/custom-domain-email
---

?> :warning: This post is archived.

It had been a while that I owned my domain and was wondering if I could switch
all my email communication to a custom email address [hello@sanyamkapoor.com](mailto:hello@sanyamkapoor.com).
Apart from owning the domain, the only requirement which remains is the that of an
`MX` (Mail Exchange) server which can route my emails for me. This is pretty handily done via
services like [GSuite](https://gsuite.google.com/) and [Outlook](https://outlook.com)
but I am not in a stage to shell out a few bucks for a custom email address. This
is when Mailgun enters the scene with its free offering of 10000 e-mail transactions
per month which sounds more than enough.

Here are the steps for anybody seeking solution to a similar problem.

## Get your favorite domain name

Get a domain name from a domain registrar like `GoDaddy`, `Namecheap`. There is
no way you can get this for free (legally at least).

## Setup your Mailgun Account and DNS Zone file

After signing up for `Mailgun` (you might need to go through an activation process
with the customer care explaining your need), you must add a new custom domain
and make appropriate entries. Here is part of the `Zone File` which contains
the Resource Records (`RR`) to be managed.

```
; MX Records
@	3600	IN	MX	10	mxb.mailgun.org
@	3600	IN	MX	10	mxa.mailgun.org

; TXT Records
@	3600	IN	TXT	"v=spf1 include:mailgun.org ~all"
YOUR_DOMAIN_KEY_HOST	3600	IN	TXT	"k=rsa; YOUR_RSA_KEY"
```

Both `YOUR_DOMAIN_KEY_HOST` and `YOUR_RSA_KEY` are available in the `Mailgun`
dashboard. Most Domain registrars provide a comfortable GUI interface to add
these `MX` and `TXT` records.

## Setup Routing via Mailgun

Setup a new [Route](https://mailgun.com/app/routes) which in simple words
means directing your new email id to an existing one.

A sample rule is:

```
match_recipient("hello@yourdomain.com")
forward("you@gmail.com")
priority 10
```

This will forward all mails to "hello@yourdomain.com" to "you@gmail.com".

With this, you have successfully setup to receive emails at a custom domain.

## Setup SMTP Credentials

To allow sending email, you need to setup custom SMTP credentials under your
Mailgun domain. See [How do I start sending email](https://help.mailgun.com/hc/en-us/articles/202464990-How-do-I-start-sending-email-).

## Setup GMail custom SMTP account

Gmail allows you to add custom emails to your account which you can send e-mail
as right within Gmail itself. See [Check email from other accounts with Gmail](https://support.google.com/mail/answer/21289?hl=en).

The settings needed are:

```
SMTP Server: smtp.mailgun.org
PORT: 587 (TLS)
Username: hello@yourdomain.com
Password: <Same as used during setting up SMTP credentials in Mailgun>
```

You should receive a verification email at the account where you chose to forward
your emails (`you@gmail.com`) before you start sending emails as `hello@yourdomain.com`.

Voila! Start sending emails around, send me one at [hello@sanyamkapoor.com](mailto:hello@sanyamkapoor.com)!
