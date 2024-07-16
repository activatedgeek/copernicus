---
title: Differential Entropy
description: What is "differential" in differential entropy?
date: Jun 11 2023, 20:57 -0400
area: math
---

Entropy for continuous random variables is technically called _differential entropy_. I've always wondered what the **differential** means, and I finally have an answer.

## Discrete Random Variables

Shannon's groundbreaking work in information theory[^shannon] defined information as a measure of surprise. Specifically, for _discrete_ random variables $X$ as $-\log{p(X)}$ where $p(X)$ is the probability mass. Consequently, the average information, or _entropy_ $H$ is defined as,[^mackay]

$$
H(X) = -\sum_{i} p(X_i)\log{p(X_i)}.
$$

Extending this definition to _continuous_ random variables, however, is tricky as we'll see next.

[^shannon]: Claude E. Shannon. “A mathematical theory of communication.” *Bell Syst. Tech. J.* 27 (1948): 623-656. https://ieeexplore.ieee.org/document/6773024

[^stone]: James V. Stone. “Information Theory: A Tutorial Introduction.” *ArXiv* abs/1802.05968 (2015). https://arxiv.org/abs/1802.05968

[^mackay]: David John Cameron MacKay. “Information Theory, Inference, and Learning Algorithms.” *IEEE Transactions on Information Theory* 50 (2004): 2544-2545. https://www.inference.org.uk/mackay/itila/

## Continuous Random Variables

Discrete probability masses are often visualized as histograms. In similar spirit, instead of thinking in terms of a continuous random variable $X$, we are going to think in terms of its discretized version $\Delta X$, binned into buckets of width $dX$.[^stone]

To construct the entropy of such a discretized distribution, we need to define $p(\Delta X)$. One way is to think in terms of the area of one bin relative to the total area occupied by all bins. For $n(\Delta X)$ number of values in a bin, the area will be $a = n(\Delta X) \times dX$ (a thin rectangle). For the total area across all bins $A = \sum a$, we have the probability of a bin as $p(\Delta X) = a/A$. This construction satisfies the law of total probability such that $\sum p(\Delta X) = 1$, i.e. probability of all bins sum to $1$.

Now that we have a normalized histogram, we can instead work with normalized counts which we denote by $q(\Delta X)$. Under such a normalization, the area itself defines the probability of the bin:

$$
p(\Delta X) = q(\Delta X) \times dX.
$$

Instead of our original continuous random variable $X$, let us now work with this definition of probability for the discretized version $\Delta X$.

## Entropy of Discretized Random Variable

Let's plug the definition of discretized probability $p(\Delta X)$ into entropy. We have

$$
\begin{aligned}
H(\Delta X) &= - \sum p(\Delta X) \log{p(\Delta X)} \\
&= -\sum q(\Delta X) dX \log{q(\Delta X)} - \log{dX} \times \underbrace{\sum q(\Delta X) dX}_{\sum p(\Delta X) = 1} \\
&= - dX \left[\sum q(\Delta X) \log{q(\Delta X)}\right] - \log{dX}
\end{aligned}
$$

As the bin width $dX$ approaches zero, the entropy becomes:

$$
H(X) = -\int_{\mathcal{X}} q(X)\log{q(X)} + \infty
$$

This result is trouble - the entropy for all continuous random variables in infinite. In principle, this result is not wrong - as the precision of our continuous quantity's measurement increases (i.e. the bin width decreases), the average surprise in the measurement increases. But it leaves us with an unworkable definition of entropy for continuous random variables since we always need to know the bin width.

## Differential Entropy

To work with entropy of continuous random variables, the resolution is that we only keep the _interesting_ term and skip the constant width term $-\log{dX}$. The differential entropy is therefore given by,

$$
H_{\mathrm{dif}}(X) = H(X) - \log{1/dX} = -\int_{\mathcal{X}} q(X)\log{q(X)}
$$

And therefore,

> the **differential** comes from ignoring the constant width term, which otherwise forces the entropy to be always infinite.

This definition is often clear from context and not made explicit. Notably, in cases involving comparison of two continuous distributions (e.g. KL-divergence), this difference often cancels out and does not cause trouble.
