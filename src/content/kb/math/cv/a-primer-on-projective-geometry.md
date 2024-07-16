---
title: A Primer on Projective Geometry
description: Understanding the basics behind 2D projections
date: Jul 19 2017, 3:08 +0530
area: math
redirectsFrom:
  - /blog/ml/a-primer-on-projective-geometry
---

Projective Geometry [^@hartley2003] is a term used to describe properties of projections of a given
geometric shape. When a shape is projected onto $\mathbb{R}^2$(commonly known as
the 2D real space), it is called a Planar Projection. This idea can be extended to
a shape being projected as $H : \mathbb{R}^m \to \mathbb{R}^n$where $H$
is a _homogenous_ matrix. To understand concepts, we'll use Planar geometry because
that is the easiest to visualize.

## Homogenous Representation of Points and Lines

From elementary geometry, we know that a line in the plane is represented by
$ax + by + c = 0$. In vector form, a line can also be written as
$(a,b,c)^T$. As can be easily seen, any multiple of this vector will also
represent the same line. Hence, we can define the equivalence: $(a,b,c)^T \equiv k(a,b,c)^T$.
The class of such vectors is know as the _homogenous vector_. The set of all
such equivalence classes in $\mathbb{R}^3 - (0,0,0)^T$ form the _Projective Space_
$\mathbb{P}^2$ with $(0,0,0)^T$ excluded because it does not represent a line.

From the same equation above, the point $(x,y)^T$ lies on the line $(a,b,c)^T$
and hence can be rewritten as

$$
(x,y,1)^T(a,b,c) \equiv \textbf{x}^T\textbf{l} = 0
$$

Now, observe here that for convenience we represent $(x,y)^T$ in $\mathbb{R}^2$
as $(x,y,1)^T$ in $\mathbb{P}^2$. Generalizing it further, let us say we
represent points in $\mathbb{P}^2$ as $(x_1,x_2,x_3)^T$, which when
accounted for scale (read _equivalence class_), can be rewritten as the
homogenous vector $(x_1/x_3,x_2/x_3, 1)$ in $\mathbb{P}^2$ and represents
$(x_1/x_3,x_2/x_3)$ in $\mathbb{R}^2$.

Now that we have basic definitions in place, let us see how this representation helps.

## Intersection of Lines

Let us consider two lines $\textbf{l} = (a,b,c)^T$ and
$\textbf{l}^\prime = (a^{\prime},b^{\prime},c^{\prime})^T$.

The point of intersection of two lines is given by

$$
\textbf{x} = \textbf{l} \times \textbf{l}^{\prime}
$$

It is easy to see why the above formula works. But, in $\mathbb{R}^2$, there
is one special case - parallel lines. We know about the notion that
_parallel lines meets at infinity_ but _infinity_ is just another way of saying
that something is not defined. Instead in $\mathbb{P}^2$, we'll see that there
exists no such special case.

Consider lines $x = 1$ and $x = 2$ in $\mathbb{R}^2$. These are
represented by lines $(1,0,-1)$ and $(1,0,-2)$ in $\mathbb{P}^2$.
The point of intersection will be given by the cross product -

$$
\begin{bmatrix} i & j & k \\ 1 & 0 & -1 \\ 1 & 0 & -2 \end{bmatrix} = \begin{pmatrix} 0 \\ -1 \\ 0 \end{pmatrix}
$$

The vector $\textbf{x} = (0,-1,0)^T$ is very well defined and hence we did
not need to handle parallel lines as a special case in $\mathbb{P}^2$. But what
point does this _homogenous vector_ describe in $\mathbb{R}^2$? By definition,
it should be $(\frac{0}{0}, \frac{-1}{0})^T$ which is not defined and hence,
the lines meet at infinity as expected. So, we satisfy definitions of parallel lines
and their intersection in both spaces.

We define such points where $x_3 = 0$ as _ideal points_ and belong to the
_line at infinity_. For any general _ideal point_ $(a,b,0)^T$, it is easy
to see that the equivalence class of the _line at infinity_ can be represented by
$\textbf{l}_{\infty} = (0,0,1)^T$. This fact that parallel lines do
intersect at well-defined points in $\mathbb{P}^2$ will have a very important
implication in projections.

## Projective Transformations

Geometry is the study of properties invariant under a given set of transformation.
For the purpose of this illustration, we will see 2D projective geometry, which
is the study of properties of the projective plane $\mathbb{P}^2$.

_Definition 1_: We define a _projectivity_ as an invertible mapping $h: \mathbb{P}^2 \to \mathbb{P}^2$
such that three points $\textbf{x}_1, \textbf{x}_2, \textbf{x}_3$ are collinear
iff $h(\textbf{x}_1), h(\textbf{x}_2), h(\textbf{x}_3)$ are collinear. It is
alternatively known as _homography_.

There is an alternative algebraic way to write this.

