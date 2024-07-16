---
title: Cross-Entropy, Label Smoothing, and Focal Loss
description: Connections between cross-entropy loss, label smoothing, and focal loss.
date: Jun 12 2023, 14:09 -0400
area: math
---

The cross-entropy loss is one of the most popular loss functions in modern machine learning, often used with classification problems.

One way to derive the cross-entropy loss is by thinking in terms of a _true_ but unknown data distribution $p$, and an estimated distribution $q$. Using KL-divergence to compare two distributions, our learning objective is to find a distribution $q^\star$ such that the KL-divergence is minimized w.r.t $q$ as,

$$
q^\star = \mathrm{argmin}~  KL(p \parallel q)
$$

If $q^\star$ perfectly models the true underlying data distribution $p$, then we achieve the global minima of $KL(p \parallel q^\star) = 0$.

Now, let us unpack the KL-divergence term starting with the definition.

$$
\begin{aligned}
KL(p \parallel q) &= \mathbb{E}_p\left[\log{\frac{p}{q}}\right] \\
&= \mathbb{E}_p[\log{p}] - \mathbb{E}_p[\log{q}] \\
KL(p \parallel q) &= - H[p] + CE(p \parallel q)
\end{aligned}
$$

Where $H[p]$ is the entropy of distribution $p$, and $CE(p \parallel q)$ is the cross-entropy loss between distributions $p$ and $q$.

It can now be seen that, minimizing the KL-divergence is equivalent to minimizing the cross-entropy loss - the entropy term $H[p]$ is a constant outside our control (a property of the true data-generating process), and more importantly independent of $q$ for optimization.

In practice, for a dataset $\mathcal{D}$ of input-label observations $\{x,y\}$, we compute the _average_ cross-entropy loss for a $K$-way classification problem as,

$$
\mathcal{L}_{\mathrm{CE}} = - \frac{1}{\lvert\mathcal{D}\rvert} \sum_{\{x,y\} \in \mathcal{D}} \sum_{k=1}^K \delta_{y=k} \log{q(y \mid x)},
$$

where the outer sum is over all the observations, and the inner sum is the cross-entropy between true conditional distribution $p(y \mid x)$ and modeled conditional distribution $q(y\mid x)$. $p(y \mid x)$ is represented as a delta distribution which puts all its mass on the true label, i.e. $k = y$.

## Label Smoothing

Label smoothing[^szegedy] is a common trick used in training neural network classifiers to ensure that the network is not over-confident and better calibrated.

[^szegedy]: Christian Szegedy et al. “Rethinking the Inception Architecture for Computer Vision.” *2016 IEEE Conference on Computer Vision and Pattern Recognition (CVPR)* (2015): 2818-2826. https://ieeexplore.ieee.org/document/7780677

Instead of the delta distribution $p(y\mid x) = \delta_{y=k}$ we noted earlier, the key idea of label smoothing is to use smoothed target distribution $p(y\mid x)$ such that with probability $\epsilon < 1$, the target is resampled at random, i.e.

$$
\widetilde{p}(y\mid x) = \epsilon \cdot \frac{1}{K} + (1-\epsilon)\cdot \delta_{y=k}
$$

The implied loss function now is $CE(\widetilde{p} \parallel q)$.

$$
\begin{aligned}
CE(\widetilde{p}\parallel q) &= - \mathbb{E}_{\widetilde{p}}\left[\log{q}\right] \\
&= \epsilon \cdot CE(U \parallel q) + (1-\epsilon) \cdot  CE(p \parallel q)
\end{aligned}
$$

Therefore, with a few rearrangements, what we get is a weighted objective where the first term $CE(U \parallel q)$ nudges our model towards a uniform distribution over the labels $U$ and the remainder is the same old cross-entropy loss but reweighted with $1-\epsilon$.[^epsilon]

[^epsilon]: A canonical choice of $\epsilon$ is $0.1$.

