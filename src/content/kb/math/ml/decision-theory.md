---
title: Decision Theory
description: Random collection of decision theory basics.
date: May 4 2022, 15:00 -0400
updated: May 27 2023, 15:28 -0400
area: math
---

Consider a country that is deciding whether to buy a vaccine $a_1$ or wait for probably a better one in the pipeline $a_2$. Let's say the efficiacy of the vaccine in question is $w$. The country might determine the "loss" of taking action as,

$$
\ell(w, a) = \begin{cases}
10(1-w), \quad \text{if } a = \textrm{BUY} \\
100, \quad \text{otherwise}
\end{cases}
$$

In statistical inference, the goal is not to make a decision but to provide the summary of statistical evidence. This would be the task of first figuring out $\theta$. Based on that statistical summary, we would want a decision.

Decision theory combines the statistical knowledge gained from information in the samples with other relevant aspects of the problem to make the best decision.

1. Knowledge of possible consequences (quantified in the loss function)
2. Prior information

The _Bayesian expected loss_ of taking an action $a$ is under the posterior,

$$
\rho(\pi^\star, a) = \mathbb{E}_{\pi^\star}\left[\ell(\theta, a)\right]
$$

A frequentist decision-theorist seeks to evaluate _risk_ for every $\theta$ and a decision rule $\delta(x)$ (which directly gives us an action in the no-data case) as

$$
R(\theta,\delta) = \mathbb{E}_{X} \left[\ell(\theta, \delta(x))\right]
$$

So for a problem with no-data, $R(\theta, \delta) = \ell(\theta, \delta)$. The Bayes risk is then just

$$
r(\pi,\delta) = \mathbb{E}_\pi\left[ R(\theta, \delta) \right]
$$

Regarding randomized decision functions, leaving decisions up to chance seems ridiculous in practice. We will rarely use a randomized rule. But is often a useful tool for analysis.

## Decision Principles

**The Conditional Bayes Principle**: Pick a Bayes action $a$ which minimizes $\rho$.

$$
a^\star = \textrm{arg}\min_{a} \left\{\rho(\pi^\star, a) = \mathbb{E}_{\pi^\star}\left[\ell(\theta, a)\right]\right\}
$$

**Frequentist Decision Principles**:[^@Berger1988StatisticalDT] Now these are hard to reason about because we can have many non-dominating decision rules. Risk functions to pick a decision rule is hard in practice. There are more principles to guide the choice.

1. Bayes Risk: This is a single number, so we just pick the decision rule that.
   $$
   \delta^\star_\pi = \textrm{arg}\min_{\delta} \left\{ r(\pi,\delta) = \mathbb{E}_\pi\left[ R(\theta, \delta) \right] \right\}
   $$
2. Minimax: $\sup_{\theta \in \Theta} R(\theta, \delta^\star)$, through a randomized decision rule. This is a worst-case rule.
   $$
   \inf_{\delta} \sup_{\theta} \left\{ R(\theta,\delta) = \mathbb{E}_{X} \left[\ell(\theta, \delta(x))\right] \right\}
   $$
3. Invariance

This is similar to other frequentist principles for inference: like maximum likelihood estimators, unbiasedness, minimum variance, and lease squares risk.

Use points from 4.1 of Berger.[^@Berger1988StatisticalDT]

Bayesian Hypothesis Testing is straightforward. Given two hypotheses, simply compute the Bayes factor: posterior odds ratio.

One-sided hypothesis testing: _p-values_ sometimes have a Bayesian interpretation. Consider testing $H_0 = \theta \leq \theta_0$ and $H_1 = \theta \gt \theta_0$.

$$
\begin{aligned}
\widetilde{w}(\theta \mid x^\star,\mathbf{x},\mathbf{y}) &= \frac{\widetilde{p}(\theta \mid x^\star,\mathbf{x},\mathbf{y})}{\widetilde{p}(\theta \mid \mathbf{x},\mathbf{y})} = \frac{p(\mathbf{y} \mid \mathbf{x}, \theta)p(\theta \mid \mathbf{x},x^\star)}{p(\mathbf{y}\mid \mathbf{x})p(\theta)} = \frac{p(\theta \mid \mathbf{x},x^\star)}{p(\theta)}
\end{aligned}
$$

[^@Berger1988StatisticalDT]: James O. Berger. “Statistical Decision Theory and Bayesian Analysis.” (1988). https://www.jstor.org/stable/2288950
