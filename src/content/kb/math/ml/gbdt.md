---
title: "Gradient Boosted Decision Trees: A Recap"
description: A note on the big three gradient boosting algorithms
date: Sep 15 2021, 20:45 -0400
updated: May 27 2023, 15:34 -0400
area: math
---

This technical note is a summary of the _big three_ gradient boosting decision tree (GBDT) algorithms. Some notation has been slightly tweaked from the original to maintain consistency.

## Regularized Gradient Tree Boosting

Gradient boosting is the process of building an ensemble of predictors by performing gradient descent in the functional space.

For an ensemble of $K$ predictors $\phi_{K}(\mathbf{x}) = \sum_{k=1}^Kf_k(\mathbf{x})$ with weak predictors $f$ as decision trees, the typical learning objective is,

$$
\mathcal{L}(\phi_K) = \sum_{i=1}^n\ell(y_i, \phi_K(\mathbf{x}_i)) + \sum_{k=1}^K\Omega(f_k),
$$

for a differentiable loss function $\ell$, and regularization term,

$$
\Omega(f) = \gamma T + \tfrac{1}{2}\lambda \lVert w\rVert^2,
$$

where $T$ is the number of leaves in each tree $f$, and $w \in \mathbb{R}^T$ is the vector of continuous scores for each leaf. Note that classical GBDT does not include the regularization term.

This optimization problem cannot be solved by the traditional optimization methods, and therefore we resolve to _boosting_: selecting one best function in each round. Hence, we solve the greedy objective,

$$
\mathcal{L}(f_k) = \sum_{i=1}^n\ell(y_i, \phi_{k-1}(\mathbf{x}_i) + f_k(\mathbf{x}_i)) + \Omega(f_k),
$$

Using a second-order Taylor expansion of $\ell$ around $\phi_{k-1}$ leads to a simplified objective. The optimal objective for a given tree structure $q$ then found to be,

$$
\mathcal{L}^\star(q) = -\frac{1}{2}\sum_{t=1}^T\frac{\sum_{i \in I_t} g_i}{\sum_{i\in I_t} h_i + \lambda} + \gamma T,
$$

where $g_i$ and $h_i$ are the first and second order gradients from the Taylor expansion, respectively. $I_t$ is the instance set at leaf $t$.

Since it is practically impossible to evaluate all the kinds of possible tree structures, we add another greedy construction where we start with a single leaf node, and keep splitting. The split candidates can then be evaluated, for instance in terms of "loss reduction".

### Decision Trees

Decision trees are built by recusive partioning of the feature space into disjoint regions for predictions. The main cost in building a decision tree comes from the split-finding algorithm.

This simplest approach to split-finding is a pre-sorted algorithm, which enumerates all possible split points on the pre-sorted feature values. This is the _exact greedy algorithm_, and finds the optimal split points. It is, however, inefficient in both training speed and memory consumption.

The alternative, approximate but much faster approach, is to instead build quantiles of the feature distribution, where the continuous features are split into buckets. The quantiles can be built globally once, or locally at each level in the tree. Local splits are often more appropriate for deeper trees.

High-cardinality categorical variables can be handled via applying one-hot encoding to a smaller number of clustered values. Although, it has generally been noted that converting high-cardinality categorical variables to numerical features is the most efficient method with minimum information loss.

## The Big Three

### XGBoost

**TL;DR**: (i) With machine learning, XGBoost[^@xgboost2016] aims to be smarter and faster about split-finding. (ii) With software engineering, XGBoost relies on column blocks for parallelization, cache-aware access patterns to avoid interleaving read/write access, and block compression for out-of-core computation (similar to columnar storage).

[^@xgboost2016]: Tianqi Chen and Carlos Guestrin. “XGBoost: A Scalable Tree Boosting System.” *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining* (2016). https://arxiv.org/abs/1603.02754

**Weighted Quantile Sketch**: Ideally, we would like to select the $l$ candidate split points for feature in dimension $d$ as $\{s_{d1},s_{d2}\dots,s_{dl}\}$, in a manner that they are distributed evenly over the data ($s_{d1}$ is always the minimum feature value and $s_{dl}$ is always the maximum feature value). The weights are represented by the second-order gradient values. The constraint is to maintain differences between successive _rank functions_ below some threshold value $\epsilon$, such that there are roughly $1/\epsilon$ candidate points. This is available as the `sketch_eps` parameter in XGBoost when `tree_method=approx`.

A version of weighted quantile sketch for non-uniformly weighted data is also proposed with theoretical guarantees.

**Sparsity-aware Split Finding**: To handle missing feature values, XGBoost aims to learn an optimal _default_ direction from data. This _information gain_ on the optimal direction is computed using the same loss reduction formula above. This also works for the quantile-based buckets where the statistics computed only using non-missing values. This provides a unified way of handling all sparsity patterns.

**Misc. Statements of Note**:

- XGBoost notes (as per user feedback), that column subsampling is often more effective to prevent over-fitting that the traditional row subsampling.
- From experiments, XGBoost scales linearly (slightly super-linear) with the increase in number of cores.

### LightGBM

**TL;DR**: The efficiency and scalability of XGBoost still remains unsatisfactory with high $n$ and high $d$ problems. There are two ways to speed this up - (i) reduce data size, or (ii) reduce feature size. But straightforward subsampling is highly non-trivial. LightGBM[^@lightgbm2017] then essentially addresses (i) via Gradient-based One-Side Sampling, and (ii) via Exclusive Feature Bundling.