This objective makes sense intuitively. We want to match the true distribution $p$, but we regularize it such that our classifier is smoothed out by also matching to uniform distribution. Label smoothing demonstrably leads to better generalization and calibration, although leads to worse model distillation due to loss of information at the penultimate layer by encouraging the representations of the same label to cluster tightly.[^whensmooth]

[^whensmooth]: Rafael Müller et al. “When Does Label Smoothing Help?” *Neural Information Processing Systems* (2019). https://arxiv.org/abs/1906.02629

## Focal Loss

Another proposal to improve calibration of neural networks is focal loss,[^focal2020] originally proposed for object detection.[^focal2017]

[^focal2017]: Lin, Tsung-Yi et al. “Focal Loss for Dense Object Detection.” *2017 IEEE International Conference on Computer Vision (ICCV)* (2017): 2999-3007. https://arxiv.org/abs/1708.02002

[^focal2020]: Mukhoti, Jishnu et al. “Calibrating Deep Neural Networks using Focal Loss.” *ArXiv* abs/2002.09437 (2020). https://arxiv.org/abs/2002.09437

Focal loss modifies the original cross-entropy loss, such that for $\gamma \geq 1$:[^focalvalue]

$$
CE_\gamma(p \parallel q) = -\mathbb{E}_{p}\left[(1-q)^\gamma \log{q} \right].
$$

[^focalvalue]: A canonical choice of $\gamma$ is $3$.

This objective implies that as soon as $q$ starts modeling the original distribution $p$ well, we will artificially downweight the loss incurred. Again, intuitively this makes sense since the cross-entropy loss has a tendency to keep fitting until we reach the degenerate $\delta_{y=k}$ distribution.

With a bit of algebraic massaging, we can understand the connection of focal loss to cross-entropy loss.

$$
\begin{aligned}
CE_\gamma(p \parallel q) &= -\mathbb{E}_{p}\left[(1-q)^\gamma \log{q} \right] \\
&\geq -E_p[\log{q}] + \gamma \mathbb{E}_{p}[q\log{q}] \\
&= CE(p \parallel q) - \gamma \left\lvert \sum_{k=1}^K p_k q_k\log{q_k} \right\rvert \\
&= CE(p \parallel q) - \gamma \left\lvert P \cdot Q \right\rvert \\
&\geq CE(p \parallel q) - \gamma \lVert P \rVert_{\infty} \lVert Q \rVert_{1} \\
&= CE(p \parallel q) - \gamma \sum_{k=1}^K \left\lvert  q_k\log{q_k} \right\rvert \\
&= CE(p \parallel q) + \gamma \mathbb{E}_q[\log{q}] \\
&= CE(p \parallel q) - \gamma H[q]
\end{aligned}
$$

where the second equation comes from [Benoulli's inequality](https://en.wikipedia.org/wiki/Bernoulli's_inequality#Alternative_proofs), the third equation comes by definition of modulus $\lvert\cdot\rvert$ operator (the terms inside the expectation are always non-positive). $P = [p_1,\dots,p_K]$ represents the vector of probabilities from the true distribution such that the infinity norm $\lVert P \rVert_{\infty} = 1$ since we represent it as a one-hot encoded vector, and $Q = [q_1\log{q_1},\dots,q_K\log{q_K}]$ represents the vector constructed via our modeled distribution $q$ such that we can use [Hölder's inequality](https://en.wikipedia.org/wiki/H%C3%B6lder's_inequality). We can then revert the modulus since each term is non-positive, such that last term is simply negative entropy of $q$.

Therefore, the focal loss minimizes an upper bound of the entropy-regularized cross-entropy loss. Regularizing with the entropy of $q$ nudges the learned distribution to be higher entropy, leading to smoother learned distributions, which demonstrably leads to better calibration.[^focal2020]

## Remarks

It is intuitive to expect calibration to improve by learning smoother classifier distributions. Both label smoothing and focal loss bear neat connections to the original cross-entropy loss, via a reweighted objective and an entropy-regularized objective respectively. More importantly, alongside calibration, these methods often improve generalization. I wonder what other objectives lead to similar enhancements.
