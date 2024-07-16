---
title: Notes on OOD Generalization
description: Raw notes on OOD generalization.
date: Aug 4 2022, 15:00 -0400
updated: May 27 2023, 16:02 -0400
area: math
---

The greatest challenge is knowing precisely what shifts are possible. It seems a tough problem to develop generalized or automated methods for.

The important aspect to remember is that there are many statistically equivalent decomposition of the data generating process, even when things are not causally conditional. If $p(x)$ does not change, it does not matter, and the model can perform well regardless of the underlying beliefs. Further, models that satisfy the Kolmogorov consistency (e.g. Gaussian processes but not a probabilistic interpretation of SVM objective; see Quionero-Candela et. al.[^@QuioneroCandela2009DatasetSI] Section 1.4), the distribution of the covariates has no bearing on the conditional model by virtue of marginalization. But if the true causal model is different than assumed, and $p(x)$ changes, then this implies an interventional change which will implicitly cause a change in $p(y\mid x)$. Finally, considering only the probabilistic model, without its _decision-theoretic_ implications can be dangerous, e.g. models that don't factor for risk.

[^@QuioneroCandela2009DatasetSI]: Quionero-Candela, Joaquin et al. “Dataset Shift in Machine Learning.” (2009). https://mitpress.mit.edu/9780262545877/dataset-shift-in-machine-learning/

Dataset shift problems may come from mistakenly ignoring some features of the data. Including those features would essentially convert the dataset shift problem to simply the covariate shift problem. For instance, it appears adversarially easy to convert an auditory signal of "sixteen" to "sixty", but would be harder to convert visuals the same way. I think this highlights the importance of _representation learning_ as an important ingredient of OOD robustness in itself.

Ovadia et. al.[^@Ovadia2019CanYT] find that calibration on the validation set leads to well-calibrated predictions on the test set. Further, while temperature scaling can achieve low ECE for low values of shift, the ECE inceases significantly as the shift increases. They conclude that the calibration on the validation set does not guarantee calibration under distributional shift. Post-hoc temperature scaling doesn't necessarily fix this, and deep ensembles consistently provide higher predictive entropy on shifted datasets.

[^@Ovadia2019CanYT]: Ovadia, Yaniv et al. “Can You Trust Your Model's Uncertainty? Evaluating Predictive Uncertainty Under Dataset Shift.” *ArXiv* abs/1906.02530 (2019). https://arxiv.org/abs/1906.02530

In a surprising twist though, Miller et. al.[^@Miller2021AccuracyOT] show that for a wide variety of (non-Bayesian) models, datasets, and hyperparameters, there is a strong linear correlation between in-distribution and out-of-distribution generalization performance. Hyperparameter tuning, early stopping, or changing the amount of i.i.d training data moves the models along the trend line, but does not alter the linear fit. The linear trends are constructed via probit scaling for more precise fits. Although, there are exceptions. Not all distribution shifts via corruptions on the CIFAR-10-C show a good linear fit (low $\mathrm{R}^2$ values). Sometimes the trend lines change, i.e. the models do not move along an existing trend line.

[^@Miller2021AccuracyOT]: Miller, John et al. “Accuracy on the Line: on the Strong Correlation Between Out-of-Distribution and In-Distribution Generalization.” *ArXiv* abs/2107.04649 (2021). https://arxiv.org/abs/2107.04649

Filos et. al.[^@Filos2019ASC] make the case that UCI datasets overfit very easily, and as a consequence the robust and scalable Bayesian inference methods have not made good progress. There is a qualitative difference between approximate inference with small and large models, which is not highlighted by the simpler benchmarks. Clearly, there is a gap.

[^@Filos2019ASC]: Filos, Angelos et al. “A Systematic Comparison of Bayesian Deep Learning Robustness in Diabetic Retinopathy Tasks.” *ArXiv* abs/1912.10481 (2019). https://arxiv.org/abs/1912.10481

Azulay et. al.[^@azulay2019deep] ask why neither the convolutional architecture nor data augmentation are sufficient to achieve the designed invariances. Architectures ignore the classic sampling theorem, and data augmentation does not give invariance because the CNNs learn to be invariant to transforms that are very similar to the typical images from the training set. It is realized that the translation invariance actually does not hold for CNNs due to the subsampling steps (it holds in "literal" terms only at certain factors)

