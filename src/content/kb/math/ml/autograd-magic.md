---
title: The magic of Automatic Differentiation
description: Learn how to 'mathemagically' compute derivates in Machine Learning
date: Oct 8 2017, 8:46 -0400
area: math
redirectsFrom:
  - /blog/ml/autograd-magic
  - /machine-learning/autograd-magic
---

Any machine learning problem is generally formulated as roughly the
following steps

1. Model the outputs $Y$ as some function of the input and parameters
   $f(X,\theta)$

2. Then come up with a loss function $L$ that quantifies how well
   the trained model fits the data $X$

3. We solve the following minimization problem at the end of all

$$
\underset{\theta}{argmin} L(X,Y,\theta)
$$

Anybody with some elementary calculus experience knows that the solution
to the above problem involves taking gradients $\nabla_\theta L = \frac{\partial L}{\partial \theta}$.
While we have the importance of differentiation established we will first
understand in summary the limitations of a few approaches and then
discuss in detail how automatic differentiation overcomes that even when
calculating the exact form while being computationally efficient. It might
excite you to know that most modern general purpose machine learning
frameworks like Tensorflow and Torch, use AD as a first-class citizen.

## Traditional hand-coded Approach

Let us take an example which can be calculated by hand but non-trivial
enough for the purpose of this post. Off the top of my head

$$
f(x_1,x_2) = x_1\sqrt{log \frac{x_1}{sin(x_2^2)}}
$$

That is an absolutely nutty equation and any resemblance to something
meaningful is purely coincidental. The aim here is to include all the
standard operators and core set of functions that are commonly used. Now
let us say we aim to find how does this function change for a change to
the value of $x_2$. We write that as the following partial derivative

$$
\frac{\partial f}{\partial x_2} = -x_1x_2cot(x_2^2)\left(log\frac{x_1}{sin(x_2^2)}\right)^{-\frac{1}{2}}
$$

Ok this is already going crazy, even though calculating the derivative is a
trivial application of the chain rule, doesn't change the fact that it is
laborious. Now imagine hand-coding this for every possible function type,
inter-leaved with control flow statements in a programming language. That
is getting too complicated already but nonetheless this gives us the exact
form of the differential.

## Numerical Methods

A slighly less laborious method exists where one only approximates the
value based on an infinitesimal perturbation from the point of interest.

### Forward Difference Method

$$
\frac{\partial f}{\partial x_2} \approx \frac{f(x_1,x_2+h)-f(x_1,x_2)}{h}
$$

This can be easily derived from the Taylor Series expansion of $f$ with
a first order approximation. $h > 0$ is an infinitesimally small step
size.

### Center Difference Method

A numerically more stable variant is given by

$$
\frac{\partial f}{\partial x_2} \approx \frac{f(x_1,x_2+h)-f(x_1,x_2-h)}{2h}
$$

Despite this, both these approaches commit the cardinal sins of numerical analysis -
_"thou shalt not add small numbers to big numbers"_ and
_"thou shalt not subtract numbers which are approximately equal”_, hence
plagued by truncation and round-off errors.

## Symbolic Differentiation

Symbolic differentiation is used by mathematical analysis systems like
_Mathematica_, where a pre-defined set of operations like chain rule
for products are available and each function's form is mechanistically
produced before the evaluation. This requires complete knowledge of all
control flow in the program and needs to literally build the complete
computational graph (discussed later). It still presents the challenge
of how much should a designer hand code the pre-set rules.

While useful in their own right, such kind of algebraic systems are plagued
with a problem called _expression swell_ where the final exact form of the
differentiation can get exponentially large and out of control. Note that
in the above example, I have manually cancelled out a lot of terms by virtue
of hand-coding. But an algebraic system cannot identify such patterns by
itself. Despite all the effort of encoding a basic set of differentiation
rules into some data structures, this still doesn't save us from approximation
errors.

## Automatic Differentiation

We will now introduce what is known as Automatic Differentiation. The idea
behind this approach is not limited in any form by the nature of the
function and can work across complicated control flow statements. All it
cares about is the sequence of operations performed. Before we dive into
the details, let us understand computational graphs.

