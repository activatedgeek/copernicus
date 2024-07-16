---
title: ML Fragments
description: Raw unstructured thoughts and ideas.
date: Jul 05 2020, 15:48 -0700
updated: Aug 23 2020, 10:36 +0530
area: math
---

These are just raw keywords which may eventually evolve into their own pages if
I dive deep enough. For now they are just disconnected "fragments", interesting
directions that I may want to pursue. These are intentionally abstract. Please
don't hesitate to reach out if you'd like to discuss more!

There is non-trivial chance that prior work has already posed questions
similar but then I haven't spent enough time studying these in detail.

## Three-Way Markets

Economy \(and "micro-"economies if you will\) seem to be running on three-way markets. i\) The stock market ii\) Gig economy - the likes of Uber, AirBnB. Each transaction can most likely be modeled as consisting of three components - a buyer, a seller and a mediator where each component could be an individual or an institution.

Much like the reward hypothesis in RL, there appears to be a similar hypothesis in stock markets - stock price contains all the information one needs \(I'm still trying to understand the nuance involved in this hypothesis\). We certainly would want to model the micro and macro dynamics. What tools does machine learning provide?

## Reinforcement Learning

- Knowledge Graphs for exploration
- Revisiting particle optimizing in Model-Based RL via amortized proposals \(Model free example - [\[2001.08116\] Q-Learning in enormous action spaces via amortized approximate maximization](https://arxiv.org/abs/2001.08116)\)
- [\[1704.06440\] Equivalence Between Policy Gradients and Soft Q-Learning](https://arxiv.org/abs/1704.06440)

### Model-Based

- Fixing objective mismatch in MBRL using Expectation Maximization.
- Connections to classic control theory

## Bayesian Inference

- [\[1710.06595\] Variational Inference based on Robust Divergences](https://arxiv.org/abs/1710.06595), [\[1904.02063\] Generalized Variational Inference: Three arguments for deriving new Posteriors](https://arxiv.org/abs/1904.02063)
- How do we utilize self-consistency from Bayes theorem. Can we create tractable formulations for the following divergence problem?

$$
\mathcal{D}\left( p(x)p(y|x) \Big|\Big| p(y)p(x|y) \right)
$$

- [How Good is the Bayes Posterior in Deep Neural Networks Really?](https://arxiv.org/abs/2002.02405)
- EM maximizes the log marginal directly instead of a lower bound in VI. Is it objectively better?

### Learned invariances

- It's probably become more important now than ever to have priors in Neural Networks that satisfy invariances we care about instead of just using $$\mathcal{N}(\mathbf{0}, \mathbf{I})$$. how do we do this? e.g. [Learning Invariances using the Marginal Likelihood](https://papers.nips.cc/paper/8199-learning-invariances-using-the-marginal-likelihood)

### Model Misspecification

- [Variational Bayes under Model Misspecification](https://arxiv.org/abs/1905.10859)

### Uncertainty Calibration

- [\[1706.04599\] On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599)
- [\[2002.02405\] How Good is the Bayes Posterior in Deep Neural Networks Really?](https://arxiv.org/abs/2002.02405)

### Uncertainty Estimation

- [Conservative Uncertainty Estimation By Fitting Prior Networks](https://openreview.net/forum?id=BJlahxHYDS) - Kamil Ciosek, Vincent Fortuin, Ryota Tomioka, Katja Hofmann, Richard Turner

### Gaussian Processes

- What sort of structured variational approximations can improve stochastic variational inference for GPs?
  - [Sparse Orthogonal Variational Inference for Gaussian Processes](https://arxiv.org/abs/1910.10596) - Jiaxin Shi, Michalis K. Titsias, Andriy Mnih

### Implicit Distributions

- [Variational Inference using Implicit Distributions](https://arxiv.org/abs/1702.08235) - Ferenc Huszár
- [Adversarial Variational Bayes: Unifying Variational Autoencoders and Generative Adversarial Networks](https://arxiv.org/abs/1701.04722) - Lars Mescheder, Sebastian Nowozin, Andreas Geiger

## Linear Algebra

- Circulant (in general Toeplitz) matrices allow much faster matrix-vector
  multiplications. For non-Toeplitz ones, we have a notion of "asymptotically
  Toeplitz" under the weak matrix norm (Frobenius). What problems families afford
  such a structure? If they do, can we leverage non-asymptotic guarantees?
