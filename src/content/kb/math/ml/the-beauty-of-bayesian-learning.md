---
title: The beauty of Bayesian Learning
description: Understanding and visualizing Bayesian concepts
date: Dec 4 2017, 2:25 -0500
area: math
redirectsFrom:
  - /blog/ml/the-beauty-of-bayesian-learning
  - /machine-learning/the-beauty-of-bayesian-learning
---

In this post, we will build intuitions behind Bayes theory via
an interactive visualization and then realize certain properties
of such a probabilistic formulation of Machine Learning. It turns
of that most advanced approaches in fact run on top of these very
simple foundational concepts and help us model problems quite beautifully.

Probability theory is ubiquitous in Machine Learning and perhaps will be
the most important tools for future breakthroughs. By the end of this post,
the hope is that you will have gained just enough insight into the Bayesian
world-view.

> This post has an accompanying Bayesian Learning Demo. See [here](https://bayesian-learning-demo.sanyamkapoor.com)!

## Learning Theory

In itself, the idea of "learning" is not well defined. But like any
physical system, we have a mathematical model around how "learning"
should be quantified. As you might already imagine, there cannot possibly
exist a deterministic view of "learning" given the subjective nature of
matter. In light of this uncertainty, it is quite obvious that we turn
to probability theory to seek answers to our questions.

In learning theory, a "concept" is something that we wish to learn
given some data. "Concept" is not concretely realizable
and instead we wish to learn something from a big collection of concepts
called a "concept" class. For instance, imagine I provide you a list
of numbers and ask you what "concept" do these numbers represent. You'd
make educated guesses from a certain list of concepts you had in mind,
for instance even/odd numbers, multiples of 3 or more complicated ones
like odd powers of 2. The possibilities are endless which actually makes
the realization of every concept pretty much impossible. Instead,
we work around this complication and arrive at a mutually agreed upon
set of "concepts" to form the "Hypothesis" set. While the size of
this set may be infinite as well, ideally its nature tends to
be more approachable and computationally tractable.

For the more mathematically inclined, it is fruitful to view hypotheses as
just any other function which when fed with data provides meaningful inference.
For instance, to distinguish cats and dogs, let us say you chose to build an
SVM classifier. In essence, you have implicitly arrived at a choice of
your hypothesis set - The set of all hyperplanes that separate the data
under (relaxed) margin constraints.

Our hope is that this hypothesis set is a "close" enough
representation of the true concept class so as to minimize the
"generalization error" on unseen data. The true nature of "close"
and "generalization error" is out of scope for this post. But to
make things concrete, I would like to present a very simple yet powerful
result in learning theory

$$
\underset{S \sim D^m}{P}[R(h) \leq \epsilon] \geq 1 - \delta
$$

In plain words, the probability that "true risk" $R(h)$ will be
within the limits of a fixed positive constant $\epsilon$ with a
confidence of at least $1-\delta$. Risk in simple words measures how
inaccurate was your learning with respect to new unseen data.

The above equation is dense with knowledge and has various other
forms under relaxed constraints. But, for the sake of brevity
I will defer that discussion, perhaps for another day. The takeaway here is
that we do have a concrete quantification of both the risk and the
uncertainty in that risk.

## Bayesian Learning

In hindsight, _Bayes rule_ (discussed later) fits quite naturally when
modelling human cognition. To motivate the intuition, imagine how a child's
"concept" of classifying objects based on earlier observations gets
strengthened every time the objects are observed.

I will put it out right away that like all
modelled physical systems, theory doesn't always lead to tractable
solutions and only under reasonable assumptions do we
solve the learning problem. Nevertheless, the bayesian approach is
theoretically well-motivated. More importantly, it works!

Let us take a look at the Bayes equation which I'm sure is nothing
new. In machine learning, this factorization is a boon for the theorists
and occasionally a bane for the practitioners.

$$
P(A | B) = \frac{P(B|A)P(A)}{P(B)}
$$

I will defer the explanation and instead invite you to play the number game.

## The Number Game

The game is very simple. I will give you a set of numbers and a universe of
concepts where these numbers could be coming from. Your job is to guess
which concept do these numbers belong to. We also have our
"Bayesian" friend playing this game along with us.

### Experimental Setup

For the sake of this game, I will limit all numbers between 1 and 100 and
the universe of concepts consists of the following

- Numbers are odd or even
- Numbers a perfect squares
- Numbers end in a digit 0 - 9
- Numbers are multiples of digits 3 - 9
- Numbers are perfect powers of digits 2 - 10
- Numbers are powers of 2 except 32
- Numbers are powers of 2 or 37
- Any number

In total, you have just 32 concepts in this universe of numbers. I call this
$\mathcal{H}$.

### Experiment Trials

I give you $\mathcal{D} = [16]$. Well, you'd tell
me that this could be anything, an even number, a perfect square, a number ending
in 6 and so on. And you are right, our _Bayesian_ friend would be just as confused
as you are. This is quantified by the fact that when that friend tells us the
predictions for each class, it turns out the uncertainty is quite high given that
many hypotheses tend to have high probabilities.

In this trial, we will quantify the "likelihood" that a dataset comes from a given
hypothesis as

$$
P(\mathcal{D} | h) = \frac{1}{|h|}
$$

We read this as the "likelihood" of the dataset given hypothesis $h$. This
quantifies the conditional dependency of having generated the dataset given a
hypothesis.

To keep things simple, I've defined is as the probability of picking a number from
the complete set of numbers uniform. For instance,

$$
P(\mathcal{D} | h_{even}) = \frac{1}{50}
$$

is the likelihood of picking up a single number from the set of 50 even numbers between
1 and 100 (our universe of numbers defined earlier). Extending this to a dataset of
$m$ even numbers, since each choice is independent of the other, we simply have

$$
P(\mathcal{D}^m | h_{even}) = \left( \frac{1}{50} \right)^m
$$

Let us compare this to say the likelihood of $\mathcal{D}$ being from a power of
four set,

$$
P(\mathcal{D} | h_{\text{power of 4}}) = \frac{1}{3}
$$

This equation tells us that the likelihood of 16 being from a the set of powers of 4
is considerably larger than it being from a set of even numbers. If we augment the
dataset as $\mathcal{D}^\prime = [4,16]$, it leads to a likelihood choice
between $\frac{1}{50^2}$ and $\frac{1}{3^2}$. Those odds escalated quickly!

This is in fact attributed to a principle known as the **Occam's Razor** which can
be paraphrased as - given everything else same, a simpler (in this case the smaller)
explanation is often the better one.

Coming back to our original data, we were confused among different competing hypothesis.
How do we solve this? Prior knowledge is the key. You prior experience with numbers
would tell you that it is more often that you've seen even numbers than numbers as
specific as powers of 4. However, somebody else might have had an opposite experience
so far and would have different "priors".

To accommodate those experiences, we use a product of the "likelihood" and the "prior"
to form the "posterior".

$$
posterior \propto likelihood \times prior
$$

In this context,

$$
P(h | \mathcal{D}) \propto P(\mathcal{D} | h) \times P(h)
$$

The probability that the concept is $h$ "given" that we have seen data $\mathcal{D}$
is proportional to the likelihood of the data conditional on belonging to that hypothesis
$h$ scaled by a prior factor. The proportionality is removed by a normalization constant
composing of the "evidence".

Let us say the prior for even numbers is $P(h_{even}) = 0.5$ and $P(h_{\text{power of 4}}) = 0.2$,
our posterior probabilities would now be reported as $P(h_{even} | \mathcal{D}) = 0.01$
and $P(h_{\text{power of 4}} | \mathcal{D}) = 0.067$. I guess I'd be better off
choosing the power of 4 set as my concept that the set of even numbers. It should be
easy to see that changing the values of the prior would lead me to different results.

The subjective nature of the distribution of likelihoods and priors is in fact where
we encode our underlying assumptions about the concept. To play with different
data and probability configurations, head over to the [Interactive Bayesian Learning
Demo](https://bayesian-learning-demo.sanyamkapoor.com). Note how adding more data makes
our "Bayesian" friend more confident about the concept just like you would be.

## The Mathematical Model

Having set our intuition right, it is time we delve into certain equations and realize
some properties of the Bayesian approach. We will complete our Bayes rule for this
problem

$$
P(h | \mathcal{D}) = \frac{P(\mathcal{D}|h)P(h)}{\sum_{f \in \mathcal{H}} P(\mathcal{D}|f)P(f)}
$$

where $P(\mathcal{D}|h) = \mathbb{I}(\mathcal{D} \in \mathcal{E}(h)) / |h|^m$. $\mathbb{I}$ is
an indicator function which is $0$ if there exists some number in $\mathcal{D}$
not satisfied by $h$ and $1$ otherwise. The remaining term is the same as the
discussed earlier. This comes from a fairly natural intuition that if a number in the dataset
does not satisfy the hypothesis $h$, then the likelihood of the data coming from that
hypothesis should be zero.

For the priors $P(h)$, I've chosen the standard odd/even numbers to have a high prior,
sets of multiples and ending numbers a moderate prior and the more "unnatural" sets in the
end to have a very low prior. This again is a natural choice under the knowledge of the problem
setup.

Note that the choice of these likelihoods and priors are what will affect the solution which
is why I invite you to try out different custom/preset distributions at the
[demo page](https://bayesian-learning-demo.sanyamkapoor.com).

It turns out that with "sufficient" amount of data (the term has relevant definitions which I
defer to another discussion), the posterior tends to peak at one single hypothesis which is called
the "**_maximum a posteriori_**" or "**MAP estimate**" and tends to push down all other probabilities to zero.
It is compactly written in literature using the _Dirac Measure_ which is a binary valued function
parametrized over a set. In this case it gives 1 when $h = \hat{h}^\text{MAP}$ and 0 otherwise.

$$
P(h|\mathcal{D}) \to \delta_{\hat{h}^\text{MAP}}(h)
$$

The _MAP estimate_ is written in a more familiar form as

$$
\hat{h}^\text{MAP} = \underset{h \in \mathcal{H}}{\text{argmax}} P(\mathcal{D}|h)P(h)
$$

It is more convenient to write this as the "Log-likelihood"

$$
\hat{h}^\text{MAP} = \underset{h \in \mathcal{H}}{\text{argmax}} \left[ \text{log}(P(\mathcal{D}|h)) + \text{log}(P(h)) \right]
$$

Given that the prior stays constant, with enough data, the likelihood term starts dominating. The
MAP estimate then starts converging towards _maximum likelihood estimate_ or "**MLE**".

$$
\hat{h}^\text{MLE} = \underset{h \in \mathcal{H}}{\text{argmax}} \text{log}(P(\mathcal{D}|h))
$$

The takeaway here is that data overwhelms the prior. In retrospect, this is quite intuitive.
To observe, in the experiment trial above, put $\mathcal{D} = [4,8,16,32]$ and see how
suddenly the MAP estimate peaks at just a single hypothesis. Theoretically, we claim that the
"**_truth is recoverable in the limit of infinite data_**". This in fact forms the foundations of most
machine learning solutions.

Now finally, to make our predictions on a new test data point $\hat{x}$, we run it via
the **Posterior Predictive Distribution**. In this problem we get

$$
P(\hat{x}|\mathcal{D}) = \sum_{h \in \mathcal{H}} P(y=1|\hat{x},h) P(h|\mathcal{D})
$$

which is just a simple _Bayes Model Averaging_ to predict whether the new number $\hat{x}$
belongs to the learned concept or not.

## Applications

Whatever we've learned so far stays at the core of any probabilistic model. But there
are a handful of further concerns we still have not addressed. I note down a few
without going into further details yet.

- Modelling our assumptions into the likelihood and prior distributions are crucial. One
  concern arises when distributions are based on "frequency counts". Beta distributions tend
  to take a nice form in such situations to make sure previously unseen classes (priors
  amounting to zero) don't always get nullified.

- In a variety of high dimensional scenarios, problem generally tends to be intractable. This
  is where factorization into conditionally independent factors becomes imperative. (Factor graphs)

- It might happen that _MAP/MLE_ objective cannot be expressed in a closed form. This is where a
  variety of solutions from convex optimization literature are invoked like the stochastic
  gradient descent.

## Conclusion

Most data in practice tends to allude to some inherent structure. Bayesian Modelling is a fairly
powerful approach to model those relationships via a paradigm of approaches known as
Probabilistic Graphical Models. We've barely scratched the surface here but this
opens up avenues to understand a variety of fairly popular methods like Hidden Markov Models (HMMs)
and Conditional Random Fields (CRFs). The references are highly recommended.

As an interesting side note, Bayesians have a strong tendency to reason anything and everything from
the lens of _Bayes_ theorem. It shouldn't be surprising now to model perhaps everything within reasonable
limits of this model and is an interesting line of thought to consider.

### Acknowledgements

This piece has been inspired heavily by the clear explanations by Kevin Murphy [^@murphy2012machine]. Tenenbaum's clear descriptions on Bayesian Learning [^@tenenbaum1999bayesian] were also helpful.

[^@murphy2012machine]: Murphy, K. (2012). Machine learning - a probabilistic perspective. Adaptive computation and machine learning series.

[^@tenenbaum1999bayesian]: Tenenbaum, J. (1999). A Bayesian framework for concept learning.
