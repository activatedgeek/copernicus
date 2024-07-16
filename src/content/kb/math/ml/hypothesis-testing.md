---
title: Hypothesis Testing
description: Living document on hypothesis testing from scratch.
date: May 26 2023, 16:41 -0400
updated: Dec 17 2023, 21:07 -0400
area: math
---

An important task in experimental science is to determine whether the change in observed variables comes from randomness or a real causal effect. Providing a statistical answer to the question of vaccine efficacy takes a similar form. Such questions are formalized as choosing between two hypotheses:

- $H_0$ **The Null Hypothesis**: There is no effect on the observed variables, and any variations are purely a matter of chance/randomness. (Both vaccines are equally effective)

* $H_1$ **The Alternative Hypothesis**: The observed variables are not independent of the experimental variables, and _may_ be causally related. (Both vaccines are not equally effective)

A foundational idea in hypothesis testing is **randomization** - what would happen if there was no dependence between the experimental variables and the observations were randomly assigned to all experimental variables.

We construct a distribution over a problem-specific **test statistic** (e.g. sample mean, difference of sample means) and compute the **p-value** - the cumulative probability of how the _null statistic_, test statistic under the assumption that $H_0$ is true, relates to the _observed statistic_ [^@IMS2023]. A _low_ p-value is considered to be **statistically significant** - we reject $H_0$ and accept $H_1$.

## Binary Random Variable

We distinguish between a population statistic $p$ and a sample statistic $\hat{p}$, both proportions. For instance, $p$ can be the historical complication rate of a surgery over a country's population and $\hat{p}$ can be the complication rate reported by a neighborhood surgeon, merely a sample of the whole population. One can now pose a statistical question: is $\hat{p} < p$?.

### Parametric Bootstrap Simulation

By assuming the null hypothesis is true, for each observation in the sample we simulate a complication with probability $p$, and construct the null statistic $\hat{p}_\mathrm{sim}^{(1)}$. By many repeated simulations, we can construct an empirical distribution over the null statistic $\hat{p}$. For $S$ simulations, the p-value is computed as,

$$
\text{p-value} = \frac{1}{S} \sum_{i=1}^S \mathbb{I}[\hat{p}_{\mathrm{sim}}^{(i)} < p]
$$

The p-value here is _estimated_, and the variability is the statistic is assumed to be normal. Such an assumption is valid when the observations are independent and the sample size is _large_.

## Two Binary Random Variables

Often such a situation arises in treatment studies where under a randomized control trial, we want to compare the efficacy of a "treatment" $\hat{p}_T$ against a "control" $\hat{p}_C$.

The _null hypothesis_ $H_0$ is that there is no difference between treatment and control. Here again, we re-randomize the outcome for each unit (person) in the trial and construct a distribution of the null statistic, i.e. difference in the means of treatment and control group.

We compute the p-value of the observed statistic under the null distribution and go through the same accept/reject decision.

To get a confidence interval, we simply bootstrap from both the treatment sample and control sample multiple times to construct an estimate of distribution over the difference of means (proportions).

## Refererences

Section 4 of Raschka[^@Model2018] provides a good summary of the possibilities in classical hypothesis testing.

Chapters 1-5 of Box & Tiao[^@Bayesian1973] for a deeper dive.

William's Test between two dependent correlations sharing a variable.

[The Permutation Test: A Visual Explanation of Statistical Testing](https://www.jwilber.me/permutationtest/) by Jared Wilber (2019)

[Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://link.springer.com/article/10.1007/s10654-016-0149-3)

[Everything is a Linear Model](https://danielroelfs.com/blog/everything-is-a-linear-model/) by Daniel Roelfs (2022)

[Common statistical tests are linear models (or: how to teach stats)](https://lindeloev.github.io/tests-as-linear/) by Jonas Kristoffer Lindeløv (2019)

Nonparametric Statistics Book[^@npsm2015]

[^@IMS2023]: https://www.openintro.org/book/ims/

[^@Model2018]: Raschka, S. (2018). Model Evaluation, Model Selection, and Algorithm Selection in Machine Learning. ArXiv, abs/1811.12808. https://arxiv.org/abs/1811.12808

[^@Bayesian1973]: Box, G.E., & Tiao, G.C. (1973). Bayesian inference in statistical analysis. International Statistical Review, 43, 242.

[^@npsm2015]: Hollander, M., Wolfe, D.A., & Chicken, E. (1973). Nonparametric Statistical Methods. https://onlinelibrary.wiley.com/doi/book/10.1002/9781119196037
