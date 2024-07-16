---
title: The Gaussian Cheatsheet
date: Apr 22 2020, 12:30 -0700
updated: Aug 6 2023, 13:28 -0400
area: math
redirectsFrom:
  - /blog/ml/gaussian-cheatsheet
---

This is a collection of key derivations involving Gaussian distributions
which commonly arise almost everywhere in Machine Learning.

## Normalizing Constant

A Gaussian distribution with mean $\mu$ and variance $\sigma^2$ is given by $p(x) \propto \exp\left\{ - \frac{(x - \mu)^2}{2\sigma^2} \right\}$

To derive the normalizing constant for this density, consider the following integral

$$
\text{I} = \int_{-\infty}^{\infty} \exp\left\{ - \frac{(x - \mu)^2}{2\sigma^2} \right\} dx
$$

$$
\text{I}^2 = \int_{-\infty}^{\infty} \exp\left\{ - \frac{(x - \mu)^2}{2\sigma^2} \right\} \exp\left\{ - \frac{(y - \mu)^2}{2\sigma^2} \right\} dx dy
$$

First using change of variables $u = x - \mu$ and $v = y - \mu$, we have

$$
\text{I}^2 = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \exp\left\{ - \frac{u^2 + v^2}{2\sigma^2} \right\} du dv
$$

Transforming to polar coordinates $u = r \cos{\theta}$ and $v = r\sin{\theta}$
using the standard change of variables, we require the Jacobian determinant $\Big| \frac{\partial (u,v)}{\partial (r, \theta)} \Big|$

$$
\Big| \begin{bmatrix} \cos{\theta} & -r\sin{\theta} \\ \sin{\theta} & r\cos{\theta} \end{bmatrix} \Big| = r
$$

$$
\text{I}^2 = \int_{0}^{2\pi} \int_{0}^{\infty} \exp\left\{ - \frac{r^2}{2\sigma^2} \right\} r dr d\theta = 2\pi \int_{0}^{\infty} \exp\left\{ - \frac{r^2}{2\sigma^2} \right\} r dr
$$

Solving this final integral requires another change of variable. Let $z = \frac{r^2}{2\sigma^2}$,
hence $\sigma^2 dz = r dr$.

$$
\text{I}^2 = 2 \pi \sigma^2 \int_{0}^{\infty} e^{-z} dz = 2 \pi \sigma^2 \left[ -e^{-z} \right]_{0}^{\infty} = 2\pi\sigma^2
$$

This implies $\text{I} = (2\pi\sigma^2)^{1/2}$ and hence the complete distribution is now written as

$$
p(x) = \frac{1}{(2\pi\sigma^2)^{1/2}} \exp\left\{ - \frac{(x - \mu)^2}{2\sigma^2} \right\}
$$

