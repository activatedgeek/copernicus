---
title: Markdown Reference
description: A test page for the MDX processor.
area: meta
date: May 6 2021, 13:33 +0530
updated: Apr 14 2024, 2:19 -0400
---

This is a reference page to see all Markdown elements and styling rendered. All headings have an attached anchor link.

!> :information_source: See [The Stack](/kb/the-stack) for all tools powering this website.

## Text Formatting

<details>
<summary>Code</summary>

```md
## Text Formatting

This is a paragraph. **Bold**, _italics_, ~~strikethrough~~, and [links](#text-formatting) as usual.

A blockquote is below.

> Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus.

Footnotes can be defined too [^a].

[^a]: This is a footnote.

Emojis are supported :heart:.

Images are rendered with `figure` and `figcaption`.

![Caption is the alt text.](https://octodex.github.com/images/minion.png)
```

</details>

This is a paragraph. **Bold**, _italics_, ~~strikethrough~~, and [links](#text-formatting) as usual.[^comments]

[^comments]: Comments should lazily load below.

A blockquote is below.

> Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus.

Footnotes can be defined too [^a].

[^a]: This is a footnote.

Emojis are supported :heart:.

Images are rendered with `figure` and `figcaption`.

![Caption is the alt text.](https://octodex.github.com/images/minion.png)

### Hints

<details>
<summary>Code</summary>

```md
!> :white_check_mark: This is a note. $\KaTeX$ works too.
?> :warning: This is a warning.
x> :x: This is an error.
```

</details>

!> :white_check_mark: This is a note. $\KaTeX$ works too.

?> :warning: This is a warning.

x> :x: This is an error.

### Lists

#### Unordered

<details>
<summary>Code</summary>

```md
### Unordered

- Lorem ipsum dolor sit amet
- Nulla volutpat aliquam velit
  - Phasellus iaculis neque
  - Purus sodales ultricies
```

</details>

- Lorem ipsum dolor sit amet
- Nulla volutpat aliquam velit
  - Phasellus iaculis neque
  - Purus sodales ultricies

#### Ordered

<details>
<summary>Code</summary>

```md
### Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
```

</details>

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

### Tables

<details>
<summary>Code</summary>

```md
| Left Aligned Option |                        Center Aligned Description                         |
| :------------------ | :-----------------------------------------------------------------------: |
| data                | path to data files to supply the data that will be passed into templates. |
| engine              |  engine to be used for processing templates. Handlebars is the default.   |
| ext                 |                   extension to be used for dest files.                    |
```

</details>

| Left Aligned Option |                        Center Aligned Description                         |
| :------------------ | :-----------------------------------------------------------------------: |
| data                | path to data files to supply the data that will be passed into templates. |
| engine              |  engine to be used for processing templates. Handlebars is the default.   |
| ext                 |                   extension to be used for dest files.                    |

### Code Highlighting

<details>
<summary>Code</summary>

````md
Inline code looks like `<p>Inline</p>`.

\```js
console.log('Hello World');
\```
````

</details>

Inline code looks like `<p>Inline</p>`.

```js
console.log("Hello World");
```

### Math via KaTeX

<details>
<summary>Code</summary>

```md
$$
\tag{1} p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D}\mid \theta)p(\theta)}{p(\mathcal{D})}
$$
```

</details>

Block equations are supported via $\KaTeX$.

$$
\tag{1} p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D}\mid \theta)p(\theta)}{p(\mathcal{D})}
$$
