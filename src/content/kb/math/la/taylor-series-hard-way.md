---
title: Discovering Taylor series the hard way
description: Using linear algebra to (almost) derive Taylor series
date: Aug 30 2020, 18:05 +0530
area: math
---

Taylor series is a familiar tool in analysis and often provides effective
polynomial approximations to complicated differentiable functions. The need
arises because polynomials are easier objects to manipulate. We say that the
Taylor series of an infinitely differentiable function $f(x)$ around $x_0$ can
be represented as an infinite sum of polynomials as

$$
f(x) = f(x_0) + \frac{f^{\prime}(x)}{1!} (x - x_0) + \frac{f^{\prime\prime}(x)}{2!} (x - x_0)^2 + \dots.
$$

In this notation, the number of ticks on $f$ represent the derivative. This means
$f^{\prime}$ represents the first derivative, $f^{\prime\prime}$ the second and
so on. When used in practice, we resort to a truncated sum where we ignore the
higher order derivatives. Vector inputs can also be handled. The derivation
of this result is most easily seen for scalar inputs.

In this post, we want to derive Taylor polynomials using linear algebra. I must
confess that this will not look elegant at all from a calculus standpoint.
You've probably seen the most elegant and simple derivation already. I hope,
however, you'll appreciate how beautiful the result is from the perspective of
linear algebra. I call this "the hard way" not because it is conceptually
hard but because it is a long-winded path to an otherwise straightforward concept.
It is also important to note that what we'll arrive at is not Taylor series per se
and is probably better characterized as a "polynomial" approximation.

## Background

The key result that we'll use from linear algebra is _Orthogonal Projections_.

### Notation and Terminology

- **Finite Dimension** (n): By definition, a vector space with finite number of
  basis vectors, where a basis affords a unique way to represent every vector.
- **Vector Space**, $U$ or $V$: Finite-dimensional vector spaces over some field $\mathbf{F}$ [^a]
  that follow the usual rules of closure under addition, scalar multiplication,
  additive identity, additive inverse, multiplicative identity and so on.
- **Vector Subspace**: Subspaces are to spaces what subsets are to sets.
- **Linear Functional** $\phi$: This is a special name for linear maps that go
  from $V$ to the field $\mathbf{F}$, a scalar. Since every linear map has an
  associated matrix, it is equivalent to simply think of this as multiplying a
  $1 \times N$ matrix with a $N \times 1$ vector.
- **Inner Product** $\langle v, u \rangle$: This is an abstract generalization of
  the dot product with the usual rules. The usual rules apply. I will note an
  additional property of conjugate symmetry $\langle v, u \rangle = \overline{\langle u, v \rangle}$
  which isn't needed for real fields (because conjugate is the scalar itself).
- **Norm** $\lVert \cdot \rVert$: Norm gives us the notion of distance in vector
  spaces. It is defined as $\lVert v \rVert = \sqrt{\langle v,v \rangle}$,
  the square root of inner products. Our familiar Euclidean distance is also known
  as the $L_2$ norm.
- **Orthogonal Projection**, $P_{U}x$: The orthogonal projection of a vector $x$
  onto the subspace $U = span(x)$ is defined as $P_{U}~x = \frac{\langle v, x \rangle}{\lVert x \rVert} x$.
  This should look familiar and intuition of "component" of a vector along a line
  usually works (although the subspace $U$ need not only be a line). Equivalently,
  we can write this in an orthonormal basis $e_1, \dots, e_m$ of $U$ as
  $$
  P_{U}x = \langle x, e_1 \rangle e_1 + \dots + \langle x, e_m \rangle e_m
  $$
  which invokes the idea of projecting the vector onto each basis vector where
  the coefficients defined by the inner products are unique. Since, these basis
  vectors are normal, the norm is unity - $\lVert e_k \rVert = 1~\forall~k \in \{1, \dots, m \}$.

### Orthogonal projections

> Suppose $U$ is a finite-dimensional subspace of $V$, $v \in V$, and $u \in U$. Then
>
> $$
> \lVert v - P_{U}v \rVert \leq \lVert v - u \rVert.
> $$
>
> Furthermore, the inequality is an equality if and only if $u = P_{U}v$.

To prove this result, we note the following series of equations.

$$
\lVert v - P_{U}v \rVert \leq \lVert v - P_{U}v \rVert + \lVert P_{U}v - u \rVert = \lVert v - u \rVert
$$

