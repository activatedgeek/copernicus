---
title: The Stein Gradient
description: Visualizing the simple yet powerful Stein gradient for sampling (with notebook)
date: Mar 17 2019, 12:00 -0400
area: math
redirectsFrom:
  - /blog/ml/stein-gradient
  - /machine-learning/stein-gradient
---

Machine Learning is all about dealing with uncertainty of outcomes and Bayesian inference provides us a principled way to reason about the same. We combine the observed data with priors to build (potentially complex) posteriors over the variables of interest and use those for answering subsequent questions. The ability to model a probability distribution called the posterior allows us to quantify the uncertainty claims for any downstream tasks.

$$
\overbrace{p(\Theta|\mathbf{X})}^{\text{posterior}} = \frac{\overbrace{p(\mathbf{X}|\Theta)}^{\text{likelihood}}\overbrace{p(\Theta)}^{\text{prior}}}{\underbrace{P(\mathbf{X})}_{\text{evidence}}}
$$

However, the posterior is a tricky term to compute because of the computationally intensive integral term in the denominator (the evidence). Without having access to the true closed form of the posterior, the next best thing to have is a representative set (more formally the _typical set_ [^@betancourt2017geometric] from the posterior distributions' _high_ density regions. Over the years, researchers have developed a handful of umbrella techniques, all of which converge to the true distribution in the limit of the number of samples - conjugate priors for mathematical convenience [^@gelman2013bayesian], Markov Chain Monte Carlo (MCMC) family of algorithms especially the Hamiltonian Monte Carlo (HMC) [^@neal2012mcmc] [^@brooks2011handbook], Variational Inference [^@jordan1999introduction] [^@ranganath2014black] via approximate posteriors, Normalizing Flows [^@rezende2015variational] for deterministic transforms. All these methods have been immensely successful in modern Bayesian analysis.

However, like all feasible methods, these make trade offs - using conjugate priors limits the richness of the posterior densities and restricts us to only mathematically convenient likelihood-prior combinations; the MCMC family requires us to carefully design the transition kernel of the Markov chain and the SDE integrator for numerical stability; Variational Inference can lead to posteriors that under-estimate the support of the true distribution because of the nature of forward KL divergence optimization; Normalizing Flows demand an exact parametric form of the bijectors where the computation of the determinant of the Jacobian needs to be tractable. Today we will look at an approach which does away with all the previous pathologies (not to say it doesn't introduce new ones) called the kernelized Stein Gradient.

We will first summarize the key background topics needed to understand, state the formal results underlying the Stein gradient and then visualize via code how this technique can be used to build powerful samplers.

## Background

### Kernels

Kernels are a very neat idea where the objective is to map our raw input space $\mathcal{X}$ to an abstract vector space $\mathcal{H}$ so that we can define similarity in terms of dot products and get all the geometric niceties of angles, lengths and distances [^@scholkopf2001learning]. Formally, the most important equations can be summarized as

$$
\begin{aligned}
\mathbf{\Phi}:& \mathcal{X} \to \mathcal{H} \\
&\mathcal{x} \mapsto \mathbf{x} \triangleq \mathbf{\Phi}(\mathcal{x}) \\
k(x, x^\prime) &= \langle \mathbf{\Phi}(\mathcal{x}), \mathbf{\Phi}(\mathcal{x}^\prime) \rangle
\end{aligned}
$$

The key idea is that given a kernel function, we can construct a feature space (more formally known as the _Hilbert space_ in functional analysis) such that the kernel computes a dot product in that feature space. The terminology kernel comes from a function $k$ which gives rise to the following integral operator $T_k$

$$
(T_kf)(x) = \int_{\mathcal{X}} k(x, x^\prime) f(x) dx^\prime
$$

Intuitively, one can imagine this operator to be a rich representation in terms of the linear combination over the full
space where the combination coefficients are defined by the kernel function. By extending this idea and a particular construction, we arrive at the idea of _representer of evaluation_ which leads to the classic notion of _reproducing kernel Hilbert space (RKHS)_.

### Stein's Identity

Let $p(x)$ be a smooth density supported on $\mathcal{X} \subseteq \mathbb{R}^d$
and $\mathbf{\phi}(x)$ is a smooth vector function, the Stein's identity states that under a Stein operator $\mathcal{A}_p$,

$$
\begin{aligned}
\mathbb{E}_{x \sim p}\left[ \mathcal{A}_p\phi(x) \right] &= 0 \\
\text{where}, \mathcal{A}_p\phi(x) &= \phi(x) \nabla_x \log{p(x)}^T + \nabla_x \phi(x)
\end{aligned}
$$

We need mild boundary conditions for the above to be true - either $p(x)\phi(x) = 0\text{ }\forall x \in \partial\mathcal{X}$ when $\mathcal{X}$ is compact or $\lim_{||x|| \to \infty}p(x)\phi(x) =0$ when $\mathcal{X} = \mathbb{R}^d$. A function $\phi$ belongs to the Stein class of $p$ if the Stein identity holds.

### Stein Discrepancy

Let us consider another smooth density $q(x)$ and $\phi$ belongs to the Stein class of $q$ (but not $p$). After some simple manipulations, we can see that

$$
\begin{aligned}
\mathbb{E}_q\left[\mathcal{A}_p\phi(x)\right] &= \mathbb{E}_q\left[\mathcal{A}_p\phi(x) - \mathcal{A}_q\phi(x)\right] \\
&= \mathbb{E}_q\left[ (\nabla_x \log{p(x)} - \nabla_x \log{q(x)}) \phi(x)^T \right]
\end{aligned}
$$

Intuitively, this can be seen as a function weighted by the difference of the score functions of both the distributions. It has been shown [^@gorham2015measuring] that

$$
\mathbb{E}_q\left[ (\nabla_x \log{p(x)} - \nabla_x \log{q(x)}) \phi(x)^T \right] = \mathbb{E}_q\left[trace(\mathcal{A}_p\phi(x))\right]
$$

Note that the use of trace for the matrix norm is only meant to make it a scalar and other matrix norms may be considered. If we consider the maximum value over some family of test functions, we get the _Stein Discrepancy_ measure.

$$
\mathbb{S}(q, p) = \underset{\phi \in \mathcal{F}}{\max} \left\{ (\mathbb{E}_q\left[trace(\mathcal{A}_p\phi(x))\right])^2 \right\}
$$

This can be thought of as a maximum possible violation under the family of test functions away from $p$. However, it turns out that the computational tractability of this measure is critically dependent on the choice of family of test functions $\mathcal{F}$ (and mostly not possible).

### Kernelized Stein Discrepancy

If we choose the family of test functions to be the unit norm RKHS, it turns out we can find out a closed form for the Stein Discrepancy measure [^@liu2016kernelized].

$$
\begin{aligned}
\mathbb{S}(q, p) &= \underset{\phi \in \mathcal{H}^d}{\max} \left\{ (\mathbb{E}_q\left[trace(\mathcal{A}_p\phi(x))\right])^2, ||\phi||_{\mathcal{H}^d} \leq 1 \right\} \\
&= ||\mathbf{\phi}^\star_{q,p}||_{\mathcal{H}^d}^2 \\
\text{where, } \mathbf{\phi}^\star_{q,p}(\cdot) &= \mathbb{E}_q\left[ \mathcal{A}_p k(x, \cdot) \right]
\end{aligned}
$$

This measure is zero if and only if $q = p$. The power of this result is realized by the _Stein Variational Gradient Descent_.

## Stein Variational Gradient Descent

As it turns out, under a deterministic transform (a one step normalizing flow) $z = \mathbf{T}(x) = x + \epsilon \mathbf{\phi}(x), \text{where } x \sim q(x)$, we have [^@liu2016stein].

$$
\nabla_\epsilon KL(q_{[\mathbf{T}]} || p) \bigg|_{\epsilon = 0} = - \mathbb{E}_q\left[trace(\mathcal{A}_p\phi(x))\right]
$$

The distribution of $q_{[\mathbf{T}]}$ can be given by the change of variable formula for probability distributions

$$
q_{[\mathbf{T}]}(z) = q(\mathbf{T}^{-1}(z))\cdot \det{\left|\nabla_z\mathbf{T}^{-1}(z)\right|}
$$

Combining this result with the previous discussion, we can conclude that $\phi^\star_{q,p}$ is the optimal direction of perturbation in the unit norm RKHS. This is the direction of the steepest descent that minimizes the KL divergence of the transformed distribution $q_{[\mathbf{T}]}$ in the zero centered ball of $\mathcal{H}^d$ and the magnitude of change is $\nabla_\epsilon KL(q_{[\mathbf{T}]} || p) \bigg|_{\epsilon = 0} = - \mathbb{S}(q, p)$

In practice, making this identity perturbation transform with every timestep $\epsilon$ brings the KL divergence down by a factor of $\epsilon \mathbb{S}(q,p)$. If we keep running this long enough, we should eventually converge to the true distribution $p$. Therefore, the ODE we are trying to simulate to convergence is

$$
\dot{x} = \phi^\star_{q,p}(x)
$$

$\phi^\star_{q,p}$ is an expectation and can be empirically estimated using a mean of $n$ _particles_. Before we go and see how this works in practice, it is important to see what the term $\phi^\star_{q,p}$ is really achieving

$$
\hat{\phi}^\star_{q,p}(x) = \frac{1}{n} \sum_{j = 1}^n \left[ k(x_j, x) \nabla_{x_j} \log{p(x_j)} + \nabla_{x_j} k(x_j, x)  \right]
$$

If we consider just one particle $n = 1$ and all kernels where $\nabla_xk(x,x) =0$ (which is true for the _rbf_ kernel), then what we achieve is plain old gradient descent and the particle would simply reach the mode of $p$. In the presence of more particles, the kernel acts like a repulsive force which encourage diversity of particles. This is actually a pretty neat result where we have established sort of a communication protocol between the particles via the gradient of the kernel function.

## Experiments

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/activatedgeek/stein-gradient/blob/master/Stein.ipynb)

The experiments can be run via the Jupyter notebook. Click the badge above. Here are some results to show you the power of Stein Gradient.

![Stein particles on Gaussian Distribution](//i.imgur.com/eXeOKWn.png "Stein particles on Gaussian Distribution")

![Stein particles on Mixture of Two Gaussians](//i.imgur.com/NeTz52s.png "Stein particles on Mixture of Two Gaussians")

![Stein particles on Mixture of Six Gaussians](//i.imgur.com/z2oKUan.png "Stein particles on Mixture of Six Gaussians")

![MAP behavior with one particle on a Mixture of Six Gaussians (the particle may fall into any of the modes depending on initial position)](//i.imgur.com/ddTxK5p.png "MAP behavior with one particle on a Mixture of Six Gaussians (the particle may fall into any of the modes depending on initial position)")

All these results use the _rbf_ kernel with the median bandwidth heuristic for a total of 1000 gradient steps using Adam (the original work [^@liu2016stein] uses _Adagrad_ but it should be noted we can use any adaptive gradient descent scheme). See the notebook for more details.

## Conclusion

It is time to go back to the fundamental equation in Bayesian learning - the Bayes theorem

$$
\overbrace{p(\Theta|\mathbf{X})}^{\text{posterior}} = \frac{\overbrace{p(\mathbf{X}|\Theta)}^{\text{likelihood}}\overbrace{p(\Theta)}^{\text{prior}}}{\underbrace{P(\mathbf{X})}_{\text{evidence}}}
$$

All the methods mentioned in the introduction make some or the other assumption about the parametric nature to get a tractable posterior. Using the Stein gradient, we are in a position to be non-parametric about the posterior. Additionally, we can work with an unnormalized density because the score function does not depend on the normalized constant during the simulation of the ODE described above - $\nabla_x \log{p(x)} = \nabla_x \log{\tilde{p}(x)} - \nabla_x \log{Z} = \log{\tilde{p}(x)}$. An example of this was seen in the experiments when we used the Mixture of Gaussians which were unnormalized. It should however be noted that we may need to introduce a stochastic gradient if the likelihood term is costly to evaluate just like in the Stochastic Hamiltonian Monte Carlo gradient. Overall, this is great news and an exciting approach to dig into!

[^@brooks2011handbook]: Brooks, S., Gelman, A., Jones, G., & Meng, X. (2011). Handbook of Markov Chain Monte Carlo.

[^@betancourt2017geometric]: Betancourt, M., Byrne, S., Livingstone, S., & Girolami, M. (2014). The Geometric Foundations of Hamiltonian Monte Carlo. arXiv: Methodology.

[^@gelman2013bayesian]: Gelman, A., Carlin, J., Stern, H., Dunson, D., Vehtari, A., & Rubin, D. (1995). Bayesian Data Analysis.

[^@neal2012mcmc]: Neal, R. (2011). MCMC Using Hamiltonian Dynamics. arXiv: Computation, 139-188.

[^@ranganath2014black]: Ranganath, R., Gerrish, S., & Blei, D. (2014). Black Box Variational Inference. AISTATS.

[^@rezende2015variational]: Rezende, D.J., & Mohamed, S. (2015). Variational Inference with Normalizing Flows. ICML.

[^@jordan1999introduction]: Jordan, M.I., Ghahramani, Z., Jaakkola, T., & Saul, L. (2004). An Introduction to Variational Methods for Graphical Models. Machine Learning, 37, 183-233.

[^@scholkopf2001learning]: Schölkopf, B., & Smola, A. (2001). Learning with Kernels: Support Vector Machines, Regularization, Optimization, and Beyond. Journal of the American Statistical Association, 98, 489-489.

[^@gorham2015measuring]: Gorham, J., & Mackey, L. (2015). Measuring Sample Quality with Stein's Method. ArXiv, abs/1506.03039.

[^@liu2016kernelized]: Liu, Q., Lee, J., & Jordan, M.I. (2016). A Kernelized Stein Discrepancy for Goodness-of-fit Tests. ICML.

[^@liu2016stein]: Liu, Q., & Wang, D. (2016). Stein Variational Gradient Descent: A General Purpose Bayesian Inference Algorithm. NIPS.
