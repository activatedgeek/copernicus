---
title: Elements of Learning
description: Connections to the Fogg Behavior Model
date: Oct 14 2021, 00:07 -0400
area: phil
---

The key to generalization of learning from data, a.k.a. machine learning, are driven by the following three abstract characteristics

- _Inductive biases_ favoring certain kinds of solutions
- _Flexibility_ of modeling
- _Data_ that is relevant to the targeted learning task

It is pretty interesting that this closely resembles the [Fogg Behavior Model](https://behaviormodel.org).

$$
\overbrace{\mathbf{B}}^{\text{Behavior}} = \underbrace{\mathbf{M}}_{\text{Motivation}} \times \overbrace{\mathbf{A}}^{\text{Ability}} \times \underbrace{\mathbf{P}}_{\text{Prompt}}
$$

The one-to-one mapping of the $\textbf{B=MAP}$ model onto machine learning is

$$
\overbrace{\mathbf{L}}^{\text{Learning}} = \underbrace{\mathbf{I}}_{\text{Inductive Biases}} \times \overbrace{\mathbf{F}}^{\text{Flexibility}} \times \underbrace{\mathbf{D}}_{\text{Data}}
$$

There is at least one difference I can think of. In the behavior model, motivation and ability compensate for each other. In machine learning, however, it is unclear whether inductive biases and flexibility can be traded for each other towards learning. If the model is not flexible enough, inductive biases may be futile.

Nevertheless, I think this abstract model needs two things:

1. A better acronym.
2. A way to drive actionable research agendas.