The first equation follows simply from the positive definiteness of the norm
$\lVert P_{U}v - u \rVert$ and the second follows by the Pythagoras theorem
(yes, it works in abstract spaces too!). The Pythagoras theorem is applicable
because the two vectors are orthogonal - $v - P_{U}v$ intuitively amounts to
removing all components of $v$ in the subspace $U$ [^d] and $P_{U}v - u$ belongs
to $U$ (by definition of projection and additive closure of subspaces). As a
consequence of this derivation, we also see that the inequality above would be
equal only when the norm of the second term is zero, implying $u = P_{U}v$.

This result says that the shortest distance between a vector and a subspace
is given by the vector's orthogonal projection onto the subspace. This result is
akin to a two-dimensional result we've always been familiar with that the shortest
distance between a point $p$ and a line $x$ is along another line $l$ perpendicular
to $x$ that goes through $p$.

## Polynomial approximations as Orthogonal projections

The key message of post is this - Taylor series can be viewed as an orthogonal
projection from the space of continuous functions to the subspace of polynomials [^c].

We'll do this by example. Let $\mathcal{C}_{[-\pi, \pi]}$ be the space of continuous
functions in the range $[-\pi, \pi]$ and $\mathcal{P}_5$ be the space of
polynomials of degree at most 5. We would like to find the best polynomial
approximation to the function $f(x) = sin(x)$, which does belong to
$\mathcal{C}_{[-\pi, \pi]}$. The precise notion of "best" requires us to
reformulate this problem in linear algebra speak.

By defining an inner product between two functions $f$ and $g$ in the space of
continuous functions as $\langle f, g \rangle = \int_{-\pi}^{\pi} f(x) g(x) dx$,
we can afford the notion of a norm. We desire the best approximation in the
sense of minimizing this norm. For a $v \in \mathcal{C}_{[-\pi,\pi]}$, we seek
$u \in \mathcal{P}_5$ such that norm $\lVert v - u \rVert$ is minimized. In our
case $v$ is the sine function and from our previous result, we know that the
minimum is achieved by the projection of $v$ onto the subspace $\mathcal{P}_5$.
Hence, the polynomial we are after is

$$
\begin{aligned}
u &= P_{\mathcal{P}_5}v
\end{aligned}
$$

As we've noted before, projections can be written in an orthonormal basis of
$e_1, \dots, e_6$ of $\mathcal{P}_5$ as

$$
P_{\mathcal{P}_5}x = \langle x, e_1 \rangle e_1 + \dots + \langle x, e_m \rangle e_6.
$$

