---
title: Quantum ML Scribe
description: Quick notes on quantum machine learning.
date: Jul 16 2020, 11:57 -0700
area: nat
---

These are quick scribes from this really nice Lecture [here](https://www.youtube.com/watch?v=C_lBYKV_pJo)
by Maria Schuld.

## Building Blocks

We consider a measurement matrix $M$ which is a diagonal of measurement values
and the corresponding probability assignments $p$ to each.

$$
\begin{aligned}
M &= \begin{pmatrix}m_1 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & m_n \end{pmatrix} \\
p &= \{ p_1, \cdots, p_n \}
\end{aligned}
$$

The expectation of such a random variable can now be represented in a quadratic
form vector product such that for a vector $q$, $q_i^2 = p_i$ as

$$
\langle M \rangle = \sum_i p_i m_i = q^T M q
$$

Quantum theory revolves around computing expectation of measurements and these
ideas from classical linear algebra are extended in a general form as

$$
\begin{aligned}
\langle M \rangle &= \left\langle \psi \big| M \big| \psi \right\rangle \\
\psi &= \begin{pmatrix} \alpha_1 \\ \alpha_2 \\ \vdots \\ \alpha_n \end{pmatrix} \in \mathbb{C}^n \\
\alpha_i^2 &= p_i
\end{aligned}
$$

$M$ in the most general case (can have non-diagonal elements as well) is a
Hermitian matrix with eigen values equal to the measurements.

## Remarks

- Playing in this world is all about manipulating $\psi$ via unitary matrices $U$.

- Different quantum computing models are polynomially equivalent.