[^@lightgbm2017]: Ke, Guolin et al. “LightGBM: A Highly Efficient Gradient Boosting Decision Tree.” *NIPS* (2017). https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html

**Gradient-based One-Side Sampling**: Part of the inspiration here is the classical boosting algorithm called AdaBoost where we assign weights to every instance (starting with uniform weighting).

The contention is that when using gradients as a measure of the weight of a sample, uniform subsampling can often lead to inaccurate gain estimation because large gradient magnitudes can dominate. Instead, GOSS relies on a mix of keeping instances whose gradient magnitudes are from a chosen top percentile $a \times 100\%$, and a fraction $b$ are uniformly sampled only from the remainder of the data, amplifying the gradient values by $\frac{1-a}{b}$ to avoid changing the original data distribution by much.

LightGBM them uses a slightly modified version of information gain for split finding, which relies only on reweighted first-order gradients on a subsampled version of the instance set. Theoretical results show that the estimation error of the information gain decays with rate $\mathcal{O}(n^{1/2})$.

**Exclusive Feature Bundling**: High-dimensional data is usually very sparse, and provides us with an opportunity to design a nearly lossless approach to reduce the number of features by combining the ones which are mutually exclusive (e.g. one-hot encoding is mutually exclusive among dimensions, if one is non-zero, others have to be zero). The objective will be to roughly arrive at the same feature histograms using the feature _bundles_ as we would with individual features.

First, to find the exclusive bundles, we note that this is an NP-hard problem (by equivalence to the graph coloring problem where set of vertices with the same color represent mutually exclusive features). Therefore, we can only build using approximate greedy algorithms. To avoid strict constraints to the graph color, we can randomly pollute features, and allowing a degree of conflicts. The weighted graph construction happens such that the weights correspond to the total conflicts between features.

Second, to construct the bundle, we simply merge them in a manner such that the constructed histogram bins assign different features to different bins.

Also see [LightGBM Features](https://lightgbm.readthedocs.io/en/latest/Features.html) for a conceptual overview of many design choices.

**Misc. Statements of Note**:

- LightGBM achieves 2-20x speedup across various classification and ranking problems with _very_ high number of features.

### CatBoost

**TL;DR**: The authors argue that existing implementations suffer from a shift in the predictive distribution caused by _target leakage_. To solve that, CatBoost[^@catboost2017] [^@catboost2018] proposes _Ordered boosting_, which efficiently implements _target statistic_ calculations for categorical features via random permutations.

[^@catboost2017]: Ostroumova, Liudmila et al. “CatBoost: unbiased boosting with categorical features.” *Neural Information Processing Systems* (2017). https://papers.nips.cc/paper_files/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html

[^@catboost2018]: Dorogush, Anna Veronika et al. “CatBoost: gradient boosting with categorical features support.” *ArXiv* abs/1810.11363 (2018) https://arxiv.org/abs/1810.11363

**Greedy Target Statistic and Target Leakage**: One way to convert categorical variable into a numerical value is to compute some target statistic. It aims to estimate the conditional _expected_ target given the value. The most straightforward way is to, compute the empirical conditional, adjusted by a prior $p$ (e.g. empirical average of the target value over the full dataset). For a feature dimension $d$ of input instance $i$,

$$
\widehat{\mathbf{x}}_{id} = \frac{\sum_{j=1}^n \mathbb{1}_{\mathbf{x}_{id} = \mathbf{x}_{jd}}*y_j + ap}{\sum_{j=1}^n \mathbb{1}_{\mathbf{x}_{id} = \mathbf{x}_{jd}} + a}
$$

The problem here is of target leakage. Leave-one-out does not work too. What we want is,

$$
\mathbb{E}\left[\widehat{\mathbf{x}}_{d} \mid y \right] = \mathbb{E}\left[\widehat{\mathbf{x}}_{id} \mid y_i \right]
$$

One way to achieve this is to simply use a held-out set (potentially even including only $\mathbf{x}_i$) to compute the target statistic. But this is wasteful, since training data remains unused.

**Ordered Target Statistic**: A more effective strategy is, inspired by online learning algoritms, to rely on the observed history; in this case a permutation of the training data. Therefore, for a permutation $\sigma$ of the dataset, the target statistic $\widehat{\mathbf{x}}_i$ is computed using data $\mathcal{D}_i = \{\mathbf{x}_j : \sigma(j) < \sigma(i) \}$. To avoid high variance estimates for the preceding instances in the permutation, each boosting round uses a different permutation.

**Prediction Shift**: As a consequence of the target leakage above, all the subsequent distributions are biased, i.e. the predictive distribution of any training point $\phi_{K}(\mathbf{x}) \mid \mathbf{x}$ does not match that of a testing point $\phi_{K}(\mathbf{x}_\star) \mid \mathbf{x}_\star$. Similar is also true for the gradient $g(\mathbf{x}) \mid \mathbf{x}_i$ against the corresponding test instance distribution.

**Practical Ordered Boosting**: In principle, the boosting procedure should ensure to compute residuals using models which do not rely on the data point (i.e. trained with the Ordered TS). This is impractical, and increases the computational complexity by a factor of $n$. One practical trick is to approximate the gradient in terms of cosine similarity. The other is to only store exponentially spaced ticks for the permutations.

**Misc. Statements of Note**:

- Ordered boosting can often be slower in terms of wallclock time.