Note that I've preemptively chosen fixed the number 6 in the sequence above because
the dimension (number of basis vectors) of $\mathcal{P}_5$ is 6. As one can verify,
$1, x, x^2, x^3, x^4, x^5$ form a basis of $\mathcal{P}_5$. These, however, are not
orthonormal. Nevertheless, we can form an orthonormal basis from a known one using
the [Gram–Schmidt process](https://en.wikipedia.org/wiki/Gram–Schmidt_process).
Be warned, there are ugly numbers ahead.

### Orthonormal basis for polynomials

By the Gram-Schmidt orthonormalization, we note that for a given basis
$b_1, \dots, b_m$, an orthonormal basis is given by $e_1, \dots, e_m$ as

$$
\begin{aligned}
u_1 &= b_1 \\
e_k &= \frac{u_k}{\lVert u_k \rVert} \\
u_k &= b_k - \sum_{i=1}^{k-1} P_{e_i}b_i,~\forall~k \geq 2 \\
\end{aligned}
$$

We've slightly overloaded the projection notation $P_{e_i}$ here for brevity.
This actually is supposed to mean $P_{U_i}$ where $U_i$ is the span of basis
vector $e_i$. Intuitively, this method is simply removing components of the
basis vector that already have been covered by previous basis vectors and then
simply normalizing each of them.

We need to solve more than a few integrals for the inner product
calculations as a part of the projections but they are straightforward.
You'll often find yourself computing symmetric integrals of odd polynomials which
just amount to zero. I will note the complete orthonormal basis here for reference.

$$
\begin{aligned}
e_1 &= \sqrt{\frac{1}{2\pi}} \\
e_2 &= \sqrt{\frac{3}{2\pi^3}} x \\
e_3 &= \sqrt{\frac{45}{8\pi^5}} \left( x^2 - \frac{\pi^2}{3} \right) \\
e_4 &= \sqrt{\frac{175}{8\pi^7}} \left(x^3 - \frac{3\pi^2}{5}x \right) \\
e_5 &= \sqrt{\frac{11025}{128\pi^9}} \left(x^4 - \frac{6}{7}\pi^2 x^2 + \frac{3}{35} \pi^4 \right) \\
e_6 &= \sqrt{\frac{43659}{128\pi^{11}}} \left(x^5 - \frac{10\pi^2}{9} x^3 + \frac{5\pi^4}{21}x \right).
\end{aligned}
$$

### Computing the orthogonal projection

With this derived orthonormal basis for $\mathcal{P}_5$, we are now in a position
to find the optimal (in the sense of norm) projection of $sin(x)$ using the
projection identity

$$
P_{\mathcal{P}_5} f = \langle f, e_1 \rangle e_1 + \dots + \langle f, e_m \rangle e_6.
$$

For $sin(x)$, we note that its inner product with $e_1, e_3, e_5$ is zero because
these turn out to be symmetric integrals of odd functions around 0. We note the
following results for $f = sin(x)$ sine function.

$$
\begin{aligned}
\langle f, e_2 \rangle e_2 &= \frac{3}{\pi^2}x \\
\langle f, e_4 \rangle e_4 &= \frac{175}{8\pi^6} \left(\frac{4\pi^2}{5} - 12 \right) \left(x^3 - \frac{3\pi^2}{5}x \right) \\
\langle f, e_6 \rangle e_6 &= \frac{43659}{64\pi^{10}} \left( \frac{8}{63} \pi^4 - \frac{40}{3} \pi^2 + 120 \right) \left(x^5 - \frac{10\pi^2}{9} x^3 + \frac{5\pi^4}{21}x \right) \\
\end{aligned}
$$

Summing these up, we get

$$
P_{\mathcal{P}_5} f = 0.987862 x - 0.155271 x^3 + 0.005643 x^5
$$

### Visual comparisons

We compare the exact function $f(x) = sin(x)$ with $f_t(x)$ the Taylor
polynomial approximation and $f_a(x)$, our orthogonal projection approximation.

$$
\begin{aligned}
f(x) &= sin(x) \\
f_t(x) &= x - \frac{x^3}{3!} + \frac{x^5}{5!} \\
f_a(x) &= 0.987862 x - 0.155271 x^3 + 0.005643 x^5
\end{aligned}
$$

Here is some quick code to generate these plots using [Altair](https://altair-viz.github.io).

```python
import altair as alt
import pandas as pd
import numpy as np

x = np.arange(-np.pi, np.pi, 0.01)

f = np.sin
ft = lambda x: x - (x**3 / 6) + (x**5 / 120)
fa = lambda x: 0.987862 * x - 0.155271 * x**3 + 0.005643 * x**5

data = pd.DataFrame({ 'x': x, 'Original': f(x), 'Taylor': ft(x), 'Polynomial': fa(x) })

orig = alt.Chart(data).mark_line(color='green').encode(x='x', y='Original')
tayl = orig.mark_line(color='red').encode(x='x', y='Taylor')
poly = orig.mark_line(color='yellow').encode(x='x', y='Polynomial')

orig + tayl + poly
```

![Comparing original (green) with Taylor (red) and Polynomial (yellow) approximations](https://i.imgur.com/2JdYf1J.png "Comparing original (green) with Taylor (red) and Polynomial (yellow) approximations")

Our approximation is indeed very accurate as compared to the Taylor polynomial
which demands higher order terms to do better. Note how the green and yellow
curves stay very close and are virtually indistinguishable.

## Summary

This was a fun way to discover polynomial approximations to functions and that
too quite accuracte. Of course, I promise to never use this in real life.

[^a]: It is enough think of fields as just real or complex numbers for now. You could also think of apples if you don't like abstract concepts (although you are probably going to have trouble thinking of irrational apples).

[^b]: The property that says that all linear maps behave as $\phi(\lambda v) = \lambda \phi(v)$ for $\lambda in \mathbf{F}$. For inner products, the property is defined for the first slot (the first argument) as $\langle \lambda v, u \rangle = \lambda \langle v, u \rangle$.

[^c]: Applying the definitions may help us see why set of all continuous functions is a vector space. To start with, sum of two continuous functions is continuous and multiplication with a scalar also keeps the function continuous. Further, polynomials are just a subset of continuous functions and also satisfy these two closure properties. Trust me that all other necessary properties are also satisfied.

[^d]: Formally, we say $v - P_{U}v$ belongs to the orthogonal complement $U^{\perp}$ of $U$. $U^{\perp}$ is the set of all vectors that are orthogonal to all vectors in $U$.
