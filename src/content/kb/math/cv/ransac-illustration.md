---
title: Introduction to RANSAC
description: An illustration on one of the celebrated algorithms in Computer Vision
date: Jun 24 2017, 22:11 +0530
area: math
redirectsFrom:
  - /blog/ml/ransac-illustration
---

Given a data set and a question to be answered, one generally tends to solve the
problem in the following fashion -

- Understand the data and its patterns
- Hypothesize a model which will fit the data in the most relevant manner

A theme that overarches all such models is that they need to be _fast_, _accurate_
and _robust_. The models need to be reasonably _fast_ to provide actionable results
in meaningful time, need to be _accurate_ for the user to rely on and need to be
_robust_ in scenarios where the data is adversarial. The following discussion is
particularly inclined towards solving for robustness while not significantly
impacting the other two metrics.

Talking of adversarial data, it could come from error introduced during manual
sampling or extrinsic factors like noise. In other cases, it could just be the
nature of the data, making it less predictable. Data samples which don't follow
the general "trend" of the data are known as **outliers** and generally introduce
an unwanted outcomes including results being inaccurate.

## An Illustration

To understand why the outliers are a problem, let us consider the following data.
For the purpose of this problem, consider the data points that come from

$$
y = f(x) = x
$$

The points are represeted in the code below by variables $x$ and $y$
consisting of 100 randomly generated points. I've chosen one-dimensional data as
it is easy to visualize and understand the implications of changes.

```python
%matplotlib inline

from sklearn import linear_model
import numpy as np
import matplotlib.pyplot as plt

num_samples = 100
x = np.sort(np.random.rand(1, num_samples) * 500)
y = np.copy(x)
```

For the sake of this illustration, let us artificially introduce Gaussian noise
(i.e. noise with the probability density function equal to the normal distribution)
and add that to the original sample $y$.

```python
noise = np.random.normal(0, 1, (1, num_samples))
y_noise = np.copy(y) + noise * 30
```

Note that this noise will only bring minor jitters to the actual line. So, to make
things worse, let us introduce some outliers manually. For instance, I chose to
change all values of $x<=40$ to be magnified by a factor of $10$.

```python
y_noise[np.where(x <= 40)] *= 10
y_noise[np.where((x >= 200) & (x <= 230))] *= -4
y_noise[np.where((x >= 400) & (x <= 430))] *= 4
```

Now, let us see how the final artifically constructed data looks as compared to
the originally clean line $y=x$. Looks like we have done a fair amount of damage
to the data.

```python
original_data_plot, *od = plt.plot(x, y, 'g+')
noisy_data_ploy, *nd = plt.plot(x, y_noise, 'r1')
plt.legend([original_data_plot, noisy_data_ploy], ['Original Data', 'Noisy Data'])
plt.show()
```

