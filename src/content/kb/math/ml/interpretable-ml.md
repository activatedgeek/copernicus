---
title: Raw notes on Interpretable Machine Learning
description: Raw notes on the utility of interpretability from an internal debate.
date: Oct 21 2021, 15:00 -0400
updated: May 27 2023, 15:40 -0400
area: math
---

?> :warning: These are raw notes from an old internal debate on the utility of interpretability. If some thoughts are outdated (or wrong), please reach out.

Consider my credit score. It is apparently quite a big deal in getting access to resources like credit, apartments, loans, fee waivers, etc. For over a year, my score was terribly low, and without precise reasons, I'd have been frustrated customer. In the big picture of science too, often our real goal is to find causal associations. Interpretability then is the "informative" bridge between correlative judgements from a machine learning model and the causal associations.

Part of the "charm" of interpretability comes from the fact that an average human takes touts to being able to justify decisions post-hoc. It is the urge to manage social interactions that we seek interpretability[^@Miller2017ExplanationIA]. To really argue for an interpretable machine, it is imperative to clarify, (i) when do we care about interpretability, and (ii) what it really means to be interpretable.

[^@Miller2017ExplanationIA]: Tim Miller. “Explanation in Artificial Intelligence: Insights from the Social Sciences.” *Artif. Intell.* 267 (2017): 1-38. https://arxiv.org/abs/1706.07269

> _Interpretability serves those (high-stakes) objectives that we deem important but struggle to model formally_.[^@Lipton2016TheMO]

[^@Lipton2016TheMO]: Lipton, Zachary Chase. “The Mythos of Model Interpretability.” *Queue* 16 (2016): 31 - 57. https://dl.acm.org/doi/10.1145/3236386.3241340

Examples of such objectives are safety, fairness, ethics, legality, reliability, robustness, trust, etc. It remains almost impossible to quantify such notions that vary in meaning from an individual to a group level. Decisions that have consequences on society demand accountability. We may not be always able to enumerate all possible scenarios (e.g. autonomous driving cars), and need a fallback. Interpretability is that fallback.

[Nosedive](<https://en.wikipedia.org/wiki/Nosedive_(Black_Mirror)>), a Black Mirror episode, is a dark take on a world where socioeconomic status is decided by ratings. Lacie Pounds, the protagonist, wants to raise her rating. Because there was an _explainable_ mechanism behind the ratings, just enough to translate into actionable advice.

There are at least four entities whose interpretability we could discuss:[^@Kearns2021TheEA] the data, the algorithm, the model found by the algorithm, and the decisions made by the model.

[^@Kearns2021TheEA]: Kearns, Michael and Aaron Roth. “The Ethical Algorithm: The Science of Socially Aware Algorithm Design.” *Perspectives on Science and Christian Faith* (2021) https://www.cis.upenn.edu/~mkearns/

Interpretability for humans is often post-hoc "descriptions" by example. But with machines, we have a chance to have a broader definition - in terms of simulatability, decomposability, and algorithmic transparency.

Recent exposition on _Foundation Models_[^@Bommasani2021OnTO] heightens the need for interpretability. Interpretability does not remain limited to understand the internals of a model, but also understanding its capabilities. With wider penetration into application domains, it will be critical to understand the mechanisms behind the building blocks of decision making via such models.

[^@Bommasani2021OnTO]: Bommasani, Rishi et al. “On the Opportunities and Risks of Foundation Models.” *ArXiv* abs/2108.07258 (2021). https://arxiv.org/abs/2108.07258

In a world where [Codex](https://openai.com/blog/openai-codex/) starts writing a significant chunk of the code, we are legally on shaky grounds when it comes to accountability. Interpretability again will become the fallback tool to make legal assessments. Indeed, post-hoc interpretations run the risk of being faulty too, but at least having a human-in-the-loop can mitigate obvious risks. Who holds the moral agency of algorithmic misgivings?

Interpretability will be the bridge between researchers and regulatory agencies. If we as a community are to be smart at all about getting through legislation and make continue building on the success of ML so far, this is going to be an important step. Explainability is now even a legal requirement in the EU.

The grand goal of machine learning, and AI in general will always be abstraction and reasoning [^@araineurips2020]. Existing machine learning systems are just not designed to do that at all. Interpretability research is probably again the proxy we employ to understand what existing systems are capable of reasoning about.

> _Suppose you have cancer and you have to choose between a black box AI surgeon that cannot explain how it works but has a 90% cure rate and a human surgeon with an 80% cure rate. Do you want the AI surgeon to be illegal?_ - [Geoffrey Hinton](https://twitter.com/geoffreyhinton/status/1230592238490615816)

On the face of it, this tweet is careless. It leaves out a lot of details and nuance, but this is precisely why this was polarizing. [The Great AI Debate at NIPS 2017](https://youtu.be/93Xv8vJ2acI) debated a similar premise.

See also: [Trustworthy ML - Resources](https://www.trustworthyml.org/resources).

[^@araineurips2020]: [Abstraction & Reasoning in AI systems: Modern Perspectives](https://nips.cc/virtual/2020/public/tutorial_877466ffd21fe26dd1b3366330b7b560.html)