[The Gaussian Integral](https://kconrad.math.uconn.edu/blurbs/analysis/gaussianintegral.pdf) by Keith Conrad shows at least _ten_ other ways to prove this integral. See also [Why $\pi$ is in the normal distribution (beyond integral tricks)](https://www.youtube.com/watch?v=cy8r7WSuT1I) .

## As a Maximum Entropy Distribution

Interestingly, the Gaussian distribution also turns out to be the maximum entropy
distribution on the infinite support for a finite second moment [^@bishop2006pattern].
The differential entropy is defined as the expected information
$\mathbb{H}[x] = -\int_{-\infty}^{\infty} p(x) \log{p(x)} dx$ of a random variable $x \sim p(x)$.

To find the maximum entropy distribution, we formally write the constrained optimization
problem stated before

$$
\begin{aligned}
\text{max}& -\int_{-\infty}^{\infty} p(x) \log{p(x)} dx \\
\text{s.t.}& \int_{-\infty}^{\infty} p(x) dx = 1 \\
&\int_{-\infty}^{\infty} x p(x) dx = \mu \\
&\int_{-\infty}^{\infty} (x - \mu)^2 p(x) dx = \sigma^2
\end{aligned}
$$

The constraints correspond to the normalization of probability distributions,
finite mean (first moment) and finite variance (finite second moment). This
can be converted into an unconstrained optimization problem using Lagrange multipliers [^@boyd2004convex].
The complete objective becomes

$$
-\int_{-\infty}^{\infty} p(x) \log{p(x)} dx +
$$

$$
\lambda_1 \left( \int_{-\infty}^{\infty} p(x) dx - 1 \right) + \lambda_2 \left( \int_{-\infty}^{\infty} x p(x) dx - \mu \right) + \lambda_3 \left( \int_{-\infty}^{\infty} (x - \mu)^2 p(x) dx - \sigma^2 \right)
$$

Setting the functional derivative (see Appendix D in Bishop [^@bishop2006pattern]) $\frac{d [f(p(x))] }{d p(x)} = 0$, we get

$$
-\log{p(x)} + 1 + \lambda_1 + \lambda_2 x + \lambda_3 (x - \mu)^2 = 0
$$

$$
p(x) = \exp{ \left\{ 1 + \lambda_1 + \lambda_2 x + \lambda_3 (x - \mu)^2 \right\} }
$$

To recover the precise values of the Lagrange multipliers, we substitute them back
into the constraints. The derivation is involved but straightforward. We first manipulate the exponent by
completing the squares by noting that for any general quadratic $\alpha x^2 - \beta x + \gamma = \alpha \left(x - \frac{\beta}{2\alpha} \right)^2 - \frac{1}{2} \frac{\beta^2 - 4\alpha \gamma}{2\alpha}$, which will allow us to re-use results from the [previous section](#normalizing-constant). We also further always make use of the subsitution $x^\prime = x - \frac{\beta}{2\alpha}$.

$$
1 + \lambda_1 + \lambda_2 x + \lambda_3 (x - \mu)^2 = \underbrace{\lambda_3}_{=\alpha} x^2 - \underbrace{(2\mu\lambda_3 - \lambda_2)}_{=\beta} x + \underbrace{(1 + \lambda_1 + \lambda_3 \mu^2)}_{=\gamma}
$$

$$
p(x) = \exp{ \left\{ \alpha\left(x - \frac{\beta}{2\alpha} \right)^2  \right\} }\exp{ \left\{ -\underbrace{\frac{1}{2}\frac{\beta^2 - 4\alpha \gamma}{2\alpha}}_{= \delta}  \right\} }
$$

Putting back these new definitions the normalization constraint is,

$$
\int_{-\infty}^{\infty} \exp{ \left\{ \alpha \left( x^\prime \right)^2 \right\} } dx^\prime = \exp{ \left\{ \delta \right\} }
$$

Using another change of variable $y = \sqrt{-\alpha}x^\prime$, we reduce this integral to a familiar form and can evaluate using the polar coordinate transformation trick as earlier.

$$
\begin{aligned}
\frac{1}{\sqrt{-\alpha}} \int_{-\infty}^{\infty} \exp{ \left\{ -y^2 \right\} }dy &= \exp{\left\{ \delta \right\}} \\
\implies\exp{ \left\{ \delta \right\} } &= \sqrt{\frac{\pi}{-\alpha}} \tag{1}
\end{aligned}
$$

Similarly, we put this into the finite first moment constraint and re-apply
the substitution $y = \sqrt{-\alpha}x^\prime$. The first term is an integral
of an odd function over the full domain and is nullified.

$$
\begin{aligned}
\int_{-\infty}^{\infty} (x^\prime + \frac{\beta}{2\alpha}) \exp{\left\{ \alpha (x^\prime)^2 \right\}} dx^\prime &= \cancel{\int_{-\infty}^{\infty} x^\prime \exp{\left\{ \alpha (x^\prime)^2 \right\}} dx^\prime} + \frac{\beta}{2\alpha} \int_{-\infty}^{\infty} \exp{\left\{ \alpha (x^\prime)^2 \right\}} \\
&= \mu\exp{\left\{\delta\right\}} \\
\implies\exp{\left\{ \delta \right\}} &= \frac{\beta}{2\mu\alpha} \sqrt{\frac{\pi}{-\alpha}} \tag{2}
\end{aligned}
$$

Combining (1) with (2), we get $\beta = 2\mu\alpha$. Substituting $\alpha$ and $\beta$
as defined earlier, we get

$$
\lambda_2 = 0
$$

With similar approaches and substitutions, we substitute values in the integral for finite
second moment constraint.

$$
\begin{aligned}
\int_{-\infty}^{\infty} \left(x^\prime + \cancel{\frac{\beta}{2\alpha}} - \cancel{\mu} \right)^2 \exp{ \left\{ \alpha \left( x^\prime \right)^2 \right\} } dx^\prime &= \sigma^2 \exp{ \left\{ \delta \right\} }
\end{aligned}
$$

Focusing on the remaining term, we first apply the change of variable $y = \sqrt{-\alpha}x^\prime$ and note
that this is an even function. This allows us to use the next change of variables.

$$
\int_{-\infty}^{\infty} (x^\prime)^2 \exp{ \left\{ \alpha \left( x^\prime \right)^2 \right\} } dx^\prime = \frac{1}{(-\alpha)^{3/2}} \int_{-\infty}^{\infty} y^2 \exp{ \left\{ -y^2 \right\} } dy
$$

To allow a change of variable further, we first note that this is an even function and symmetric around $0$.
Using this knowledge, we can change the limits of integration to positive values and use $y^2 = z$

$$
\begin{aligned}
\frac{2}{(-\alpha)^{3/2}} \int_{0}^{\infty} y^2 \exp{ \left\{ -y^2 \right\} } dy &= \frac{1}{(-\alpha)^{3/2}} \int_{0}^{\infty} z^{1/2} \exp{ \left\{ -z \right\} } dz \\
&= \frac{\Gamma(3/2)}{(-\alpha)^{3/2}} = \frac{1}{2}\sqrt{\frac{\pi}{-\alpha^3}}
\end{aligned}
$$

where we utilize the fact that $\Gamma(x + 1) = x\Gamma(x)$, where $\Gamma(x) = \int_{0}^{\infty} u^{x-1} e^{-u}du$ is the Gamma function, and $\Gamma(1/2) = \sqrt{\pi}$. Plugging
everything back and using $\beta = 2\mu\alpha$, we get

$$
\begin{aligned}
\frac{1}{2}\sqrt{\frac{\pi}{-\alpha^3}} &= \sigma^2 \exp{\delta} \\
\frac{1}{2}\sqrt{\frac{\pi}{-\alpha^3}} &= \sigma^2 \sqrt{\frac{\pi}{-\alpha}} \\
-\frac{1}{2\alpha} &= \sigma^2
\end{aligned}
$$

Using this, we get

$$
\lambda_3 = - \frac{1}{2\sigma^2}
$$

Substituting back in (1), we have

$$
\begin{aligned}
\exp{ \left\{ \frac{4\mu^2\alpha^2 - 4\alpha\gamma}{4\alpha} \right\} } &= \sqrt{\frac{\pi}{-\alpha}} \\
\exp{ \left\{ \mu^2\lambda_3 - 1 - \lambda_1 - \lambda_3\mu^2 \right\} } &= \sqrt{2\pi\sigma^2} \\
\lambda_1 = -1 - \frac{1}{2}\log{2\pi\sigma^2}
\end{aligned}
$$

Substituting $\lambda_1,\lambda_2,\lambda_3$ back into $p(x)$ gives us the form for $p(x) = \mathcal{N}(\mu, \sigma^2)$. For maximum entropy distributions under other constraints, see examples on [this Wikipedia entry](https://en.wikipedia.org/wiki/Maximum_entropy_probability_distribution#Other_examples)

## Gaussian Conditionals

Conditional Gaussian distributions are common in machine learning - common
examples being Gaussian Processes and Gaussian Linear dynamical systems. Here
we discuss the algebraic manipulations on a joint Gaussian distribution. Consider
a joint distribution on two random variables p(x, y) where both x,y may be vectors.

$$
\begin{aligned}
p(y, x) = \mathcal{N} \left(
\begin{bmatrix} \mu_y \\ \mu_x \end{bmatrix}
, \begin{bmatrix} \mathbf{\Sigma}_{yy} & \mathbf{\Sigma}_{yx} \\ \mathbf{\Sigma}_{xy} & \mathbf{\Sigma}_{xx} \end{bmatrix} \right)
\end{aligned}
$$

We are interested in $p(y | x)$ ($x$ and $y$ are exchangeable throughout). Noting
by the chain rule of probabilities that $p(y,x) = p(x)p(y|x)$ we focus on quadratic
part of the exponent.

$$
\begin{aligned}
\begin{bmatrix} y - \mu_y \\ x - \mu_x \end{bmatrix}^{T} \begin{bmatrix} \mathbf{\Sigma}_{yy} & \mathbf{\Sigma}_{yx} \\ \mathbf{\Sigma}_{xy} & \mathbf{\Sigma}_{xx} \end{bmatrix}^{-1}\begin{bmatrix} y - \mu_y \\ x - \mu_x \end{bmatrix}
\end{aligned}
$$

---

### The Schur complement

We take a digression and discuss the **Schur complement** [^@murphy2012machine].
Consider a matrix decomposed into blocks

$$
\begin{aligned}
\mathbf{M} = \begin{bmatrix}\mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D}\end{bmatrix}
\end{aligned}
$$

We want to (block) diagonalize this so that inversion is easy.

$$
\begin{aligned}
\begin{bmatrix}
\mathbf{I} & -\mathbf{BD}^{-1} \\ \mathbf{0} & \mathbf{I}
\end{bmatrix}
\begin{bmatrix}\mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D}\end{bmatrix}
\begin{bmatrix}
\mathbf{I} & \mathbf{0} \\ -\mathbf{D}^{-1}\mathbf{C} & \mathbf{I}
\end{bmatrix} =
\begin{bmatrix}
\mathbf{A} - \mathbf{B}\mathbf{D}^{-1}\mathbf{C} & \mathbf{0} \\
\mathbf{0} & \mathbf{D}
\end{bmatrix}
\end{aligned}
$$

The inverse is now easy to compute by using the property that the inverse of a
block diagonal matrix is the inverse of each of the diagonal blocks. We also define
$\mathbf{M} / \mathbf{D} = \mathbf{A} - \mathbf{B}\mathbf{D}^{-1}\mathbf{C}$.

$$
\begin{aligned}
\begin{bmatrix}\mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D}\end{bmatrix}^{-1} =
\begin{bmatrix}
\mathbf{I} & \mathbf{0} \\ -\mathbf{D}^{-1}\mathbf{C} & \mathbf{I}
\end{bmatrix}
\begin{bmatrix}
(\mathbf{M} / \mathbf{D})^{-1} & \mathbf{0} \\
\mathbf{0} & \mathbf{D}^{-1}
\end{bmatrix}
\begin{bmatrix}
\mathbf{I} & -\mathbf{BD}^{-1} \\ \mathbf{0} & \mathbf{I}
\end{bmatrix}
\end{aligned}
$$

