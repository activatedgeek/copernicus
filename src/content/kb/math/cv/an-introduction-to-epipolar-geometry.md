---
title: An Introduction to Epipolar Geometry
description: Understanding the intuition behind 3D to 2D mappings, the Fundamental Matrix with a demo
date: Aug 8 2017, 16:01 +0530
updated: Jul 9 2020, 20:29 -0700
area: math
redirectsFrom:
  - /blog/ml/an-introduction-to-epipolar-geometry
  - /machine-learning/an-introduction-to-epipolar-geometry
  - /computer-vision/an-introduction-to-epipolar-geometry
---

In this post we will take a look at how Camera Projections work. A demo at the
end will illustrate the important segments of the theory. Prerequisites to
understand the material are available in the _Readings & References_ section below.

Epipolar Geometry [^@hartley2003] is the intrinsic projective geometry between two views. See [A Primer on Projective Geometry](/kb/a-primer-on-projective-geometry) for a concise introduction. This
knowledge becomes an interesting piece in the puzzle of estimating the 3D geometry
of a given image projection and the estimated 3D model can then be applied to a
myriad of meaningful real-world problems.

To get there, we will first establish a theoretical framework on how projections
are formed and realize some interesting properties.

## The Pinhole Camera Model

We will start with a very simple camera where the centre of projection is at the
origin of the Euclidean Coordinate System. Let $Z = f$ be the plane of projection,
more simply the plane where the points in the 3D world space are projected. It is
also called the _image plane_ or the _focal plane_.

![A Simple Pinhole Camera Model](//i.imgur.com/mIBhDt8.png)

$C$ is the _camera centre_ and $p$ is the _principal point_. By virtue of
similar triangles, we can establish a relation between a point in 3D space at $(X,Y,Z)$
to a point on the focal plane at $(x^\prime,y^\prime)$, a distance of focal length
$f$. This has been visualized in the figure above on the right.

$$
\frac{f}{Z} = \frac{y}{Y} \leftrightarrow y = \frac{fY}{Z}
$$

A similar analysis (think of viewing the $ zx $ plane down the $ y $ axis) gives us

$$
\frac{f}{Z} = \frac{x}{X} \leftrightarrow x = \frac{fX}{Z}
$$

and we equivalently define a mapping (by dropping the $z$ coordinate)

$$
(X,Y,Z) \mapsto (x,y) \leftrightarrow ({fX}/{Z},{fY}/{Z})
$$

More formally, this can be defined in terms of homogeneous coordinates and a matrix transform as

$$
\begin{pmatrix}X \\ Y \\ Z \\ 1 \end{pmatrix} \mapsto \begin{pmatrix}fX \\ fY \\ Z \end{pmatrix} = \begin{bmatrix}f & 0 & 0 & 0 \\ 0 & f & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix} \begin{pmatrix}X \\ Y \\ Z \\ 1 \end{pmatrix}
$$

$$
x = PX
$$

This $3 \times 4$ matrix $P$ is known as the **Camera Projection Matrix**.
To adjust for the reference frame in the _image plane_ - origin at corner v/s origin at
the center, we add a translation component to the left $3 \times 3$ matrix of $P$.

$$
K = \begin{bmatrix}f & 0 & p_x \\ 0 & f & p_y \\ 0 & 0 & 1 \end{bmatrix}
$$

and this is called the **Camera Calibration Matrix**. For added generality to allow for non-square
pixels we multiple the matrix with an extra factor of $diag(m_x,m_y,1)$ where $m$ is the
pixels per unit distance. There's another possibility of distortion due to the $x$ and
$y$ axes not being perpendicular and this is denoted by $s$. The final matrix then
becomes -

$$
K = \begin{bmatrix}\alpha_x & s & x_0 \\ 0 & \alpha_y & y_0 \\ 0 & 0 & 1 \end{bmatrix}
$$

In most cases, the camera coordinates will be with respect to a different coordinate system
where it is not at the origin in the world coordinate system. And as we had seen in an earlier
discussion on projective geometry, Euclidean transformations consist of a rotation and a translation
component. Hence, any coordinate can be shifted from the world coordinate space to the camera
coordinate space (where the camera is the origin) with the equation -

$$
X_\text{camera} = R(X_\text{world} - C)
$$

where $R$ is the rotation matrix and $-C$ represents a translation with respect
to the camera center to make it the origin. Combining the _camera calibration matrix_
and the coordinate frame shifting above, we can draw a mapping between the point in
world coordinate system $X$ and the point $x$ in the image plane, represented by

