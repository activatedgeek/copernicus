---
title: Deriving the Cross Entropy Method
description: A look at the popular Cross Entropy Method as an evidence lower bound.
date: Feb 2 2020, 3:48 -0700
area: math
redirectsFrom:
  - /blog/ml/deriving-cem
---

The Cross Entropy method (CEM) is one of the most popular optimization algorithms,
particularly in optimal control. It was originally proposed for rare event simulation but has since
been repurposed for a broad spectrum of problems [^@de2005tutorial].

This post is a short summary of the modeling and inference choices underlying CEM in the context of finite horizon control. It is inspired by the recent surge in interest of the "Reinforcement Learning as Inference" perspective. A recent survey [^@levine2018reinforcement] might be of interest to readers with some older perspectives attributed to optimal control [^@toussaint2009robot] [^@toussaint2006probabilistic].

A general problem setup goes like this - consider the finite horizon planning problem. Given the ground truth environment dynamics, the planner must optimize the finite horizon trajectory rewards. This is done by proposing multiple action plans, simulating them forward through the environment dynamics and updating the proposal distributions after observing the rewards.

## Model

The first step is to exactly specify our control problem as an inference problem in a probabilistic graphical model. The model is presented in the figure below [^@piche2018probabilistic].

![Control-as-Inference Model](//i.imgur.com/nuZUnSi.png "Control-as-Inference Model")

As with a typical Markov Decision Process, we require state space $\mathcal{S}$, action space $\mathcal{A}$, forward dynamics $f(s^\prime|s,a)$, initial state distribution $p(s_0)$ and the reward function $\mathcal{R}$. A planner's objective is to find the best action plan to maximize the reward over the horizon. Note that we skip the discount factor as we exclusively consider finite horizons.

$$
\mathcal{J}(\tau_{1:H}) = \mathbb{E}\left[ r(\tau_{1:H}) \right]
$$

We denote a trajectory of horizon length $H$ as $\tau = \{ s_0,a_0,r_1,s_1,a_1,... r_{H-1},s_{H}\}$, a sequence of state action pairs. In a usual inference problem defined via a data generating process, we condition on observations. However, to model control as inference, we instead condition on what we _want_ - optimality of our state-action pairs. This auxiliary optimality variable is the observed variable and defined as $p(\mathcal{O}_h|s_h,a_h) = \exp{ \{ r(s_h,a_h) \} }$. The normalization constant in this discussion is not important. However, one approach to do that may be normalizing it by the maximum reward possible. Intuitively, this can be seen as the likelihood of a state action pair being optimal and a natural choice is given by the rewards this pair induces. The full joint of the system (as seen in the figure above) is now given by

$$
p(\tau_{1:H}, \mathcal{O}_{1:H}) = p(s_0)\prod_{h=0}^{H-1} f(s_{h+1} | s_h, a_h) p(a_h) p(\mathcal{O}_h | s_h, a_h)
$$

$p(a_h)$, the prior over actions, is assumed to be a constant. As a natural consequence of these choices, we can now embed the task of planning as inferring the posterior distribution $p(\tau_{1:H} | \mathcal{O}_{1:H})$. Unfortunately, as in most problems of practical interest, this posterior is intractable in closed-form. The next section describes our inference methodology.

## Inference

We turn to variational inference (VI) [^@jordan1999introduction] in light of the intractability of
the posterior. We now posit a variational distribution over the trajectory by letting the dynamics
function remain the same as the ground truth but make a change to the _joint_ distribution of actions over the horizon

$$
q(\tau_{1:H}) = q(a_{0:H-1}) \prod_{h=0}^{H-1} f(s_{h+1} | s_h, a_h)
$$

We can now derive the lower bound, as typical in variational inference. This is given by the expectation under the variational posterior of the log-ratio of the prior model to approximate posterior. As we see below, our modeling choices lead to some convenient cancellations.

$$
\begin{aligned}
\mathcal{L}(q) &= \mathbb{E}_{q(\tau_{1:H})} \left[ \log{\frac{p(\tau_{1:H}, \mathcal{O}_{1:H})}{q(\tau_{1:H})}} \right] \\
&= \mathbb{E}_{q(\tau_{1:H})} \left[ \log{\frac{p(s_0)\prod_{h=0}^{H-1} \cancel{f(s_{h+1}|s_h,a_h)} p(a_h)p(\mathcal{O}_h|s_h,a_h)}{q(a_{0:H-1}) \prod_{h=0}^{H-1} \cancel{f(s_{h+1} | s_h, a_h)}}} \right] \\
&= \mathbb{E}_{q(\tau_{1:H})} \left[ \sum_{h=0}^{H-1} r(s_h, a_h) \right] + \mathbb{H}\left[a_{1:H} \right]
\end{aligned}
$$

Note that $p(s_0)$, $p(a_h)$ and the normalization constant for $p(\mathcal{O}_h|s_h,a_h)$ can be factored out as they don't depend on the variational distribution. Lo and behold, maximizing the lower bound in this case amounts to maximizing the expected horizon reward over the finite horizon plus some entropy bonus $\mathbb{H}\left[a_{1:H} \right]$ over the joint action distribution.

### From VI to CEM

To finally arrive at CEM, we make the following distributional assumptions to further simplify the lower bound derived above. We assume that the variational posterior is a delta distribution around the mode, in effect saying that we only care about the best action sequence giving us the maximum reward. This collapses the entropy term, $\mathbb{H}\left[a_{1:H} \right] = 0$. We are left with just the finite horizon reward maximization - a maximum likelihood estimate under the observed data.

$$
\mathcal{L}(q) = \mathbb{E}_{q(\tau_{1:H})} \left[ \sum_{h=0}^{H-1} r(s_h, a_h) \right] = \mathcal{J}(\tau_{1:H})
$$

Further, we also decompose the variational distribution to a Gaussian factored over the horizon. This allows a maximum likelihood estimate to be drawn directly from the samples of individual time step - sample mean and sample variance. The variational distribution acts as our "proposal" and we update the proposal (potentially using multiple rollouts) using the maximum likelihood estimates as described above. Further, the assumption in the variational distribution to assume the true dynamics function allows us to simply re-use the ground truth dynamics using samples from the proposal and simulate trajectories to compute a Monte Carlo estimate of the rewards.

This finishes the foundations of deriving CEM from a probabilistic modeling perspective. However, there is a key detail where this deviates from practice. A typical setup of CEM uses the notion of "elite" samples to update the proposal [^@de2005tutorial]. In this context of control, this means only using the trajectories above a reward threshold to update the proposal distributions. This only impacts the speed with which the proposal distributions collapse to the mode and all our modeling choices remain the same. This choice can be theoretically justified by augmenting our model with an indicator function to allow trajectories with some reward greater than threshold $\alpha$ as $\mathbb{I}\left[ r(\tau_{1:H}) > \alpha \right]$.

[^@jordan1999introduction]: Jordan, M.I., Ghahramani, Z., Jaakkola, T., & Saul, L. (2004). An Introduction to Variational Methods for Graphical Models. Machine Learning, 37, 183-233.

[^@piche2018probabilistic]: Piché, A., Thomas, V., Ibrahim, C., Bengio, Y., & Pal, C. (2019). Probabilistic Planning with Sequential Monte Carlo methods. ICLR.

[^@toussaint2009robot]: Toussaint, M. (2009). Robot trajectory optimization using approximate inference. ICML '09.

[^@toussaint2006probabilistic]: Toussaint, M., & Storkey, A. (2006). Probabilistic inference for solving discrete and continuous state Markov Decision Processes. ICML '06.

[^@levine2018reinforcement]: Levine, S. (2018). Reinforcement Learning and Control as Probabilistic Inference: Tutorial and Review. ArXiv, abs/1805.00909.

[^@de2005tutorial]: Boer, P.D., Kroese, D.P., Mannor, S., & Rubinstein, R. (2005). A Tutorial on the Cross-Entropy Method. Annals of Operations Research, 134, 19-67.