$\mathbf{M}/\mathbf{D}$ is called the **Schur complement** of $\mathbf{M}$ with respect to $\mathbf{D}$.

---

Getting back to our original equation, we can now utilize this result.

$$
\begin{aligned}
\begin{bmatrix} y - \mu_y \\ x - \mu_x \end{bmatrix}^{T}
\begin{bmatrix}
\mathbf{I} & \mathbf{0} \\ -\mathbf{\Sigma}_{xx}^{-1}\mathbf{\Sigma}_{xy} & \mathbf{I}
\end{bmatrix}
\begin{bmatrix}
(\mathbf{\Sigma} / \mathbf{\Sigma}_{xx})^{-1} & \mathbf{0} \\
\mathbf{0} & \mathbf{\Sigma}_{yy}^{-1}
\end{bmatrix}
\begin{bmatrix}
\mathbf{I} & -\mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1} \\ \mathbf{0} & \mathbf{I}
\end{bmatrix}
\begin{bmatrix} y - \mu_y \\ x - \mu_x \end{bmatrix}
\end{aligned}
$$

Let's start by resolving the first and last two terms. Remember
that we are working with block vectors and matrices. Transpose operators must be
preserved and block matrix algebra works like the usual matrix multiplications.

$$
\begin{aligned}
\begin{bmatrix} y - \mu_y - \mathbf{\Sigma}_{xy}\mathbf{\Sigma}_{xx}^{-1} (x - \mu_x) \\ x - \mu_x \end{bmatrix}^{T}
\begin{bmatrix}
(\mathbf{\Sigma} / \mathbf{\Sigma}_{xx})^{-1} & \mathbf{0} \\
\mathbf{0} & \mathbf{\Sigma}_{xx}^{-1}
\end{bmatrix}
\begin{bmatrix} y - \mu_y - \mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1} (x - \mu_x) \\ x - \mu_x \end{bmatrix}
\end{aligned}
$$

