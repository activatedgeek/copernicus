---
title: LaTeX code snippets
date: Jul 05 2020, 15:26 -0700
updated: Jul 1 2021, 18:50 +0530
area: tech
---

[LearnLaTeX](https://www.learnlatex.org/en/) has some high quality tutorials,
resources, and more interestingly, a nice online compiler!

!> :information_source: Also see my [leaf.sty](https://github.com/activatedgeek/latexfiles) package for useful configurations.

## General

### LaTeX via Images

This is the last thing one should use since images aren't accessible, and terrible to manipulate. Many platforms, however, do not leave a choice (e.g. Github Markdown). As a stop-gap, use [CodeCogs Equation Editor](https://editor.codecogs.com) [^a] to generate SVGs of equations. Here's the Bayes' rule,

![Bayes' Rule](<https://latex.codecogs.com/svg.latex?p(x&space;\mid&space;y)&space;=&space;\frac{p(y\mid&space;x)p(x)}{p(y)}>)

generated through the URL,

```tex
https://latex.codecogs.com/svg.latex?p(x&space;\mid&space;y)&space;=&space;\frac{p(y\mid&space;x)p(x)}{p(y)}
```

[^a]: The range of LaTeX math grammar this supports is unclear.

### Package Conflicts

Often, packages may be loaded transitively and conflict with a previous declaration.
To avoid such scenarios, pre-emptively send in package options.

```tex
% {<options>}{<package_name>}
\PassOptionsToPackage{pdftex}{graphicx}
```

A good place is in the preamble right before any other package imports. In this
case, any subsequent import of the `graphicx` package can be done as

```tex
\usepackage{graphicx}
```

which will implicitly also pass the desired option. This is helpful when another
package wants to load `graphicx` with different options. Effectively, this
command will append to the options list. This may not always be the best solution
but should work for most cases.

### Localize Settings

Just wrap everything inside

```tex
\begingroup
...
\endgroup
```

or

```tex
\bgroup
...
\egroup
```

### Wrapping Figure Around Text

```tex
% "r" for right, "l" for left
\begin{wrapfigure}{r}{0.5\textwidth}
...
\end{wrapfigure}
```

### Clean up References

Use [rebiber](https://github.com/yuchenlin/rebiber). An example command:

```shell
rebiber -i references.bib -r pages,editor,volume,month,url,biburl,address,publisher,bibsource,timestamp,doi
```

## Equations

### Avoid Inline Splitting

This is often helpful in two-column formats where the inline math can split over
multiple lines. To the reader, that looks ugly and distracting. The solution is
to simply wrap the equation with curly braces `{}`.

```tex
This inline equation ${a^2 + b^2 = c^2}$ will not split over multiple lines.
```

### Split Long Equations

Inside `align` environments, use `split`. `{}&` for alignment and the usual new line `\\` for split points.

```tex
\begin{align}
a = b + c \\
\begin{split}
z^2 = {}&x^2 + \\{}&y^2
\end{split} \\
...
\end{align}
```

## Tables

### Fit Oversized Table

To make a table fit automatically across the width, use

```tex
\begin{adjustbox}{width=\linewidth}
\begin{tabular}

\end{tabular}
\end{adjustbox}
```

In fact, this may just work for anything.

### Wrap Text

```tex
\begin{tabular}{l|l}
Cell & \parbox{.5\linewidth}{This is a very long text that will wrap}
\end{tabular}
```

### Column Spacing

```tex
\setlength{\tabcolsep}{1pt}
```

### Table Merge Columns

```tex
% <column size> (2), <type> (c), <content>
\multicolumn{2}{c}{...content...}
```
