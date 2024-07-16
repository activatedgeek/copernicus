---
title: Topics in Bayesian Machine Learning
description: A resourceful document for entrypoints into Bayesian inference.
date: Sep 17 2020, 09:40 +0530
updated: Aug 17 2023, 15:38 -0400
area: math
---

I want this to be a helpful resource for newcomers to the field of _Bayesian_
machine learning. The objective here is to collect relevant literature
that brings insights into modern inference methods. Of course, this requires me
to extract insights myself to be sure that the papers I put on are
meaningful. Therefore, this post remains a living document.

I will post commentary, when I can, in terms of what to expect when reading the
material. Often, however, I will only put materials in list to be considered
as the recommended reading order. A recommendation for the overall sequence
in which topics should be considered is harder to be prescribed. ~~I do,
however, suggest that this not be your first excursion into machine learning.~~
I now encourage that this perspective be your first foray into machine learning.

## The Big Picture

When diving deep into a topic, we often find ourselves too close to the action.
It is important to start with and keep the bigger picture in mind. I recommend
the following to get a feel for the fundamental thesis around being _Bayesian_.
It is not a silver bullet, but a set of common-sense principles to abide by.

- In my introductory article, [_The Beauty of Bayesian Learning_](/kb/the-beauty-of-bayesian-learning), I describe the essence of Bayesian learning using a simple pattern guessing demo.
  - [Second opinion needed: communicating uncertainty in medical machine learning](https://www.nature.com/articles/s41746-020-00367-3) provides a broad survey grounded in real-world applications of the need to quantify uncertainty.
- PRML Chapter 1 [^@bishop2006pattern] is the place to start for a succinct
  treatment on the topic.
- The ideas can be further reinforced through DJCM's [PhD Thesis](https://www.inference.org.uk/mackay/PhD.html), Chapter 2.
- AGW's [PhD Thesis](https://www.cs.cmu.edu/%7Eandrewgw/andrewgwthesis.pdf) Chapter 1 provides a broader background on the big picture.

Less so now, but often arguments around the subjectivity of the prior is brought
into question. This is unfortunately a misdirected argument because without
subjectivity, "learning" cannot happen and is in general an ill-defined problem
to tackle. Although, subjective priors is not the only thing that being Bayesian
brings to the table.

Many people, including seasonsed researchers, have the wrong idea of what it
means to be Bayesian. Putting prior assumptions _does not_ make one a Bayesian.
In that sense, everyone is a Bayesian because they build algorithms starting
with priors, whether they know it or not. I die a little when people compare
Bayesian methods to simply regularlizing with the prior. That is an effect often
misconstrued. For instance, take a look at this fun post by Dan Simpson,
"[The king must die](https://statmodeling.stat.columbia.edu/2017/11/02/king-must-die/)"
on why simply assuming a Laplace prior does not imply sparse solutions unlike
its popular _maximum a-posteriori_ variant known as the Lasso.

When explaining the data using a model, we usually have many competing
hypothesis available, naturally leading to the _model selection_ problem.
_Occam's razor_ principle advocates that we must choose the simplest possible
explanation. Bayesian inference shines here as well by automatically embodying
this "principle of parsimony".

- ITILA Chapter 28 [^@mackay2004information] describes how Bayesian inference handles "automatic Occam's razor" quantitatively.
- Seeing the ever increasing complexity of neural network models, one may doubt the
  validity of Occam's razor, perhaps sensing a contradiction. Rasmussen & Ghahramani, in their paper titled [_Occam's razor_](https://papers.nips.cc/paper/2000/file/0950ca92a4dcf426067cfd2246bb5ff3-Paper.pdf), resolve this through a simple experiment. Maddox & Benton et. al. provide an excellent realization of this principle for large models in [_Rethinking Parameter Counting in Deep Models: Effective Dimensionality Revisited_](https://arxiv.org/abs/2003.02139).

_Bayesian model averaging_ (BMA) is another perk enjoyed by Bayesians, which
allows for _soft model selection_. See [Bayesian Model Averaging: A Tutorial](https://www.jstor.org/stable/2676803)
for a classic reference. Andrew G. Wilson clarifies the value it adds in a technical report titled [_The Case for Bayesian Deep Learning_](https://cims.nyu.edu/~andrewgw/caseforbdl/). Unfortunately, BMA is often misconstrued as
model combination. Minka dispells any misunderstandings
in this regard, in his technical note [_Bayesian model averaging is not model combination_](https://tminka.github.io/papers/minka-bma-isnt-mc.pdf).

The _Frequentist-vs-Bayesian_ debate has unfortunately occupied more minds than
it should have. Any new entrant to the field will undoubtably still come across
this debate and be forced to take a stand (make sure you don't fall for the trap).
Christian Robert's answer [on Cross Validated](https://stats.stackexchange.com/a/256224/57053) is the best technical introduction to start with. Then, I highly recommend this
talk by a dominant figure in the field, _Michael Jordan_, titled _Bayesian or Frequentist, Which Are You?_ ([Part I](https://www.youtube.com/watch?v=HUAE26lNDuE), [Part II](https://www.youtube.com/watch?v=7sNgO7wQgaQ)). Having read and listened to all this,
one should keep this excellent exposition by Robert E. Kass [Statistical Inference: The Big Picture](https://projecteuclid.org/euclid.ss/1307626554) on their reading list always. Everytime someone starts this debate again, ask them to read this first.

Gelman and Yao describe [_Holes in Bayesian Statistics_](https://www.stat.columbia.edu/~gelman/research/unpublished/bayes_holes_2.pdf) which may be a worthwhile reader at a later stage.

Many times, the literature erroneously claims that Bayes does not overfit. This is entirely false. It is prudent to keep in mind that Bayesian statistics is prone to overfitting just like any other statistical model, except the degree of overfitting varies. See Yao's [post](https://www.yulingyao.com/blog/2023/overfit/) for a simple argument where overfitting is defined to be positive generalization gap (difference between test error and train error).[^@clark2023]

[^@clark2023]: Clarke, Bertrand S. and Yuling Yao. “A Cheat Sheet for Bayesian Prediction.” (2023). https://arxiv.org/abs/2304.12218

On a concluding note, I would refrain from labelling anyone or any algorithm
as an exclusive Bayesian. In one is still hell-bent on being labeled, remember
keeping an open mind is the hallmark of a true Bayesian.

### Utility References

References so that one doesn't have to always remember those tricky identities
but come up commonly.

- Sam Roweis provides [Gaussian Identities](https://cs.nyu.edu/~roweis/notes/gaussid.pdf), a handy reference. See also PRML Chapter 2.3 [^@bishop2006pattern].
- [The Matrix Cookbook](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf) by Kaare Brandt Petersen, Michael Syskind Pedersen
- [The distribution zoo](https://ben18785.shinyapps.io/distribution-zoo/) by Ben Lambert and Fergus Cooper, a neat collection of many distributions, especially the "Practical tips" section.

## Topics

### Gaussian Processes

Gaussian Process (GP) research interestingly started as a consequence of the
popularity and early success of neural networks.

- DJCM's Introduction, Sections 1-6[^@mackay1998introduction] to understand where GPs comes from. A single reading before the next should help calibrate the mindset. I also recommend returning to this once more after the next reading.
- GPML Chapter 1, 2, 3[^@williams2009gaussian] for a detailed treatment on the usual regression and classification problems.
- LWK Chapter 1[^@scholkopf2001learning] is worth a read for a big picture view of kernel machines. It does not, however, present a Bayesian perspective, but an optimization perspective. Nevertheless, it is a useful perspective.
- GPML Chapter 5[^@williams2009gaussian] to understand how model selection
  behaves with GPs, and key caveats to look out for, especially regarding Bayesian Model Averaging. It also has a nice example of a non-trivial composite kernel.

#### Sparse Gaussian Processes

The non-parametric nature is slightly at odds with scalability of Gaussian
Processes, but we've made some considerable progress through first principles
in this regard as well.

#### Covariance Functions

Covariance functions are the way we describe our inductive biases in a Gaussian
Process model and hence deserve a separate section altogether.

- GPML Chapter 4 [^@williams2009gaussian] provides a broad discussion around where covariance functions
  come from.
- DD's [PhD Thesis](https://www.cs.toronto.edu/~duvenaud/thesis.pdf), Chapter 2 contains some basic advice and intuitions. This is more succinctly available as [The Kernel Cookbok](https://www.cs.toronto.edu/~duvenaud/cookbook/).
  - A quick skim of Section 2 of [Structure Discovery in Nonparametric Regression through Compositional Kernel Search](https://arxiv.org/abs/1302.4922) may be helpful.

### Monte Carlo algorithms

Monte Carlo algorithms are used for exact inference in scenarios when
closed-form inference is not possible.

- PRML Chapter 11.1 [^@bishop2006pattern]

#### Markov Chain Monte Carlo

The simple Monte Carlo algorithms rely on _independent_ samples from a target distribution to be useful. Relaxing the independence assumption leads to
correlated samples via Markov Chain Monte Carlo (MCMC) family of algorithms.

- IM's [PhD Thesis](https://homepages.inf.ed.ac.uk/imurray2/pub/07thesis/murray_thesis_2007.pdf), Chapter 1,2 is arguably the best introduction to the topic of MCMC.
- Betancourt's [_A Conceptual Introduction to Hamiltonian Monte Carlo_](https://arxiv.org/abs/1701.02434) is the best introduction to HMC.
- PRML Chapter 11.2 [^@bishop2006pattern]

The following readings are only worth after one has played more closely with
MCMC algorithms.

- Charles Geyer's [Burn-In is Unnecessary](http://users.stat.umn.edu/~geyer/mcmc/burn.html)

### Variational Inference

#### Pathologies

PRML Chapter 10 [^@bishop2006pattern] shows the zero-forcing behavior of the KL term involved
in variational inference, as a result underestimating the uncertainty when
unimodal approximations are used for multimodal true distributions. This,
however, should not be considered a law of the universe, but only a thumb
rule as clarified by Turner et. al. [_Counterexamples to variational free energy compactness folk theorems_](https://www.gatsby.ucl.ac.uk/~turner/Notes/Compactness/CompactnessFolkTheorem.pdf).
Rainforth et. al show that [tighter variational bounds are not necessarily better](https://proceedings.mlr.press/v80/rainforth18b.html).

### Modeling with Bayes

This is a topic that is often considered an implicit skill but one of the benefits of Bayesian inference is its explicit approach to defining what variables we care about and how those variables connect.

[Model-Based Machine Learning](https://www.mbmlbook.com/index.html) provides a very nice introductory resource through real-world examples. I recommend reading this book after a first pass through all the other basics.

## Research Venues

Cutting-edge research is a good way to sense where the field is headed. Here are
a few venues that I occassionally sift through.

- [Bayesian Analysis](https://projecteuclid.org/info/euclid.ba) - An electronic journal by the [ISBA](https://bayesian.org).
- [Bayesian Deep Learning](https://bayesiandeeplearning.org) - A NeurIPS workshop.
- [Symposium on Advances in Approximate Bayesian Inference](http://approximateinference.org) - Independent Symposium
- [Uncertainty Reasoning and Quantification in Decision Making](https://charliezhaoyinpeng.github.io/UDM-KDD23/) - KDD Workshop

## Books

[Think Bayes](https://allendowney.github.io/ThinkBayes2/index.html) by
Allen B. Downey is an excellent book for beginners.

## Acknowledgements

I'm inspired by
[Yingzhen Li](http://yingzhenli.net/home/en/)'s resourceful
document on [_Topics in Approximate Inference_](http://yingzhenli.net/home/pdf/topics_approx_infer.pdf) (2017).
Many of the interesting references also come from discussions with my advisor,
[Andrew Gordon Wilson](https://cims.nyu.edu/~andrewgw/).

[^@mackay1998introduction]: MacKay, D. (1998). Introduction to Gaussian processes.

[^@williams2009gaussian]: Rasmussen, Carl Edward and Christopher K. I. Williams. “Gaussian Processes for Machine Learning.” *Adaptive computation and machine learning* (2003). https://gaussianprocess.org/gpml/

[^@mackay2004information]: MacKay, D. (2004). Information Theory, Inference, and Learning Algorithms. IEEE Transactions on Information Theory, 50, 2544-2545. https://www.inference.org.uk/mackay/itila/

[^@bishop2006pattern]: Bishop, Christopher M.. “Pattern Recognition and Machine Learning (Information Science and Statistics).” (2006). https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf

[^@scholkopf2001learning]: Schölkopf, B., & Smola, A. (2001). Learning with Kernels: Support Vector Machines, Regularization, Optimization, and Beyond. Journal of the American Statistical Association, 98, 489-489. https://direct.mit.edu/books/book/1821/Learning-with-KernelsSupport-Vector-Machines
