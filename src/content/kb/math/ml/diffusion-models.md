---
title: Diffusion Models
description: Living document on diffusion models from scratch.
date: May 26 2023, 16:41 -0400
updated: Aug 1 2023, 19:48 -0400
area: math
---

The basic idea is to pick a forward noise process $(q_t)_{t\geq 0}$ that converges to some easy to sample distribution $q_\mathrm{ref}$, which is taken to be $p_0$. By sampling $p_0$, we now reverse the process to produce a sample from the original data distribution.[^@Benton2022FromDD]

## Variational Perspective

We consider the known noising process starting from a data sample $x_0$ as $q(x_{t} \mid x_{t-1})$, and learn a reverse process as $p(x_{t-1} \mid x_t)$ for $t \in [1,T]$. We can now build a variational lower bound (also motivated from a multivariate information bottleneck[^@Friedman2001MultivariateIB] perspective [here](https://blog.alexalemi.com/diffusion.html)) to the marginal distribution over data $p(x_0)$ as,[^@Luo2022UnderstandingDM]

$$
	\log{p(x_0)} \geq \mathbb{E}_{q(x_{1:T} \mid x_0)}\left[ \frac{\log{p(x_{0:T})}}{\log{q(x_{1:T}\mid x_0)}} \right] = \ell(x_{0:T})
$$

Using an auto-regressive decomposition of the $p$ and $q$ distributions, the lower bound can be further decomposed as:

$$
\ell(x_{0:T}) = \mathbb{E}_{q(x_1 \mid x_0)}\left[ \log{p}(x_0 \mid x_1) \right] - \mathbb{E}_{q(x_{T-1}\mid x_0)}[\mathcal{KL}(q(x_T \mid x_{T-1}) ~\lvert\rvert~ p(x_T))] - \sum_{t=1}^T \mathbb{E}_{q(x_{t-1},x_{t+1}\mid x_0)} \left[ \mathcal{KL}(q(x_t \mid x_{t-1}) ~\lvert\rvert~ p(x_t \mid x_{t+1})) \right]
$$

We have a usual **reconstruction term** (one-step latent as in usual amortized VAE), a **prior matching term** (independent of anything learnable so can be ignored), and a **consistency term** (between the forward process $q$ and the backward process $p$).

The consistency term above computes expectation over two variables and can be higher variance in practice. The key insight here is to change the conditioning in the forward process as:

$$
q(x_t \mid x_{t-1}) = q(x_t \mid x_{t-1}, x_0) = \frac{q(x_{t-1}\mid x_t,x_0)q(x_t\mid x_0)}{q(x_{t-1}\mid x_0)}
$$

The equivalent objective now is:

$$
\ell(x_{0:T}) = \mathbb{E}_{q(x_1 \mid x_0)}\left[ \log{p}(x_0 \mid x_1) \right] - \mathcal{KL}(q(x_T\mid x_0) ~\Vert~ p(x_T)) - \sum_{t=2}^T \mathbb{E}_{q(x_t\mid x_0)\left[ \mathcal{KL}(q(x_{t-1}\mid x_t, x_0) ~\Vert~ p(x_{t-1} \mid x_t)) \right]}
$$

The reconstruction term is the same, and the prior matching term independent of anything trainable (but also zero under our assumptions). The consistency term is now replaced with a **denoising matching term**, which only depends on expectation over a single variable.

Now for the $\mathcal{KL}$ terms in the denoising matching part of the objective, because we know that the distributions implied by the noising process $q$ are Gaussian, using the Bayes' rule and reparametrization trick,

$$
q(x_{t-1}\mid x_t, x_0) = \frac{q(x_t \mid x_{t-1},x_0)q(x_{t-1}\mid x_0)}{q(x_t \mid x_0)}
$$

$q(x_t \mid x_{t-1}) = \mathcal{N}(\sqrt{\alpha_t} x_{t-1}, (1-\alpha_t)\mathbf{I})$ by assumption of noise schedule $\alpha_{t}$, which could either be fixed[^@DDPM2020] or learned,[^@VDM2021] chosen as a variance preserving scehdule. Under such a noise schedule, we also get
$q(x_t \mid x_0) = \mathcal{N}(\sqrt{\bar{\alpha}_t}x_0, (1-\bar{\alpha}_t) \mathbf{I})$, where $\bar{\alpha}_t = \prod_{i=1}^t \alpha_t$.

Using such a schedule, we can get a closed-form for mean $\mu_q(x_t, x_0)$ and variance $\sigma_q^2(t) \mathbf{I}$ of $q(x_{t-1} \mid x_t, x_0)$ (see Eq. (84)[^@Luo2022UnderstandingDM]). For the denoising model $p(x_{t-1} \mid x_t)$, we can immediately construct the variance to be the same but the mean is parametrized as $\mu_p(x_t,t)$. The $\mathcal{KL}$ between two Gaussians is then simply a difference between the means.

By mirroring the specific form of the $\mu_q$ to $\mu_p$, we can simplify to operands in the optimization problem to be simply denoising the input[^@VDM2021] at different noise levels as:

$$
\frac{1}{2\sigma_q^2(t)}\frac{\bar{\alpha}_{t-1}(1-\alpha_t)^2}{(1-\bar{\alpha}_t)^2} \left[ \lVert \hat{x}_{\theta}(x_t, t) - x_0 \rVert_2^2 \right]
$$

Using the definition of signal-to-noise (SNR) ratio as the ratio of mean squared to variance, we can simplify the above objective to

$$
\frac{1}{2}(\mathrm{SNR}(t-1) - \mathrm{SNR}(t)) \left[ \lVert \hat{x}_{\theta}(x_t, t) - x_0 \rVert_2^2 \right]
$$

In practice, noting that we can **rewrite** $x_0$ in $\mu_q(x_t,x_0)$ in terms of a noise random variable $\epsilon_0 \sim \mathcal{N}(0, \mathbf{I})$, by the relation $x_0 = \frac{x_t - \sqrt{1-\bar{\alpha}_t}\epsilon_0}{\sqrt{\bar{\alpha}_t}}$ and then mirroring the functional form for $\mu_p(x_t, t)$ as earlier, we can instead match the source noise which works better in practice (see Eq. 115[^@Luo2022UnderstandingDM]):

$$
\frac{1}{2\sigma_q^2(t)}\frac{\bar{\alpha}_{t-1}(1-\alpha_t)^2}{(1-\bar{\alpha}_t)^2} \left[ \lVert \hat{\epsilon}_{\theta}(x_t, t) - \epsilon_0 \rVert_2^2 \right]
$$

## SDE Perspective

Another alternative objective takes a score-matching form due to Tweedie's Formula[^@TWEEDIE2011], which states that the true mean of an exponential family distribution can be estimated by the maximum likelihood estimate plus a correction term involving the score of the estimate. Specifically for our case of $q(x_t \mid x_0) = \mathcal{N}(\sqrt{\bar{\alpha}_t}x_0, (1-\bar{\alpha}_t) \mathbf{I})$ the best estimate of its mean is,

$$
\sqrt{\bar{\alpha}_t}x_0 = x_t + (1 - \bar{\alpha}_t) \nabla_{x_t}\log{p(x_t)}
$$

Using this to **rewrite** $x_0$ in $\mu_q(x_t,x_0)$ and then mirroring the functional form for $\mu_p(x_t,t)$ as earlier, we get a new score matching objective:

$$
\frac{1}{2\sigma_q^2(t)}\frac{(1-\alpha_t)^2}{\alpha_t^2} \left[ \lVert \hat{s}_{\theta}(x_t, t) - \nabla_{x_t}\log{p(x_t)}  \rVert_2^2 \right]
$$

The score-matching objective and the noise-prediction objective differ only by a constant factor that varies over time.

The forward process is describe by an SDE as:

$$
dY_t = b(Y_t, t)dt + dB_t
$$

The reverse process is:

$$
dX_t = (-b(X_t, T-t) + \nabla_x \log{q_{T-t}(X_t)})
$$

The denoising objective is:

$$
I(\theta) = \frac{1}{2} \int_0^T \mathbb{E}_{q_{0,T}(x_0,x_T)}\left[ \lVert \nabla_{x}\log q(x_t\mid x_0) - s_\theta(x_t, t) \rVert^2 \right] dt
$$

## Talks

[Denoising as a Building Block for Imaging, Inverse Problems, and Machine Learning](https://www.youtube.com/watch?v=Mj_tjSOaifI&t=4s) by Peyman Milanfar

## TO-READ

Stable Diffusion.[^@STABLE2022]

[Denoising Diffusion Models](https://mathematical-tours.github.io/book-sources/optim-ml/OptimML-DiffusionModels.pdf) by Gabriel Peyré (2023)

[^@Benton2022FromDD]: Benton, Joe, Yuyang Shi, Valentin De Bortoli, George Deligiannidis and A. Doucet. “From Denoising Diffusions to Denoising Markov Models.” ArXiv abs/2211.03595 (2022) https://arxiv.org/abs/2211.03595

[^@Luo2022UnderstandingDM]: Luo, Calvin. “Understanding Diffusion Models: A Unified Perspective.” *ArXiv* abs/2208.11970 (2022) https://arxiv.org/abs/2208.11970

[^@Friedman2001MultivariateIB]: Friedman, Nir, Ori Mosenzon, Noam Slonim and Naftali Tishby. “Multivariate Information Bottleneck.” Neural Computation 18 (2001): 1739-1789. https://arxiv.org/abs/1301.2270

[^@DDPM2020]: Ho, Jonathan, Ajay Jain and P. Abbeel. “Denoising Diffusion Probabilistic Models.” _ArXiv_abs/2006.11239 (2020) https://arxiv.org/abs/2006.11239

[^@VDM2021]: Kingma, Diederik P., Tim Salimans, Ben Poole and Jonathan Ho. “Variational Diffusion Models.” *ArXiv* abs/2107.00630 (2021) https://arxiv.org/abs/2107.00630

[^@TWEEDIE2011]: Efron, Bradley. “Tweedie’s Formula and Selection Bias.” *Journal of the American Statistical Association* 106 (2011): 1602 - 1614. https://www.tandfonline.com/doi/abs/10.1198/jasa.2011.tm11181

[^@STABLE2022]: Rombach, Robin et al. “High-Resolution Image Synthesis with Latent Diffusion Models.” *2022 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)* (2021): 10674-10685. https://arxiv.org/abs/2112.10752
