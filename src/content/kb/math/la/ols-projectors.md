---
title: Orthogonal projectors and linear regression
description: A formal geometric summary of what maximum likelihood solution for linear regression signifies.
date: Sep 28 2020, 17:34 +0530
area: math
---

_Linear regression_ is one of the most well studied machine learning algorithms.
A geometric perspective also makes rounds as to what the _maximum likelihood_
solution of a linear regression problem signifies, although the explanations are
often imprecise and hand-wavy. This post will hopefully be a helpful summary to
everyone who was searching for a precise argument around the geometric
interpretation of a least squares solution.

## Setup

As usual, linear regression involves a dataset $\mathcal{D}$ of $N$ pairs of
inputs, in $\mathbb{R}^D$ and outputs in $\mathbb{R}$,
$\{ \mathbf{x}_i, y_i \}_{i=1}^N$. The objective is to learn the parameters
$\mathbf{w}$ of a linear function of the form [^b]

$$
y = \mathbf{w}^T\mathbf{\phi}(\mathbf{x}) + \epsilon,
$$

where $\epsilon \sim \mathcal{N}(0, \sigma^2)$ is data-independent Gaussian
additive noise with variance. $\mathbf{\phi}$ represents the vector
$\begin{bmatrix} \phi_1(\mathbf{x}) & \phi_2(\mathbf{x}) & \cdots & \phi_M(\mathbf{x}) \end{bmatrix}$
of _features_ extracted from each input variable using a set of $M$ basis functions
$\phi_i$. We want to generalize beyond the training data and quantify our performance
using the mean squared error as the notion of risk. We will not be Bayesian
about this problem for now and instead focus on getting a point value
$\mathbf{w}_{ML}$ called the _maximum likelihood_ estimate, as is commonly used.
The key result typically shown in an introductory machine learning class for
the maximum likelihood estimate under mean squared error is reproduced below.

$$
\mathbf{w}_{ML} = (\Phi^T\Phi)^{-1}\Phi^T\mathbf{y}
$$

where $\mathbf{y}$ is the column vector in $\mathbf{R}^N$ consisting of all the
output values from our training data set and $\Phi$ is a $N \times M$
_design matrix_ consisting of $\phi(\mathbf{x}_i)~\forall~i \in \{1, \dots, N\}$
in each row as brlow.

$$
\Phi = \begin{pmatrix}
\phi_1(\mathbf{x}_1) & \cdots & \phi_M(\mathbf{x}_1) \\
\vdots & \vdots & \vdots \\
\phi_1(\mathbf{x}_N) & \cdots & \phi_M(\mathbf{x}_N) \\
\end{pmatrix}
$$

We are interested in the geometric interpretation of this $\mathbf{w}_{ML}$
and we use the formal tool from linear algebra called _orthogonal projectors_.
Familiarity with basic linear algebra is assumed.

## Projectors

With the lack of visuals for now, imagine everything in two or three dimensions.
Everything can be generalized to finite higher-dimensional spaces.

A _projector_ [^@trefethen1997numerical] is a square matrix $P$ that satisfies $P^2 = P$.
In plain words, this means that for any vector $v$, $Pv$ is the projection of $v$ it into a
column-space of $P$. Further, re-applying the projection to this new vector
$P(Pv)$ keeps the new vector intact. This is also known as an _idempotent_ matrix.

### Complementary Projectors

If $P$ is a projector, then $I - P$ is also a projector, where $I$ is identity
matrix of compatible dimensions. This is known as the _complementary projector_,
for reasons we describe next.

$I - P$ projects exactly onto the null space of $P$. To see why, we note that
for any vector $v$ in the null space of $P$, $Pv = 0 \implies (I - P)v = v$.
This means that the space spanned by $I - P$ is at least as large as the null
space of $P$. Further, for any $v$, $(I - P)v$ belongs to the null space of
$P$ as $P(I - P)v = 0$. This means that the space spanned by $I - P$ can at most
be as large as the null space of $P$. Combined, we get exactly the null space of
$P$.