[^@azulay2019deep]: Azulay, Aharon and Yair Weiss. “Why do deep convolutional networks generalize so poorly to small image transformations?” *J. Mach. Learn. Res.* 20 (2018): 184:1-184:25. https://arxiv.org/abs/1805.12177

Sagawa et. al.[^@Sagawa2019DistributionallyRN] argue that regularization may not be too important, such that models can be trained longer and generalize better "on average", but for good "worst-case" performance, regularization is important. The experiments show that by departing from the _vanishingly-training-loss_ regime by (i) very strong $\ell_2$ regularization, and (ii) very early stopping, allows DRO models to significantly outperform ERM models on the worst-group test accuracy while maintaining high average accuracy. The authors propose a group-adjusted DRO estimator which is effectively a $C/\sqrt{n_g}$ term where $C$ is a hyperparameter and $n_g$ is the group size, intuitively motivated by the fact that smaller groups are more prone to overfitting.

[^@Sagawa2019DistributionallyRN]: Sagawa, Shiori et al. “Distributionally Robust Neural Networks for Group Shifts: On the Importance of Regularization for Worst-Case Generalization.” *ArXiv* abs/1911.08731 (2019). https://arxiv.org/abs/1911.08731

Arjovsky et. al.[^@Arjovsky2019InvariantRM] suggest that failing to generalize out-of-distribution is failing to capture the causal factors of variation in data, clinging instead to easier-to-fit spurious correlations, which are prone to change from training to testing domains.

[^@Arjovsky2019InvariantRM]: Arjovsky, Martín et al. “Invariant Risk Minimization.” *ArXiv* abs/1907.02893 (2019). https://arxiv.org/abs/1907.02893

Kirichenko et. al.[^@Kirichenko2020WhyNF] argue that normalizing flows based on affine coupling layers are biased towards learning the low-level properties of the data such as local pixel correlations rather than semantic properties of the data. The maximum likelihood objective has a limited influence on OOD detection, relative to the inductive biases of the flow. Further, they show that the coupling layers co-adapt to make predictions. The simple fix around this issue is to change the masking strategy in the coupling layers to a _cycle mask_ or add an _information bottleneck_ to prevent coupling layer co-adaptation. More interestingly, using pretrained embeddings for natural images, or with the tabular datasets, none of these issues arise.

[^@Kirichenko2020WhyNF]: Kirichenko, P. et al. “Why Normalizing Flows Fail to Detect Out-of-Distribution Data.” *ArXiv* abs/2006.08545 (2020). https://arxiv.org/abs/2006.08545

