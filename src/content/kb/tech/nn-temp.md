---
title: The absolute zero of neural networks
description: Lessons of optimism from the history of measuring temperature
date: Feb 24 2021, 17:12 +0530
area: tech
---

I'm writing this at the end of a significant decade of advances in deep
neural networks (NNs). NNs have convincingly blown every other machine learning
model out of the water, and for good reason. The community has now arrived at
a juncture where different theories are being floated to explain the
unreasonable effectiveness of neural networks. For now, however, an understanding of the
fundamental unit of computation in neural networks alludes us. All we have is
probe studies observing pathologies, and many researchers investigating them. We
as a community, are an untidy congregation of incomplete ideas. This is good chaos.
This is the sort of community where breakthroughs have outsized impact.

While reading [Measurement: A Very Short Introduction](https://www.librarything.com/work/19217884/book/196759822), I came across the history of how temperature measurements
evolved. Temperature, unlike directly measurable quantities like counts or length,
is something that we only feel. It may then not come as a surprise that some
of the early thermometers were called as _thermoscopes_ by W. E. Knowles Middleton,
because instead of precise _interval_ scales, they only worked at an _ordinal_ scale,
i.e. only a qualitative measurement of the _degree of hotness_.

While our usual measurements enjoyed the luxury of simple algebra, combining two
copies of an object with the same temperature does not simply double the
temperature. Similarly, putting two objects of different temperature together
gives us an intermediate temperature. The researchers of the time must surely
have been baffled. The phenomenon had exposed a missing piece in our fundamental
understanding of the physical sciences: the nature of energy.

The historical starting point to establish numerical scales for temperature
started with first figuring out fixed points, and a surprisingly very many have
been proposed -- freezing/boiling point of water, melting point of wax, temperature
of burning soft coal, or even the temperature of human body. Calling these scales
_fixed_ is troublesome because matter exhibits different properties at different
temperatures. The more recent mercury column-based thermometers rely on the
assumption that equal changes in temperature lead to equal changes in the magnitude
of our physical quantity (length of the mercury column). This assumption in
general in unfounded as well. Further, extrapolating beyond the defined fixed
points needs the definition of new fixed points, and we are back to square one.
A common theme here is that the list of temperature-dependent phenomenon kept
growing, and subsequent developments of pyrometric measurements also were
virtually endless.

This pragmatic arbitrariness naturally hints towards something more fundamental
in temperature measurement. It was observed that the pressure of a fixed
volume of gas decreases as the temperature is lowered. Therefore, there must
be a minimum possible temperature - an _absolute zero_. Our formal understanding
was eventually strengthened, starting with the conceptual tool of _ideal gases_
to help bridge the gap between pressure, kinetic energy, and thermodynamic temperature. We ended up with the _Kelvin_ scale which is now the SI unit of temperature. The important lesson here is that pragmatic tools of temperature measurement kept evolving throughout
this _good chaos_ of new measurement mechansisms being proposed all over.

Neural networks research is going through this _good chaos_ as of this writing.
We do not understand the fundamental unit of expression in a neural network.
While we have a few inspired mechansisms to understand them, we are far from
understanding what is really happening. Does this make neural networks bad?
Of course not. Any method probing neural networks is a good method, as long as
it is reasonably well-founded, until of course something else succeeds its utility.
As I'd put it,

> neural networks research is on a long journey to find its absolute zero.
