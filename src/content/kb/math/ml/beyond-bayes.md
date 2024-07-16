---
title: Beyond Bayes
description: A visual inspection into my IMDb ratings using Altair
date: Apr 15 2022, 15:00 -0400
updated: May 27 2023, 15:26 -0400
area: math
---

Zellner[^@Zellner1988OptimalIP] shows that under a well-specified model, Bayes' theorem is the optimal information processing rule. All our problems arise for the misspecified setting. We still can do inference, but we get optimality in the KL-projection sense. And since KL-divergence is sensitive to the tails, in a small-data regime, Bayes' rule would be sensitive to outliers. Jaynes[^@JaynesBayes] says Bayes rule is the best thing towards inductive inference and comes from the angle of logic.

[^@Zellner1988OptimalIP]: Arnold Zellner. “Optimal Information Processing and Bayes's Theorem.” *The American Statistician* 42 (1988): 278-280. https://ideas.repec.org/p/fth/socaec/m8803.html

[^@JaynesBayes]: WWW - [Probability Theory As Extended Logic](https://bayes.wustl.edu)

The generalized posterior is given by (with $\eta = 1$ recovering the Bayes' rule),

$$
\pi(\theta \mid \mathcal{D}) \propto p(\mathcal{D}\mid\theta)^\eta \pi(\theta)
$$

Part of the research community focuses on techniques to find a good $\eta$.

This idea is also known as _power likelihood_, coming from the statistics community as a mild way to handle misspecification. When $\eta \gt 1$, we are essentially putting more weight on data that the prior, giving posteriors that underestimate uncertainty. One way to choose this value is to ensure that the information gain from a single sample is the same as it would be for the true model. Holmes and Walker[^@Holmes2017AssigningAV] derive such an update via the expected divergence in Fisher information, and show that their model is closer to the true model. The true model for the purposes of divergence estimation is built via an empirical estimate.

[^@Holmes2017AssigningAV]: Chris C. Holmes and Stephen G. Walker. “Assigning a value to a power likelihood in a general Bayesian model.” *arXiv: Methodology* (2017) https://academic.oup.com/biomet/article/104/2/497/3074978

From a loss function perspective, $\eta$ can be regarded as the learning rate of the update rule.

$$
\pi(\theta \mid \mathcal{D}) \propto e^{-\eta \mathcal{L}(\mathcal{D}; \theta)} \pi(\theta)
$$

The convergence rates of both methods in the worst care are $\mathcal{O}(D(\pi(\theta\mid\mathcal{D})\mid\mid \pi(\theta))/\sqrt{n})$ where $D$ is a complexity term slower than the denominator. Both are effectively the same problem, and the grand goal would be find practical values of $\eta$ (since theoretical values don't work in practice).

Grunwald and van Ommen[^@Grunwald2014InconsistencyOB] show via a simple Bayesian linear regression model in a misspecified model scenario, Bayesian model averaging (BMA) does not learn with fewer samples, but at some point recovers. As conjectured, Bayes never recovers if hypothesis class of models is infinite in size. For finite ones, Bayes does eventually recover, requiring many more samples. This issue also did not have anything to do with outliers v/s inliers. Under model misspecification (and certain other _stronger_ conditions), Bayes concentrates around the closest points in terms of the KL divergence.

[^@Grunwald2014InconsistencyOB]: Peter D. Grunwald and Thijs van Ommen. “Inconsistency of Bayesian Inference for Misspecified Linear Models, and a Proposal for Repairing It.” *arXiv: Statistics Theory* (2014) https://arxiv.org/abs/1412.3730

Grunwald and van Ommen[^@Grunwald2014InconsistencyOB] argue that Bayesian model selection, when viewed from the prequential coding MDL (Minimum Description Length) lens, fails because we are expecting to pick a model $\mathcal{M}$ which minimizes the following negative log-likelihood,

$$
-\log{p(\mathcal{D}\mid \mathcal{M})} = \sum_{i=1}^n-\log{p(\mathcal{D}_i \mid \mathcal{D}_{i-1},\mathcal{M})} = \sum_{i=1}^n-\log{\mathbb{E}_{\theta \sim \pi\mid\mathcal{D}_{i-1},\mathcal{M}}[p(\mathcal{D}_i\mid\theta)]}
$$

This contains a mixture distribution due to the expectation. Safe Bayesian approaches instead take the mean $\overline{\theta} = \mathbb{E}_{\theta \sim \pi\mid\mathcal{D}_{i-1},\mathcal{M}}[\theta]$. This means we are averaging in the parameter space, instead of the probability space, such that we make a prediction using a distribution which is always within the model.

A BDL Panel in 2016[^@bdl2016panel] notes that PGMs were effectively meant for the holy-grail of composability. It is only that the inference methods have lagged behind. We don't need uncertainty over everything. Max Welling argues that the true promise of Bayesian methods is model selection.

[^@bdl2016panel]: YouTube - ["Is Bayesian deep learning the most brilliant thing ever?" - a panel discussion](https://www.youtube.com/watch?v=HumFmLu3CJ8)

## Cold Posteriors

Adlam et al.[^@Adlam2020ColdPA] argue that commonly used priors in BNNs significantly overestimate the aleatoric uncertainty in the labels of classification benchmarks. When specifying a prior over functions, we must account for both epistemic and aleatoric uncertainty. If the aleatoric uncertainty is low, we must favor functions that assign higher probabilities to a single class. Cold posterior $T < 1$ then reduces this aleatoric uncertainty. It is pretty straightforward to see this analytically in the GP regression case, practically implying if we estimate aleatoric uncertainty correctly, there is not cold posterior effect, but if we overestimate aleatoric uncertainty, then we need $T > 1$ correction.

> we believe that there is no reason to expect that initialization schemes which achieve good performance in vanilla NNs will give rise to appropriate priors for BNNs.[^@Adlam2020ColdPA]

[^@Adlam2020ColdPA]: Ben Adlam et al. “Cold Posteriors and Aleatoric Uncertainty.” *ArXiv* abs/2008.00029 (2020) https://arxiv.org/abs/2008.00029

Nabarro et. al.[^@Nabarro2021DataAI] try to incorporate data augmentation into a generative model of the data, but cannot get rid of the cold posterior effect still. The general idea is to marginalize out the augmentations using a distribution over augmentations conditional on the sample of interest. The authors also try two variants of enforcing invariance: through averaging the logits or averaging the predictive probabilities. Averaging logits appears to be better at higher temperatures, and cold posterior effect is much less pronounced.

[^@Nabarro2021DataAI]: Seth Nabarro et al. “Data augmentation in Bayesian neural networks and the cold posterior effect.” *ArXiv* abs/2106.05586 (2021) https://arxiv.org/abs/2106.05586

Aitchison[^@Aitchison2020AST] shows that if we consider a scenario where the dataset curation is considered into effect, we can recover tempered likelihoods from a situation where the label is Y only when every human labeled the input precisely the same way (and otherwise `None`), i.e. we using a factorized distribution: $p(Y = y \mid x) = \prod_{h=1}^H p(Y_h = y \mid x) = p(Y_h = y \mid x)^H$ over $H$ human labelers, and taking $H = 1/T$, we immediately get the tempered likelihood factor. Interestingly, considering $p(Y=y\mid Y \neq \texttt{None}, x)$ gives us a reparametrized softmax. Although, for full Bayesian inference, we must marginalize over this generative process and therefore the optimal tempering shouldn't be the same. Full Bayesian inference is impossible, because it involves a $p(X)$ factor that we do not know about.

[^@Aitchison2020AST]: Laurence Aitchison. “A statistical theory of cold posteriors in deep neural networks.” *ArXiv* abs/2008.05912 (2020) https://arxiv.org/abs/2008.05912

Noci et al.[^@Noci2021DisentanglingTR] addresses the _dataset curation hypothesis_[^@Aitchison2020AST], _data augmentation hypothesis_[^@Izmailov2021WhatAB], and the _bad prior hypothesis_[^@Wenzel2020HowGI].

> Cold posteriors observed "in the wild" are therefore unlikely to arise from a single simple cause; as a result, we do not expect a simple "fix" for cold posteriors.

- Using consensus procedure to curate the training set[^@Aitchison2020AST], they find that there is no cold posterior effect (CPE). Oddly, curating the test set does cause the CPE.
- They further show that data augmentation is _sufficient_ but not necessary and find that the cold posterior effect is stronger for smaller number of samples. Since smaller number of samples imply stronger influence from the prior, it is hypothesized that the prior may be at fault.
- From a toy example, it is also shown that tempered posteriors tend to learn simpler decision boundaries, although the experiments here are limited, as to the interaction between prior scale and the generalization.

[^@Noci2021DisentanglingTR]: Lorenzo Noci et al. “Disentangling the Roles of Curation, Data-Augmentation and the Prior in the Cold Posterior Effect.” *ArXiv* abs/2106.06596 (2021) https://arxiv.org/abs/2106.06596

[^@Izmailov2021WhatAB]: Pavel Izmailov et al. “What Are Bayesian Neural Network Posteriors Really Like?” *International Conference on Machine Learning* (2021). https://arxiv.org/abs/2104.14421

[^@Wenzel2020HowGI]: F. Wenzel . et al. “How Good is the Bayes Posterior in Deep Neural Networks Really?” *International Conference on Machine Learning* (2020). https://arxiv.org/abs/2002.02405

Zeno et al.[^@Zeno2021WhyCP] argue that good priors should be input-dependent.

[^@Zeno2021WhyCP]: Chen Zeno et al. “Why Cold Posteriors? On the Suboptimal Generalization of Optimal Bayes Estimates.” (2021). https://openreview.net/forum?id=cu6zDHCfhZx

Fortuin et. al.[^@Fortuin2021BayesianNN] study the cold posterior effect from the lens of misspecified priors. They find that spatially correlated priors are better in CNNs while heavy-tailed priors are better in FCNNs. They also find that when fitting the DOF $\nu$ of a Student-t distribution, the lower layers achieve small $\nu$, whereas higher layers exhibit large $\nu$ (i.e. closer to a Gaussian). While these priors reduce the cold posterior effect in FCNNs, they make it worse in ResNets. Therefore, a lot of conflicting evidence.

[^@Fortuin2021BayesianNN]: Vincent Fortuin et al. “Bayesian Neural Network Priors Revisited.” *ArXiv* abs/2102.06571 (2021). https://arxiv.org/abs/2102.06571

Kapoor et. al.[^@Kapoor2022OnUT] show a descriptive theory of how tempering is connected to aleatoric uncertainty.

[^@Kapoor2022OnUT]: Sanyam Kapoor et al. “On Uncertainty, Tempering, and Data Augmentation in Bayesian Classification.” *ArXiv* abs/2203.16481 (2022) https://arxiv.org/abs/2203.16481

## Other Resources

For an quick introduction to conformal prediction, see a [Gentle Introduction to Conformal Prediction](https://people.eecs.berkeley.edu/~angelopoulos/blog/posts/gentle-intro/).

See also [Generalizing Bayesian Inference](http://www.lorenzopacchiardi.me/blog/2021/generalizedBayes/), Knoblauch et al.[^@Knoblauch2019GeneralizedVI], Jewson et. al.[^@Jewson2018PrinciplesOB], Dempster[^@Dempster1968AGO].

[^@Knoblauch2019GeneralizedVI]: Jeremias Knoblauch et al. “Generalized Variational Inference: Three arguments for deriving new Posteriors.” *arXiv: Machine Learning* (2019) https://arxiv.org/abs/1904.02063

[^@Jewson2018PrinciplesOB]: Jack Jewson et al. “Principles of Bayesian Inference Using General Divergence Criteria.” *Entropy* 20 (2018). https://pubmed.ncbi.nlm.nih.gov/33265532/

[^@Dempster1968AGO]: Arthur P. Dempster. “A Generalization of Bayesian Inference.” *Classic Works of the Dempster-Shafer Theory of Belief Functions* (1968). https://link.springer.com/chapter/10.1007/978-3-540-44792-4_4

See Pesonen et al.[^@Pesonen2021ABCOT] for references from non-ML fields. See Abdar et al.[^@Abdar2020ARO] for review on uncertainty quantification, especially Section 7.1 on _Literature Gaps and Open Issues_.

[^@Pesonen2021ABCOT]: Henri Pesonen et al. “ABC of the future.” *International Statistical Review* (2021). https://arxiv.org/abs/2112.12841

[^@Abdar2020ARO]: Moloud Abdar et al. “A Review of Uncertainty Quantification in Deep Learning: Techniques, Applications and Challenges.” *Inf. Fusion* 76 (2020): 243-297. https://arxiv.org/abs/2011.06225