Gulrajani et. al.[^@Gulrajani2020InSO] perform an exhaustive set of experiments to conclude that much of the progress over the last decade is beat by modern ERM itself. Table 2 provides a nice summary of all the learning-from-data problems we have to date, and the rest of the work aims to bring model selection to the fore. The main recommendation is that a domain generalization algorithm should be responsible for model selection. The authors provide a good set of datasets via their benchmark [DOMAINBED](https://github.com/facebookresearch/DomainBed). The authors also mostly identify four big ways to induce invariance for generalization:

- learning invariant features,
- sharing parameters,
- meta-learning,
- or performing data augmentation.

[^@Gulrajani2020InSO]: Gulrajani, Ishaan and David Lopez-Paz. “In Search of Lost Domain Generalization.” *ArXiv* abs/2007.01434 (2020). https://arxiv.org/abs/2007.01434

Lan et. al.[^@Lan2020PerfectDM] argue for the case that perfect density models cannot guarantee anomaly detection by showing that discrepancies like curse of dimensionality and distribution mismatch exist even with perfect densit models, and therefore goes beyond issues of estimation, approximation, or optimization errors. Two cases are highlighted - (i) one can map any distribution to a uniform distributions using an invertible transformation, but outlier detection in a uniform distribution is impossible. But an invertible transform preserves information, and therefore outlier detection should at least be as hard in any other representation different from uniform too! (ii) Along similar lines, there exist reparametrizations such that density under new representations matches a desired arbitrary score to mislead the density-based method into wrong classification of anomalies.

[^@Lan2020PerfectDM]: Lan, Charline Le and Laurent Dinh. “Perfect Density Models Cannot Guarantee Anomaly Detection.” *Entropy* 23 (2020). https://pubmed.ncbi.nlm.nih.gov/34945996/

With high-fidelity approximate inference using full-batch HMC, Izmailove et. al.[^@Izmailov2021WhatAB] have eventually shown that under domain shift, SGLD/SGHMC are closer to deep ensembles (in terms of _total variation distance_ and _predictive agreement_), than to the HMC posterior predictive. MFVI is even farther away from the HMC posterior. Data augmentation causes trouble with exact Bayesian inference, and therefore it appears reasonable to think that invariances should come through the prior, and not the likelihood term.

[^@Izmailov2021WhatAB]: Izmailov, Pavel et al. “What Are Bayesian Neural Network Posteriors Really Like?” *International Conference on Machine Learning* (2021). https://arxiv.org/abs/2104.14421

[^@Izmailov2021DangersOB] argues that the lack of robustness under covariate shift for Bayesian neural networks is fundamentally caused by linear dependencies in the inputs. Cold posteriors provide marginal but inconsistent improvements across a set of corruptions. BNNs show most competitive performance in-distribution and on the corruptions representing affine transformations.

[^@Izmailov2021DangersOB]: Izmailov, Pavel et al. “Dangers of Bayesian Model Averaging under Covariate Shift.” *Neural Information Processing Systems* (2021). https://arxiv.org/abs/2106.11905

The key intuition here is that along the directions of low variance in the eigenspace, the MAP solution would effectively set them to zero, whereas a BNN would still sample from the prior. This makes the MAP solutions more robust. Any perturbations orthogonal to this hyper-plane induced by (nearly-)constant projections will cause trouble with the BNN.

This reminds us of the case of Bayesian Lasso. The Laplace prior does not have enough mass around zero to be meaningfully sparse in practice with a Bayesian treatment. The MAP estimate is then in fact qualitatively very different.

Bommasani et. al.[^@Bommasani2021OnTO] talks about the role of _Foundation Models_ in creating models robust to distribution shifts, as existing work has shown that pretraining on unlabeled data is an effective and general purpose way to improve on OOD test distributions.

[^@Bommasani2021OnTO]: Bommasani, Rishi et al. “On the Opportunities and Risks of Foundation Models.” *ArXiv* abs/2108.07258 (2021). https://arxiv.org/abs/2108.07258

Ming et. al.[^@Ming2021OnTI] aims to formalize the problem of OOD detection from the perspective of _spurious_ (test samples that contain only the non-invariant features, e.g. environment) and _non-spurious_ (test samples that contain no relevant features, e.g. outside the class altogether) data. This work provides evidence that spurious correlation hurts OOD detection. Although, the theoretical results tell a mixed story:

> The invariant classifier learned does not necessarily only depend on invariant features, and it is possible to learn invariant classifier that relies on the environmental features while achieving lower risk that the optimal invariant classifier.

[^@Ming2021OnTI]: Ming, Yifei et al. “On the Impact of Spurious Correlation for Out-of-distribution Detection.” *ArXiv* abs/2109.05642 (2021). https://arxiv.org/abs/2109.05642

MEMO[^@Zhang2021MEMOTT] aims to introduce a plug-and-play method for test-time robustification of models via marginal entropy maximization with one test point.

> Optimizing the model for more confident predictions can be justified from the assumption that the true underlying decision boundaries between classes lie in low density regions of the data space

[^@Zhang2021MEMOTT]: Zhang, Marvin et al. “MEMO: Test Time Robustness via Adaptation and Augmentation.” *ArXiv* abs/2110.09506 (2021). https://arxiv.org/abs/2110.09506

### Thoughts

- Does BMA avoid/solve any of these problems: (i) spurious correlations, (ii) extrapolation, or (iii) temporal shift?
- Are approximate likelihood maximization and predictive performance fundamentally at odds?
  - Conventional wisdom is that when using a proper scoring rule (like the likelihood), the optimum of the score corresponds to the perfect prediction. But in practice, this isn't working. See scoring and calibration discussion of Ovadia et. al.[^@Ovadia2019CanYT]
- Improving fits to HMC doesn't necessarily improve predictive performance. This means the goals should be different?
- Lan et. al.[^@Lan2020PerfectDM] reminds us of the debate around flat-vs-sharp minima. There exist sharp minima which generalize poorly. But SGD appears to be biased towards finding flat minima, partly because they occupy much more volume that it is statistically unlikely to arrive at a sharp minima. Similarly, even though there exist such invertible transformations which map any distribution to a uniform distribution, is finding such a transformation likely under the inductive biases posed by contemporary NN training routines?
- What is the role of pretraining towards OOD shift?[^@Hendrycks2019UsingSL] Methodological contributions have fallen short, but just simple pretraining works?[^@Hendrycks2020PretrainedTI]
- Isn't Sagawa et. al.[^@Sagawa2019DistributionallyRN] essentially hinting towards a case for being a little bit more Bayesian? Particularly, they highlight that training to zero loss makes worse-case group accuracy terrible. This is like over-committing to a single parameter configuration. In addition, it is easier to overfit to smaller groups. Again we have a small-sample problem and quantifying epistemic uncertainty should be important for the predictive distribution.
- In the spirit of modern work that shows multi-modal datasets can help generalization, can we use image segmentation maps to avoid spurious correlations that rely on non-invariant environmental features like in the background?
- An Occam's Razor view of the problem of domain generalization?
- Data augmentation appears to be clearly doing something meaningful when it works. What will automated data augmentation pipelines look like? How do we learn from our objectives what data augmentation is needed? Although, it would also appear that existing data augmentation techniques provide a very weak invariance[^@azulay2019deep].

[^@Hendrycks2019UsingSL]: Hendrycks, Dan et al. “Using Self-Supervised Learning Can Improve Model Robustness and Uncertainty.” *ArXiv* abs/1906.12340 (2019). https://arxiv.org/abs/1906.12340

[^@Hendrycks2020PretrainedTI]: Hendrycks, Dan et al. “Pretrained Transformers Improve Out-of-Distribution Robustness.” *ArXiv* abs/2004.06100 (2020). https://aclanthology.org/2020.acl-main.244.pdf

#### Practical Bits

- Reweighting unbalanced classes by relative frequencies in each minibatch.[^@Leibig2016LeveragingUI]
- Pretraining image embeddings provides better OOD detection that training normalizing flows on the raw data.[^@Kirichenko2020WhyNF]
- Lan et. al.[^@Lan2020PerfectDM] has a nice visualization comparing _density_-based versus _typicality_-based outlier detection.

[^@Leibig2016LeveragingUI]: Leibig, Christian et al. “Leveraging uncertainty information from deep neural networks for disease detection.” *Scientific Reports* 7 (2016). https://www.nature.com/articles/s41598-017-17876-z

### Benchmarks

- WILDS[^@Koh2020WILDSAB]
- DOMAINBED[^@Gulrajani2020InSO]
- BREEDS[^@Santurkar2020BREEDSBF]
- Diabetic Retinopath[^@Filos2019ASC]
- The Fishyscapes Benchmark[^@Blum2019TheFB]
- Galaxy Zoo[^@Walmsley2019GalaxyZP]

[^@Koh2020WILDSAB]: Koh, Pang Wei et al. “WILDS: A Benchmark of in-the-Wild Distribution Shifts.” *International Conference on Machine Learning* (2020). https://arxiv.org/abs/2012.07421

[^@Santurkar2020BREEDSBF]: Santurkar, Shibani et al. “BREEDS: Benchmarks for Subpopulation Shift.” *arXiv: Computer Vision and Pattern Recognition* (2020). https://arxiv.org/abs/2008.04859

[^@Blum2019TheFB]: Blum, Hermann et al. “The Fishyscapes Benchmark: Measuring Blind Spots in Semantic Segmentation.” *International Journal of Computer Vision* 129 (2019): 3119 - 3135. https://link.springer.com/article/10.1007/s11263-021-01511-6

[^@Walmsley2019GalaxyZP]: Walmsley, Mike et al. “Galaxy Zoo: Probabilistic Morphology through Bayesian CNNs and Active Learning.” *ArXiv* abs/1905.07424 (2019). https://arxiv.org/abs/1905.07424

## Structure & Taxonomy

Possible dataset shifts (See graphical models in Quionero-Candela et. al.[^@QuioneroCandela2009DatasetSI]):

- Simple Covariate Shift (change in input covariates $p(x)$)
- Prior Probability Shift (change in target $p(y)$)
- Sample Selection Bias (selection process of a sample is dependent on target $y$)
- Imbalanced Data
- Domain Shift