We are already seeing a pattern. This can be finalize into two separate terms because
the central matrix is already block diagonalized.

$$
\begin{aligned}
\left( y - \mu_y - \mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1} (x - \mu_x) \right)^{T}(\mathbf{\Sigma} / \mathbf{\Sigma}_{xx})^{-1}\left( y - \mu_y - \mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1} (x - \mu_x) \right) \\
+ \left(x - \mu_x \right)^T\mathbf{\Sigma}_{xx}^{-1}\left(x - \mu_x \right)
\end{aligned}
$$

We recover the familiar pattern of quadratic terms in the Gaussian exponent. The
exponent can now be written as the product of two exponents such that

$$
\begin{aligned}
p(y,x) = \mathcal{N}\left( \mu_y + \mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1} (x - \mu_x), \mathbf{\Sigma} / \mathbf{\Sigma}_{xx} \right) \mathcal{N}\left(x, \mathbf{\Sigma}_{xx}\right)
\end{aligned}
$$

where $\mathbf{\Sigma} / \mathbf{\Sigma}_{xx} = \mathbf{\Sigma}_{yy} - \mathbf{\Sigma}_{yx}\mathbf{\Sigma}_{xx}^{-1}\mathbf{\Sigma}_{xy}$

### Linear Dynamical Systems