$$
x = KR \begin{bmatrix}I \vert -C\end{bmatrix}X
$$

$$
P = KR \begin{bmatrix}I \vert -C\end{bmatrix}
$$

Parameters in $K$ are called the **camera intrinsics** (they never change) and the
remaining parameters $R$ and $C$ are called the **camera extrinsics**.
In literature, these terms will come often and now we know how these are constructed.

## Epipolar Geometry

Now that we have established all the camera parameters, let us consider two _camera centers_
$C$ and $C^\prime$ with both _image planes_ shown in the figure below. These
cameras project a point $ X $ in the world coordinate system to $x$ and $x^\prime$
in respective _image planes_. The plane formed by all these points is known as the **epipolar plane**.

![Point Correspondence and Epipolar Geometry](//i.imgur.com/GbafZIY.png)

The line joining the two camera centers is known as the **baseline** and intersects both planes at
$e$ and $e^\prime$. These points are known as the **epipoles**, visualized on the right.
We are aiming to establish and constraint between $x$ and $x^\prime$. If one observes
the figure on the right above, the _baseline_ ($CC^\prime$) and the ray back-projected from
$x$ ($CX$) form the _epipolar plane_ $\pi$. When $\pi$ intersects with the
image plane on the right, it forms the line $l^\prime$ which is known as the **epipolar line**
corresponding to $x$. A search for the point correspondence of $x$ denoted by $x^\prime$
is now constrained to this _epipolar line_ which comes as a direct consequence of the way we constructed
$\pi$.

If we rotate the _epipolar plane_ with _baseline_ as the axis, we get a pencil of planes and all
these planes will still intersect at the _epipoles_ $e$ and $e^\prime$. This is a
very interesting result!

## The Fundamental Matrix

We've established some basics for _epipolar geometry_ and realized how images are projected
by a given _camera matrix_ $ P $. Now we will give a more formal treatment to the problem
both algebraically and geometrically and arrive at a very important matrix known as the
Fundamental Matrix (literally!).

### Construction via the Epipolar Plane

In a previous discussion (see Readings), we had seen **Projectivities** which are mappings
from point in one plane to another. By the above construction of the _epipolar plane_, we
can assert that a similar matrix exists, known as the _Planar Homography_ $H_\pi$.

$$
x^\prime = H_\pi x
$$

### Construction via Camera Matrices

In another interesting result, _Fundamental Matrix_ does not need the _epipolar plane_ to be
necessarily defined. Let us see how it directly relates to the _camera matrices_ we described
above.

If one remembers the alternate definition of _epiline_ corresponding to point $x$, it was
the image of the ray back-projected to the world coordinate $X$ in the second camera view.
The solution to the equation

$$
x = PX
$$

is given by a family of solutions in the form of

$$
X(\lambda) = P^+x + \lambda C
$$

To find the _epipolar line_ $l^\prime$ for point $x$, we know from the above
discussion that both the _epipole_ $e^\prime$ and the point correspondence $x^\prime$
lie on the _epiline_. The intersection of these (from our _projective geometry primer_) gives us the line,

$$
l^\prime = e^\prime \times x^\prime = [e^\prime]_\times x
$$

$$
l^\prime = [e^\prime]_\times H_\pi x = Fx
$$

where $F = [e^\prime]_\times H_\pi$ is known as the **Fundamental Matrix**, a matrix
of rank 2. In plain words, $F$ represents a mapping of the projective plane $\mathbb{P}^2$
of the first image to a pencil of _epipolar lines_ $\mathbb{P}^1$ through $e^\prime$.

Note that the notation $[e]_\times$ is a skew-symmetric matrix equivalent for the cross product.

$$
[e]_\times = \begin{bmatrix} 0 & -e_3 & e_2 \\ e_3 & 0 & -e_1 \\ -e_2 & e_1 & 0 \end{bmatrix}
$$

where $P^+$ is the pseudo-inverse of $P$, giving $PP^+ = I$ and
$C$ is the right-null space of $ P $ commonly called the _camera center_.
This has its own interesting little derivation and out of scope here.

We have two known points $C$ and $P^+x$ on the ray which can be projected
onto the second image plane via a second camera matrix $P^\prime$ and the _epiline_
is the cross-product of these two projected points.

$$
l^\prime = (P^\prime C) \times (P^\prime P^+ x)
$$

We have just arrived at an alternate representation of $l^\prime = e^\prime \times x^\prime$
and hence we realize that _epipole_ $e^\prime$ is actually the image of the other
_camera center_. Again we see that

$$
l^\prime = [e^\prime]_\times (P^\prime P^+ x) = Fx
$$

where $F = [e^\prime]_\times P^\prime P^+$ and $H_\pi = P^\prime P^+$.
Wow! We've discovered quite a few important relations between _Homography_,
_Camera Matrices_ and the _Fundamental Matrix_.

### Properties of the Fundamental Matrix

After all the details above, it is easy to arrive and prove at the following result

$$
x^{\prime T}Fx = 0
$$

where $x \leftrightarrow x^\prime$ are point-to-point correspondences in the two image planes.
Solution to the above equation is a fairly popular research problem. For all practical
purposes, the above problem generally remains over-determined with an exact solution determined
by 3 non-collinear point correspondences. Hence, techniques like the _family of RANSAC_ are used
to non-deterministically determine the best fit model via a relevant cost function like the
re-projection error.

## Demo Illustration

### Setup

Each execution requires a stereo image pair (for this purpose I shot two-view
images around my house) which represent the two image planes discussed above.
To arrive at $x\leftrightarrow x^\prime$ point correspondences, I use _SURF_ to
detect keypoints in both images, match them via _FLANN_ and apply _Lowe's ratio test_ to
filter out matches that are too far away and might be false positives. If all above
sounds alien, consider it as a black box as it is out of scope for this discussion.

Then we estimate the **Fundamental Matrix** via _RANSAC_. RANSAC was covered in a [previous post](/kb/introduction-to-ransac). Once we get that we draw the
_epilines_ on both images via $l = F^T x^\prime$ for the left _image plane_ and
$l^\prime = Fx$ for the right _image plane_. These line equations are a direct
consequence of the result $x^{\prime T}Fx = 0$.

### Code

Full code is available upon request but for the purpose of this discussion, the one
below should be easy to follow.

```python
##
# Load the stereo image pair
#
image_l = cv2.pyrDown(cv2.imread('images/view_left.jpg', 0))
image_r = cv2.pyrDown(cv2.imread('images/view_right.jpg', 0))

##
# Consider this matcher a black box for the purpose of this discussion
#
matcher = SURFKeyPointMatcher()
kp_l, des_l, kp_r, des_r = matcher.detect_and_compute(image_l, image_r)
pts_l, pts_r, good_matches = matcher.find_good_matches(kp_l, des_l, kp_r, des_r)

##
# Estimate the Fundamental Matrix via RANSAC
#
pts_l = np.int32(pts_l)
pts_r = np.int32(pts_r)
F, mask = cv2.findFundamentalMat(pts_l, pts_r, cv2.FM_RANSAC)

##
# Use only the points which RANSAC determined to be model inliers
#
pts_l = pts_l[mask.ravel() == 1]
pts_r = pts_r[mask.ravel() == 1]

##
# Compute epilines. Note that right image points are used for left view
# and left image points are used for right view
#
epilines_l = cv2.computeCorrespondEpilines(pts_r, 2, F).reshape(-1, 3)
epilines_r = cv2.computeCorrespondEpilines(pts_l, 1, F).reshape(-1, 3)

image_epilines_l = draw_epilines(image_l, epilines_l)
image_epilines_r = draw_epilines(image_r, epilines_r)

cv2.imwrite('epi_left.jpg', image_epilines_l)
cv2.imwrite('epi_left.jpg', image_epilines_r)
```

### Results

Take a look at the following resulting images from the above code which show a
general sense of direction of both the camera centers. The _epipoles_
(the point of intersection of the _epilines_) lie outside the visible _image planes_.

|                                                          |                                                           |
| -------------------------------------------------------- | --------------------------------------------------------- |
| ![Left View Epilines (Chair)](//i.imgur.com/1xT4Jfk.jpg) | ![Right View Epilines (Chair)](//i.imgur.com/5nUmCLp.jpg) |
| ![Left View Epilines (Room)](//i.imgur.com/mtCpCMJ.jpg)  | ![Right View Epilines (Room)](//i.imgur.com/35kd5a7.jpg)  |

It goes without saying that the epilines constructed are only as good as the $x \leftrightarrow x^\prime$
point correspondences. The robustness of the point correspondences is dependent on how well
our keypoint detection algorithm works.

[^@hartley2003]: Harltey, A., & Zisserman, A. (2003). Multiple view geometry in computer vision (2. ed.).