![Original Data v/s Noisy Data](//i.imgur.com/2QpF5AX.png "Original Data v/s Noisy Data")

## Training a Linear Model

To make things simple, let us train a linear model to fit a line which best matches
the data points. As with all general approaches, we'll take a $60:40$ train
to test split ratio for the purpose of this model. By design of the problem we
know that there is only one variable and hence the _Linear Regressor_ will fit data
to the model -

$$
y = mx + c
$$

Remember that we added noise to data which had $m=1$ and $c=0$.

```python
lm = linear_model.LinearRegression()
num_train = np.floor(num_samples * 0.6).astype(int)
x_train = x[0, :num_train].reshape(-1, 1)
y_train = y_noise[0, :num_train].reshape(-1, 1)
x_test = x[0, num_train:].reshape(-1, 1)
y_test = y_noise[0, num_train:].reshape(-1, 1)
lm.fit(x_train, y_train)
print(lm.coef_, lm.intercept_)
```

Great! We have a coefficient and the intercept. That seems way off. Let us see
how our predictions look as compared to original data.

```python
original_data_plot, *od = plt.plot(x, y_noise, 'r1')
predicted_data_plot, *pd = plt.plot(x, x * lm.coef_ + lm.intercept_, 'b.')
plt.legend([original_data_plot, predicted_data_plot], ['Original Data', 'Predicted Data'])
plt.annotate('outliers', xy=(240, -800), xytext=(300,-600), arrowprops=dict(linewidth=0.1))
plt.annotate('outliers', xy=(400, 1600), xytext=(270,1400), arrowprops=dict(linewidth=0.1))
plt.show()
```

![Original Data v/s Trained Data via Simple Linear Regression](//i.imgur.com/Ntphfvr.png "Original Data v/s Trained Data via Simple Linear Regression")

Oops! That is an awfully skewed line and will not be an accurate predictor of the
data we started with. As you might have guessed already, this problem aries because
of the outliers labelled above.

## The Solution

We need a way to de-sensitize our model to the outliers which are leading to the
trained model in a bad shape seen above. One of the most popular approaches to
outlier detection is **RANSAC** or **Random Sample Consesus**. The algorithm performs
the following steps -

### Algorithm

1. Sample a subset of data uniformly at random (the minimum number of points needed to estimate the model)
1. Estimate parameters for the model of choice using the sampled subset.
1. Calculate the error for all remaining samples using an error function.
1. Count number of inliers i.e., all samples below a given threshold error.
1. If the number of inliers are above a given threshold, recompute the model using all inliers and hypothesis points
1. Repeat the above to find the best model.

While there is nothing complex about the algorithm, it is an extremely elegant and
efficient idea. It is important to understand that RANSAC is not a regressor itself
but helps improve the robustness of a given model by non-deterministically sampling
subsets of data and training on them. Think of it as a more efficient alternative
to _k-fold cross-validation_.

Let us see how the _RANSAC Regressor_ works for our problem.

```python
rlm = linear_model.RANSACRegressor(linear_model.LinearRegression())
rlm.fit(x_train, y_train)
original_data_plot, *od = plt.plot(x, y_noise, 'r1')
predicted_data_plot, *pd = plt.plot(x, x * rlm.estimator_.coef_ + rlm.estimator_.intercept_, 'b.')
plt.legend([original_data_plot, predicted_data_plot], ['Original Data', 'Predicted Data (RANSAC)'])
plt.show()
```

![Original Data v/s Trained Data via Simple Linear Regression Augmented with RANSAC](//i.imgur.com/d0ITBFS.png "Original Data v/s Trained Data via Simple Linear Regression Augmented with RANSAC")

Wow! That looks way better than the previous result and is generally moving in a
correct direction. In essence, RANSAC works because it tries out different model
hypotheses and returns the best possible match after a given number of trials. In
that effort, the model hypothesis which would have contained the outliers would
have been outright rejected in the error thresholding step.

## Mathematical Analysis

Like all non-deterministic algorithms, we must show that this algorithms returns
result with reasonable probabilistic bounds. This analysis will also expose us to
the various parameters that go behind the scenes.

Let $k$ be the number of trials we run for the algorithm above to select
a subset of $n$ good samples. Let $w$ be the probability that a given
sample is an inlier. Then the expected number of trials are,

$$
E(k) = \displaystyle\sum_{i=1}^\infty i p(i) = \displaystyle\sum_{i=1}^\infty i a^\text{i-1} b = b \displaystyle\sum_{i=1}^\infty i a^\text{i-1}
$$

where $b = w^n$ and $a = 1 - b$. In plain words, $p(i)$ represents
the situation where first $k - 1$ trials have at least one bad sample and the
$k^\text{th}$ trial has all good samples. To solve the summation term of the
expression above, lets expand and observe the pattern -

$$
\displaystyle\sum_{i=1}^\infty i a^\text{i-1} = 1 + 2a + 3a^2 + \mathellipsis + ia^\text{i-1} + \mathellipsis
$$

Consider the identity,

$$
\frac{a}{1-a} = a + a^2 + a^3 + \mathellipsis + a^i + \mathellipsis
$$

which when differentiated wrt. $a$ and substituting in the above summation
expressions gives us

$$
E(k) = b \frac{1}{1-a^2} = \frac{1}{b} = w^\text{-n}
$$

An alternate analysis would be from the perspective where we want to ensure with
a probability $z$ that at least one of the random selection is outlier free.
Hence,

$$
1 - z = (1 - b)^k
$$

$$
k = \frac{log(1-z)}{log(1-b)}
$$

These analyses can be used to estimate the number of trials $k$ needed to
obtain a guarantee as needed by the application on a case by case basis by simply
plugging in the values.

## Conclusion

RANSAC was first used to estimate the Location Determination Problem **LDP**
(estimating points in space to an appropriate point in image). It has become a
fairly common algorithm especially in Computer Vision due to the relatively low
additional computational and storage requirements. It has found regular usage in
problems pertaining to 2D Homography Estimation and Pose Estimation from images
where the number of keypoints generated are fairly large and testing the complete
sample space for solution is practically impossible in real-time.

The core idea behind RANSAC, though powerful, is still not enough for practical
purposes. For instance, one of the biggest assumptions behind using the technique
is the existence of **outliers**. Understandably, it is bound to fail when the
inlier ratio $w$ is low. Among other things, the error function to estimate
whether the sample is an inlier or not will have a significant impact to the accuracy
of the final model.

To solve the above problems, a family of RANSAC algorithms have been proposed which
I'll leave to be explored in further reading [^@ransac1981] [^@choi1997].

[^@ransac1981]: Fischler, M., & Bolles, R. (1981). Random sample consensus: a paradigm for model fitting with applications to image analysis and automated cartography. Commun. ACM, 24, 381-395.

[^@choi1997]: Choi, S., Kim, T., & Yu, W. (2009). Performance Evaluation of RANSAC Family. BMVC.