_Definition 2_: A mapping $h: \mathbb{P}^2 \to \mathbb{P}^2$ is called a projectivity
iff there exists a $3 \times 3$ non-invertible matrix such that
$\textbf{x}^{\prime} = H\textbf{x}$.

To see how both of these definitions are equivalent, consider points $x_1,x_2,x_3$
on line $\textbf{l}$, which by definition would imply -

$$
{\textbf{x}_i}^T\textbf{l} = 0 \kern{3em} \forall i \in {1,2,3}
$$

Introducing $H$ and some manipulations,

$$
\Rightarrow \textbf{x}_i^T(H^{-1}H)^T\textbf{l} = 0
$$

$$
\Rightarrow \textbf{x}_i^TH^TH^{-T}\textbf{l} = 0
$$

$$
\Rightarrow (H\textbf{x}_i)^T(H^{-T}\textbf{l}) = 0
$$

$$
\Rightarrow (\textbf{x}_i^\prime)^T\textbf{l}^\prime = 0
$$

Hence, the matrix $H$ transforms the set of collinear points $\textbf{x}_i$
on $\textbf{l}$ to points ${\textbf{x}_i}^\prime$ on $\textbf{l}^\prime$
proving the equivalence of _Definition 1_ and _Definition 2_.

## Class of Projections

Now that we have convinced ourselves about the algebraic nature of projections,
let us take a look some special cases of _Projective Transformations_. Note
that each transformation discussed below has a given set of invariants. The
ability to assess and reconstruct such patterns is the essence of scene geometry
understanding in _Computer Vision_.

### Isometries

These are transformations of the plane $\mathbb{R}^2$ that preserve the
_Euclidean distance_.

$$
\begin{pmatrix} x^\prime \\ y^\prime \\ 1 \end{pmatrix} =
  \begin{bmatrix} \epsilon\cos\theta & - \sin\theta & t_x \\ \epsilon\sin\theta & \cos\theta & t_y \\ 0 & 0 & 1 \end{bmatrix} \begin{pmatrix} x \\ y \\ 1 \end{pmatrix}
$$

This transformation can be written in block form as:

$$
H_E = \begin{bmatrix} \textbf{R} & \textbf{t} \\ \textbf{0}^T & 1 \end{bmatrix}
$$

where $\epsilon = \pm 1$ for orientation preservation, $\textbf{R}$
is the _orthogonal rotation matrix_ and $\textbf{t}$ is the _translation vector_.

### Similarity Transformations

This transformation is an extension of isometry with scaling involved. Hence, instead
of the _Euclidean distance_ being preserved, the ratios like between two lengths
or two areas are preserved. In essence, shapes are preserved.

$$
\begin{pmatrix} x^\prime \\ y^\prime \\ 1 \end{pmatrix} =
  \begin{bmatrix} s\cos\theta & - s\sin\theta & t_x \\ s\sin\theta & s\cos\theta & t_y \\ 0 & 0 & 1 \end{bmatrix} \begin{pmatrix} x \\ y \\ 1 \end{pmatrix}
$$

This transformation can be written in block form as:

$$
H_S = \begin{bmatrix} s\textbf{R} & \textbf{t} \\ \textbf{0}^T & 1 \end{bmatrix}
$$

where $s \in \mathbb{R}$ represents the scaling factor.

### Affine Transformations

Affine transformations are an extension to the similarity transform but with an
added deformity factor. This preserves parallelism.

$$
\begin{pmatrix} x^\prime \\ y^\prime \\ 1 \end{pmatrix} =
  \begin{bmatrix} a\_\text{11} & a\_\text{12} & t_x \\ a\_\text{21} & a\_\text{22} & t_y \\ 0 & 0 & 1 \end{bmatrix} \begin{pmatrix} x \\ y \\ 1 \end{pmatrix}
$$

This transformation can be written in block form as:

$$
H_A = \begin{bmatrix} \textbf{A} & \textbf{t} \\ \textbf{0}^T & 1 \end{bmatrix}
$$

where $A$ represents a general linear part. It is easy to observe that
_lines at infinity_ remain at _infinity_.

### Projective Transformations

These are the most generalized set of transformations and can be written in block form as:

$$
\textbf{x}^\prime = H_P\textbf{x} = \begin{bmatrix} \textbf{A} & \textbf{t} \\ \textbf{v}^T & w \end{bmatrix}
$$

The invariant property here, other than the previously discussed collinearity is
something known as a _cross-ratio_ which is defined as a ratio of ratios -

$$
Cross(x_1,x_2,x_3,x_4) = \frac{ \begin{vmatrix} x_1x_2 \end{vmatrix} \begin{vmatrix} x_3x_4 \end{vmatrix} }{ \begin{vmatrix} x_1x_3 \end{vmatrix} \begin{vmatrix} x_2x_4 \end{vmatrix} }
$$