The classic results on a linear dynamical system defined by

$$
\begin{aligned}
p(x) &= \mathcal{N}(x; \mu_x, \mathbf{\Sigma}_x) \\
p(y|x) &= \mathcal{N}(y; \mathbf{A}x + \mathbf{b}, \mathbf{\Sigma}_y)
\end{aligned}
$$

can be derived pretty easily now by reverse engineering the above equations. For
instance, the full joint of this linear dynamical system $p(x,y)$ is given by

$$
p(x,y) = \mathcal{N}\left(\begin{bmatrix}
\mu_x \\ \mathbf{A}\mu_x + \mathbf{b}
\end{bmatrix}, \begin{bmatrix}
\mathbf{\Sigma}_x & \mathbf{\Sigma}_x\mathbf{A}^T \\
\mathbf{A}\mathbf{\Sigma}_x & \mathbf{\Sigma}_y + \mathbf{A}\mathbf{\Sigma}_x\mathbf{A}^T
\end{bmatrix} \right)
$$

Computing the joint, marginals and other conditionals now should be a matter of
plugging in the right values.

[^@boyd2004convex]: Boyd, S.P., & Vandenberghe, L. (2006). Convex Optimization. IEEE Transactions on Automatic Control, 51, 1859-1859.

[^@murphy2012machine]: Murphy, K. (2012). Machine learning - a probabilistic perspective. Adaptive computation and machine learning series.

[^@bishop2006pattern]: Bishop, C.M. (2006). Pattern Recognition and Machine Learning (Information Science and Statistics).