Complementary projectors allow us to write any vector $v$ as a direct sum [^@axler2015linear] of
two subspaces $S_1 = \text{range}(P) = \text{null}(I-P)$ and
$S_2 = \text{null}(P) = \text{range}(I-P)$. This is only possible because
$S_1 \cap S_2 = \{0\}$. To see why this is true, we note that any vector
in the null space of $P$ and in the null space of $I - P$ can be manipulated as
$v = v - Pv = (I - P)v = 0$. This implies an important result that any projector
$P$ splits the space into two distinct subspaces. This is why the projector
$I-P$ _complements_ the projector $P$.

### Orthogonal Projectors

A projector that splits the space into orthogonal subspaces is known as an
_orthogonal projector_. A projector matrix that is hermitian $P^\star = P$
implies an orthogonal projector. $\star$ represents the complex conjugate
transpose.

It is straighforward to see using an inner product that $Px$ for any
$x \in \mathbb{C}^N$ and any $(I - P)y$ for any $y \in \mathbb{C}^N$ are
orthogonal when $P$ is hermitian. Therefore, $P$ projects on to a space
where every vector is orthogonal to the space that $I - P$ projects to.

Visually, it is helpful to imagine two orthogonal lines $\ell_1 \perp \ell_2$,
(lines are one-dimensional subspaces), such that if $P$ projects onto $\ell_1$,
$I-P$ projects onto $\ell_2$.

An elegant little result that I state here without many details -
_Gram-Schmidt Orthonormalization_ can be represented as series of recursively
built projection matrices.

## Projectors onto an arbitrary basis

So far, we've discussed the properties of a given projection matrix $P$. Imagine
the reverse - given any arbitrary basis $\{b_1, b_2, \dots, b_M\}$ for an
M-dimensional subspace of $\mathbb{C}^N$ ($N > M$), can we construct an
orthogonal projector onto this space? The answer is of course, yes. We denote a
matrix $B$ made by stacking the basis vectors $\{b_1, b_2, \dots, b_M\}$ as columns.

For any arbitrary vector $v$, let $y$ be the projection through an orthogonal
projector $P$ on to the column space of $B$, such that $y = Pv$. By the
properties of orthogonal projections we've discussed earlier, $y - v$ should
be orthogonal to the space spanned by the basis represented by columns of $B$. It is
sufficient to note orthogonality only to every basis vector
$\{b_1, b_2, \dots, b_M\}$, succinctly written as $B^\star(y - v) = 0$. Since, $y$
in the column space of $B$ be represented as $y = Bx$ for arbitrary $x$, solving for $x$, gives us
$x = (B^\star B)^{-1}B^\star v$. Putting this back into $y = Bx$, we get,

$$
y = \underbrace{B(B^\star B)^{-1}B^\star}_{P} v
$$

Comparing this to $y = Pv$, we have the definition of our orthogonal projector.

### The Maximum Likelihood Solution

With everything we've laid out now, one should find striking similarity
between what we have for a maximum likelihood solution $\mathbf{w}_{ML}$ and the
projector $P$. Understanding the explanation should now be straightforward.
Let's state the geometric interpretation for completeness.

> The maximum likelihood solution $\mathbf{w}_{ML}$ of linear regression
> (ordinary least squares)
> is such that $\Phi \mathbf{w}_{ML}$ forms an orthogonal projection of $\mathbf{y}$
> onto the subspace spanned by the columns of the design matrix $\Phi$.

Intuitively, when the number of basis functions $M$ is less than the number of
data $N$, ordinary least squares minimizes the error by an orthogonal projection
to the subspace spanned by the chosen basis functions. This result is rather
natural because the distance to subspace is minimized by an orthogonal
projection and linear regression is doing the best it can!

This also reminds us to choose our basis carefully or the inverse operation
will suffer as $\Phi^T\Phi$ can be close to _singular_. For the sake of
completeness, I note that such issues can be addressed by (reduced)
_singular value decomposition_ or just _regularization_ which guarantees full
rank.

[^@axler2015linear]: Axler, S. (1995). Linear Algebra Done Right.

[^@trefethen1997numerical]: Trefethen, L., & Bau, D. (1997). Numerical Linear Algebra.