where $\begin{vmatrix} x_ix_j \end{vmatrix} = det \begin{vmatrix} x_\text{i1} & x_\text{i2} \\ x_\text{j1}& x_\text{j2} \end{vmatrix}$ in $\mathbb{P}^1$ (can be extended).
Note that the order of the points will change the ratio (which have a simple relationship)
but as long as the definition is consistent, it is an invariant.

Coming back to an earlier discussion on _homogenous points_, consider an _ideal point_
transformed by a _Projective Transformation_.

$$
\textbf{x}^\prime = H_P\textbf{x} = \begin{bmatrix} \textbf{A} & \textbf{t} \\ \textbf{v}^T & w \end{bmatrix}
$$

where $\textbf{v}^T \neq \textbf{0}^T$. It can be observed that
_lines at infinity_ **DONOT** remain at _infinity_.

$$
\begin{bmatrix} \textbf{A} & \textbf{t} \\ \textbf{v}^T & w \end{bmatrix} \begin{pmatrix} \textbf{x} \\ 0 \end{pmatrix} = \begin{pmatrix} A\textbf{x} \\ \textbf{v}^T\textbf{x} \end{pmatrix}
$$

which will not remain an _ideal point_ anymore due to the $\textbf{v}^T\textbf{x}$
component and hence **helps model vanishing points** - _imagine two parallel rail
tracks meeting at the edge of the horizon as seen by the eyes_.

## Application

A projective transformation can be decomposed into the following set of transformations -

$$
H = H_S H_A H_P = \begin{bmatrix} \textbf{R} & \textbf{t} \\ \textbf{0}^T & 1 \end{bmatrix} \begin{bmatrix} \textbf{K} & \textbf{0} \\ \textbf{0}^T & 1 \end{bmatrix} \begin{bmatrix} \textbf{I} & \textbf{0} \\ \textbf{v}^T & w \end{bmatrix}
$$

$H_P$ moves the _line at infinity_, $H_A$ makes an affine transformation
and preserves the invariants of $H_P$,
and $H_S$ is the similarity transform and preserves the invariants of both
$H_P$ and $H_A$.

All the above equips us with a fundamental understanding of what matrices need to be
computed when trying to reconstruct geometry from given scene and keypoints. I
will discuss one of the simpler rectification problems here in theory.

### Affine Rectification of images

We will see that identifying the _line at infinity_ will allow us to recover
the affine properties of an image. Remember from the above discussion, that

$$
\textbf{l}^\prime_\infty = H_A^\text{-T}\textbf{l}_\infty = \begin{bmatrix} \textbf{A}^\text{-T} & \textbf{0} \\ - \textbf{t}^\text{-1}\textbf{A}^\text{-T} & 1 \end{bmatrix} \begin{pmatrix}0 \\ 0 \\ 1 \end{pmatrix} = \begin{pmatrix}0 \\ 0 \\ 1 \end{pmatrix} = \textbf{l}_\infty
$$

and that a _line at infinity_ is only preserved when H is an _affinity_. Effectively,
what we need to find a projective matrix which transforms an identified
${\textbf{l}^\prime}_\infty$ in the image to the canonical position of
$\textbf{l}_\infty = (0,0,1)^T$.

Consider a given image where we have identified 2 pairs of parallel lines in homogenous coordinates -
$\textbf{l}_1 \parallel \textbf{l}_2$ and $\textbf{m}_1 \parallel \textbf{m}_2$. To calculate the
_line of infinity_ in the image space,

$$
\textbf{p}_l = \textbf{l}_1 \times \textbf{l}_2
$$

$$
\textbf{p}_m = \textbf{m}_1 \times \textbf{m}_2
$$

$$
{\textbf{l}^\prime}_\infty = \textbf{p}_l \times \textbf{p}_m
$$

where $\textbf{p}_l$ and $\textbf{p}_m$ are the _ideal points_
from respective pair of parallel lines. ${\textbf{l}^\prime}_\infty$ is the
_line of infinity_ constructed via the _ideal points_. Using this line, we need
to find a projective matrix which converts it into the canonical line at infinity
$(0,0,1)^T$.

$$
H_1 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ l_1 & l_2 & l_3 \end{bmatrix}
$$

where $(l_1,l_2,l_3)^T = {\textbf{l}^\prime}_\infty$. It is verifiable that
${H_1}^\text{-T}{\textbf{l}^\prime}_\infty = \textbf{l}_\infty$.

If we now apply the same transformation matrix to all points on the image, the image
will be rectified to actually show parallel edges as parallel.

The above discussion introduces the basic matrices and invariant properties which
we look for while processing images for geometric scene understanding. A more
practical approach to the rectification problem above and more complex problems
like _2D Homography_ and _Stereo Matching_ will be discussed in another post.

[^@hartley2003]: Harltey, A., & Zisserman, A. (2003). Multiple view geometry in computer vision (2. ed.).
