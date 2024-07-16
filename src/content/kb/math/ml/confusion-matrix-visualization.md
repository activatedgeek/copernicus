---
title: Visualizing the Confusion Matrix
description: Summary of terminologies in Confusion Matrix
date: Oct 15 2017, 13:33 -0400
area: math
redirectsFrom:
  - /blog/ml/confusion-matrix-visualization
  - /machine-learning/confusion-matrix-visualization
---

_Confusion Matrix_ is a matrix built for binary classification problems.
It is an important starting tool in understanding how well a binary
classifier is performing and provides a whole bunch of metrics to be
analysed and compared.

Here, I present an intuitive visualization given that most of the times
the definition gets confusing.

![The Confusion Matrix](//i.imgur.com/uipmEwt.png "The Confusion Matrix")

## How to read the visualization?

Before we go ahead and read the visualization, let us remember the definitions.

- _True Negatives_ - All samples that were identified as negative labels and
  were truly negative

- _False Negatives_ - All samples that were identified as negative labels and
  were in fact positive

- _True Positives_ - All samples that were identified as positive labels and
  were truly positive

- _False Positives_ - All samples that were identified as positive labels and
  were in fact negative

Now, each array in the visualization above specifies the name of the metric that
we are going to measure, and the start point of each ray represents the
numerator of that metric and the span of the ray represents the summation
of the adjacent terms. Note that each metric is essentially a fraction.

Let us read the most popular ones from the visualization.

$$
\text{Recall} = \frac{TP}{TP+FN}
$$

$$
\text{Precision} = \frac{TP}{TP+FP}
$$

## When are they useful?

These metrics come in handy when trying to determine the best threshold
to separate the positive classes from the negative classes in a binary
classification problem.

For instance, a popular trade-off is the _precision-recall trade-off_ which
is realized in the graph below. Precision tends to be more wriggly by nature.

![](//i.imgur.com/bUqbFXU.png)

More simply we might just choose a _Precision v/s Recall Curve_. This curve
shows that we still have scope for improvement towards the right as it
suddenly shows a dip in precision with increase in recall.

![](//i.imgur.com/7TIpZUb.png)

Or another popular curve called the ROC-Curve which maps between the
_True Positive Rate_ and _False Positive Rate_. It can also be seen
as the _Sensitivity v/s 1-Specificity_. The closer this curve is
to the left-top corner, the better the classifier. Or alternatively,
the closer the curve is to the center line, the more likely it is to be
just as good as a random classifier.

![](//i.imgur.com/vtdW5sh.png)

The scope of what is useful when is more sample dependent but these
curves should be a good starting point in the analysis of the first
binary classifier that one builds.