### Computational Graphs

Computational Graphs are a very simple idea based on _Dynamic Programming_.
Each computation can be considered as a directed graph of basic operations
(i.e add, multiply, divide, trigonometric functions and so on). The values
propagated along each path in the graph compound on top of each other to
reach the final value. (Does that remind you of Neural Networks? Hold on
to that thought). Consider the graph for our function $f$.

![Computational graph for f Forward Mode](//i.imgur.com/TiD3zYJ.png "Computational graph for f Forward Mode")

Intuitively, think of each node as a special gate function that we have
implemented. For instance, we have a gate which just passes the incoming
value (we'll call it the `=` gate). Elsewhere we have a "`log`-gate" which
takes the `log` of incoming value. The function that each gate applies to
an incoming value has been specified on top of each node in consideration.

It is also important to realize the full power of these graphs here in the
sense that this doesn't care about the complicated logic in our code
like loops and conditionals. Given a set of input values, whatever
computation happens next gets recorded in the graph irrespective of what
"might" have been in the other conditional branch.

### Forward Mode

The composition of all these gates starting from the input nodes $v_{-1}$
and $v_0$ to the final output node $v_6$ gives us the value
of the function $f$. You should be easily able to convince yourself
off that. This is generally familiar to everybody as the natural flow of
composition.

To make it explicit, we will build below something called the _Forward
Primal Trace_ and the corresponding _Forward Tangent Trace_. I would
recommend that you don't look at the full symbolic representations of
$v_i$ and trust the computations below. But, for the sake of
completing the intuition, you might work that alongside yourself.
Remember we are calculating the derivative $\dot{y} = \frac{\partial f}{\partial x_2}$.

$$
\begin{aligned}
v_{-1} &= x_1 \\
v_0 &= x_2 \\
v_1 &= v_0^2 \\
v_2 &= sin(v_1) \\
v_3 &= \frac{v_{-1}}{v_2} \\
v_4 &= log(v_3) \\
v_5 &= \sqrt{v_4} \\
v_6 &= v_{-1} * v_5 \\
y &= v_6
\end{aligned}
$$

$$
\begin{aligned}
\dot{v}_{-1} &= 0 \\
\dot{v}_0 &= 1 \\
\dot{v}_1 &= 2v_0\dot{v}_0 \\
\dot{v}_2 &= cos(v_1)\dot{v}_1 \\
\dot{v}_3 &= \frac{\dot{v}_{-1}v_2 - v_{-1}\dot{v}_2}{v_2^2} \\
\dot{v}_4 &= \frac{1}{v_3}\dot{v}_3 \\
\dot{v}_5 &= -\frac{1}{2}v_4^{-\frac{1}{2}}\dot{v}_4 \\
\dot{y} = \dot{v}_6 &= \dot{v}_{-1} v_5 + v_{-1}\dot{v}_5
\end{aligned}
$$

The order of evaluation in the forward mode is top to bottom. If one observes
carefully, each lower term can be calculated from operands that have
already been calculated in some higher term. And each intermediate derivative
$\dot{v}_i$ is calculated using some elementary differentiation rules
like the sum-rule or the product rule and so on. Substituting, all the values
backwards should result in the exact same value as above. Interestingly, observe
that we never really needed the full symbolic representation of the differentiation
formula but just local "gate" level formulas from our repository of basic rules.

In the larger picture, it is important to understand what the _forward
tangent trace_ actually calculates. It calculates the rate of change of
the function $f$ with respect to one of the inputs $x_2$.
While optimizations in practice, we are usually interested in how the
output behaves with respect to all the input parameters. For instance, in
the case of neural networks, these parameters comprise of weight matrices
between each layer. It isn't hard to see that to calculate the gradient
with respect to a total of $n$ parameters, one would need $n$
forward mode differentiations. In deep neural networks, those numbers
are crazily huge rendering this technique terribly inefficient.

#### Dual Numbers

_This is a digression and not really important for the purpose of this post.
It can be safely skipped. But for the adventurous, this presents how beautifully
mathematicians come up with certain definitions to present efficient patterns._

Mathematically, the forward mode can be seen as a set of operation on
**dual numbers**. By definition, they are just the truncated _Taylor Series_
expansion until first order derivative and any value $v$ is
augmented as

$$
v + \dot{v}\epsilon
$$

where $\epsilon^2 = 0$. Now consider some operations like adding and
multiplying two dual numbers

$$
\begin{aligned}
(u + \dot{u}\epsilon) + (v + \dot{v}\epsilon) &= (u+v) + (\dot{u} + \dot{v})\epsilon \\
(u + \dot{u}\epsilon)(v + \dot{v}\epsilon) &= (uv) + (u\dot{v}+\dot{u}v)\epsilon
\end{aligned}
$$

The coefficients of $\epsilon$ are exactly equal to the symbolic
derivatives. Now we must add one more definition to this concept before it
can be universally utilized.

$$
f(v + \dot{v}\epsilon) = f(v) + f^\prime(v)\dot{v}\epsilon
$$

This implies that for a composition

$$
f(g(v + \dot{v}\epsilon)) = f(g(v) + g^\prime(v)\dot{v}\epsilon) = f(g(v)) + f^\prime(g(v))g^\prime(v)\dot{v}\epsilon
$$

which is in fact the symbolic derivative formula for the chain rule.

Analogously, imagine something we do between real and complex numbers but
just that the operator $i^2 = -1$. In practice, this technique helps
encode together the function and derivatives by either transforming the
non-dual code or through operator overloading.

### Reverse Mode

The _reverse mode_ is the general form of a more familiar technique known as
the backpropagation, which is at the heart of neural networks. We define
the adjoint of a variable $v_i$ as

$$
\bar{v}_i = \frac{\partial y}{\partial v_i}
$$

which intuitively describes the sensitivity of the output with respect to
the intermediate variable $v_i$. For instance, in neural networks,
the output usually tends to be the loss function $L$ applied to the
output of forward pass and we are interested in observing how does the loss
vary with respect to the input parameters of the network. This time along
with the _Forward Primal Trace_ we will build the _Reverse Adjoint Trace_.
I would again recommend not looking at the full symbolic representations
of the derivatives but instead try and trust the computations happening
below.

$$
\begin{aligned}
v_{-1} &= x_1 \\
v_0 &= x_2 \\
v_1 &= v_0^2 \\
v_2 &= sin(v_1) \\
v_3 &= \frac{v_{-1}}{v_2} \\
v_4 &= log(v_3) \\
v_5 &= \sqrt{v_4} \\
v_6 &= v_{-1} * v_5 \\
y &= v_6
\end{aligned}
$$

$$
\begin{aligned}
\bar{v}_0 &= \bar{v}_1 \frac{\partial v_1}{\partial v_0} \\
\bar{v}_1 &= \bar{v}_2 \frac{\partial v_2}{\partial v_1} \\
\bar{v}_2 &= \bar{v}_3\frac{\partial v_3}{\partial v_2} \\
\bar{v}_{-1} &= \bar{v}_{-1} + \bar{v}_3\frac{\partial v_3}{\partial v_{-1}}\\
\bar{v}_3 &= \bar{v}_4 \frac{\partial v_4}{\partial v_3} \\
\bar{v}_4 &= \bar{v}_5 \frac{\partial v_5}{\partial v_4} \\
\bar{v}_5 &= \bar{v}_6 \frac{\partial v_6}{\partial v_5} \\
\bar{v}_{-1} &= \bar{v}_6 \frac{\partial v_6}{\partial v_{-1}} \\
\bar{y} &= \bar{v}_6 = 1
\end{aligned}
$$

Now this result is truly magical because in a single-pass we have
computed the sensitivity of my output with respect to each input variable -
$\bar{v}_{-1} = \frac{\partial y}{\partial v_{-1}}$ and
$\bar{v}_0 = \frac{\partial y}{\partial v_0}$.
The trace on the left is the trivial one about which you should be
convinced by now. The trace on the right is in fact evaluated from bottom
to top. Contrary to the _Forward Tangent Trace_, in the _Reverse Adjoint Trace_
shown on the right above, each lower term is calculated before a higher
term and as a result the operands of each higher term are available for
usage. Note that each adjoint is calculated in reverse order of occurrence in
the _Forward Primal Mode_ (traverse the computational flow graph in
reverse level-order).

You must have also observed that $\bar{v}_{-1}$ is calculated
twice in the _Reverse Adjoint Mode_ and in fact the resultant value
is the accumulation of both adjoints. Intuitively, observe from the
computational graph that the input variable $v_{-1}$ can influence
the output via two paths (indirectly via $v_3$ and directly via
$v_6$) and this accumulation of the value twice is
reflective of that. Consequently, _Reverse Mode_ is also known as the
_Reverse Accumulation Mode_.

From a computational standpoint, we must again observe that we only
care about the local derivative flow at the gate and the rest
falls into place. This property comes from the chain rule of
derivatives and makes computations extremely efficient and accurate
(of course only up to the floating point error).

This technique has been independently invented multiple times in history
and perhaps one of the most influential research outputs from 20th Century
Mathematics. AD techniques in Machine Learning have become ubiquitous with
Neural Networks bursting into the scene and the huge amount of computations
that needed to be done. Deep Learning frameworks like _Tensorflow_ and
_PyTorch_ extensively use AD.

#### Runtime Cost

Let the total number of operations in a function
$f: \mathbb{R}^m \to \mathbb{R}^n$ be $ops(f)$.

To calculate the sensitivity of output with respect to each input parameter,
for the forward mode, we have total cost as $\Omega(m \times ops(f))$ because
one forward pass will calculate the values for all outputs with respect to
one parameter. Conversely, the backward pass will run in
$\Omega(n \times ops(f))$ as it will calculate the derivative of one output
with respect to all parameters. It is easy to see that when $n \ll m$,
the reverse mode AD performs roughly better overall.

## Sample Code

Here is a toy neural network in _PyTorch_ which uses Automatic Differentiation
in the `backward()` phase of the network.

```python
import torch
from torch.autograd import Variable

def main():
    ##
    # N - Number of sample instances
    # D_in - Dimension of input sample
    # H - Number of neurons in the hidden layer
    # D_out - Number of neurons in the output layer
    #
    N, D_in, H, D_out = 64, 1000, 100, 10

    # Randomly initialize some inputs and desired outputs
    x = Variable(torch.randn(N, D_in))
    y = Variable(torch.randn(N, D_out))

    # ReLU activation function for hidden layer (rest linear layers)
    model = torch.nn.Sequential(
        torch.nn.Linear(D_in, H),
        torch.nn.ReLU(),
        torch.nn.Linear(H, D_out),
    )

    # Mean Squared Error Loss for output layer
    loss_fn = torch.nn.MSELoss(size_average=False)

    # Stochastic Gradient Descent with some learning rate
    lr = 1e-4
    optimizer = torch.optim.SGD(model.parameters(), lr=lr)

    for t in range(500):
        # Forward Mode
        y_pred = model(x)

        # Compute Loss at the output layer w.r.t desired outputs
        loss = loss_fn(y_pred, y)
        print(t, loss.data[0])

        ##
        # Flush the gradient accumulator to prevent gradients
        # from last reverse pass
        #
        optimizer.zero_grad()

        ##
        # Reverse Accumulation Mode using Automatic Differentiation
        #
        loss.backward()

        ##
        # Update the model parameters (the weight matrices) using
        # the gradient loss from Reverse Mode and Learning Rate
        #
        optimizer.step()

if __name__=='__main__':
    main()
```

It is interesting to note here that Torch (and many other) build
_dynamic computational graphs_ on the fly as and when the operations
are executed. For non-trivial operations, one needs to implement
a `backward()` function which dictates how the gradients are
supposed to be calculated.
