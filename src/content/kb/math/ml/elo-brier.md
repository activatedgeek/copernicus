---
title: Elo Rating and the Brier score
description: Is the Elo update rule related to the Brier score?
date: Feb 17 2025, 18:21 -0400
updated: Mar 28 2025, 12:12 -0400
area: math
---

The Elo rating system is a popular method to measure the relative skill level of players. While originally proposed as an improved rating system for chess, many sports have adapted the Elo to account for game-specific traits - for instance ICC, the governing body for cricket, [adds heuristic accounting](https://en.wikipedia.org/wiki/ICC_Men%27s_Test_Team_Rankings) for draws, weighing recent matches higher, and so on. FIFA, the governing body for world football, also uses a [modified version](https://en.wikipedia.org/wiki/World_Football_Elo_Ratings) of the Elo system to account for importance of matches.

The absolute Elo rating does not mean much and can only be judged in the context of contemporary players.[^elogotcha] Only two things matter when working with Elo ratings - (i) The difference between player ratings, and (ii) The update rule for player's ratings after each game.

[^elogotcha]: Consequently, it is unwise to compare Elo ratings across different generations of players. Depending on the game, it may even be problematic to compare between different formats of the game. For instance, comparing players across Test and ODI cricket is certainly wrong owing to different playing conditions and player's consistency.

Are the Elo update rule and the gradient of Brier score related?

## The Elo Rating System

Elo rating predicts the probability of a win for a player $A$ with rating $R_A$ against a player $B$ with rating $R_B$. In its simplest form, we define this win probability in terms of the rating of $A$ w.r.t. $B$ as,

$$
p(A \mathrm{~beats~} B) = \frac{1}{1 + 10^{- (R_A-R_B) / \kappa}} \triangleq p_A,
$$

where $\kappa$ is a positive parameter that modulates the scale of the rating difference. For instance, if $\kappa = 400$, then a rating difference of $R_A-R_B = 400$ implies an approximately $90\%$ winning chance for player $A$.

This equation is intuitive in the sense that the probability of $A$ beating $B$ increases as the rating difference positively increases, and vice versa. This equation is also familiarly called the [sigmoid function](https://en.wikipedia.org/wiki/Sigmoid_function) whose range is always between $0$ and $1$, and therefore can be interpreted as probabilities. This assumption is based on the Bradley-Terry model.[^bterry]

[^bterry]: See [Is Elo Rating Reliable? A Study Under Model Misspecification](https://arxiv.org/abs/2502.10985) for a recent discussion on its effectiveness.

Now, let $O_A$ be a binary outcome variable that is $1$ if player $A$ wins and zero otherwise. In its simplest form, Elo ratings prescribe the rating to be updated using the rule,

$$
\tag{1} \Delta R_A = - \alpha (p_A - O_A),
$$

where $\alpha$ is a positive parameter that dictates the maximum rating update possible.

Consider the case where $O_A = 1$, i.e. player $A$ wins. The update rule dictates that we must _increase_ the rating of player $A$ by $(1 - p_A) \cdot \alpha$. When $O_A=0$, i.e. if player $A$ loses, we _decrease_ their rating by $p_A \cdot \alpha$. A reasonably intuitive outcome.

Therefore, to roll out our own Elo rating system, we need:

1. An initial rating for each player. Since the absolute values do not mean much, this can be an arbitrary number.
2. The choice of $\kappa$, which intuitively relates the magnitude of differences to win probabilities.
3. The choice of $\alpha$, which is the largest rating change that a player can receive after each game.

Each of these three design decisions involve game-specific heuristics. For instance, $\alpha$ can be increased for players returning after a long injury break to avoid staleness in the ratings. More generally, much of the complexity of devising Elo ratings is about clever heuristics for these parameters.[^trueskill]

[^trueskill]: [TrueSkill](https://www.microsoft.com/en-us/research/publication/trueskill-2-improved-bayesian-skill-rating-system/) extends rating systems for more than two simultaneous players.

## Brier Scores

Brier scores measure the accuracy of probability predictions. In fact, Brier score is a proper scoring rule, such that optimizing for the Brier score would imply learning well-calibrated probabilities. In other words, if a model predicts $80\%$ probability of a win, then we should observe a win $80\%$ of the time in the real world to be well-calibrated. A Brier score of zero corresponds to perfect calibration.

Let $O_A$ represent whether players $A$ wins against player $B$. The error in the forecast of $A$'s win probability $p_A$ is given by the Brier score,

$$
\mathrm{BS}(p_A) = (p_A - O_A)^2.
$$

Put this way, the Brier score is a functional of the win probability $p_A$. To minimize the Brier score, we move in the direction opposite to its functional derivative,

$$
-\nabla_{p_A} \mathrm{BS}(p_A) = -2(p_A - O_A).
$$

This iterative approach is popularly known as [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent).

### The Functional Derivative

More generally, each step of gradient descent involves a _learning rate_ $\alpha$, such that the update rule for the probability of win functional is,

$$
\tag{2} \Delta p_A = - \alpha \nabla_{p_A} \mathrm{BS}(p_A) = - \alpha (p_A - O_A)
$$

where we absorb the constant factor $2$ into $\alpha$ for convenience.

Now, consider $O_A = 1$, then we _increase_ the probability of win by $(1-p_A)\cdot\alpha$. With $O_A = 0$, we _decrease_ the probability of win by $p_A\cdot\alpha$.

## Is there an equivalence?

On the surface, equations $(1)$ and $(2)$ above look exactly the same up to a constant term $\alpha$. However, for quite obvious reasons, these equations are not update rules for the same quantities - equation $(1)$ is an update rule of the _rating_, whereas equation $(2)$ is an update rule for the _probability_ (functional) of winning.

Nevertheless, are these similar-looking equations merely a coincidence or there is more thought behind the rating update rule? Thinking out loud,

- Could we draw an equivalence if the ratings are considered to be constrained to be probabilities?
- Can the learning rate $\alpha$ be reinterpreted as the maximum rating update possible after any game?
- Proponents of the Elo score often tout that the win probabilities are well-calibrated, and I have seen calibrated is often reported in these circles using the Brier score. Could this functional equivalence be reinterpreted to explain improved calibration?

May be, or may be not. I need to think more.
