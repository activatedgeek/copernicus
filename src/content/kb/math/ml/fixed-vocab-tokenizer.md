---
title: Preset Vocabulary Tokenizers in HuggingFace Transformers
description: Using the HuggingFace Transformers library to build tokenizers for a predefined vocabulary.
date: Dec 2 2024, 16:31 -0400
area: math
---

The first step in training a large language model (LLM) is to construct a tokenizer, which decomposes text into fixed discrete units of computation called _tokens_.
Most performant tokenizers for natural language today are not hand-designed but rather learned from data.

Unlike natural language, one might still prefer a tokenizer based on hand-designed vocabulary to account for expert knowledge. For instance, the "language" of genetic code consists only of 22 [$\alpha$-amino acids](https://en.wikipedia.org/wiki/Proteinogenic_amino_acid) for all known life.

In this post, we will build a tokenizer for a pre-defined set of characters as the vocabulary using the machinery of [HuggingFace Transformers](https://huggingface.co/docs/transformers).

## Primer on Tokenizers

Any text processing system requires the text to be decomposed into fixed units of computation called _tokens_. More generally, any data represented as a sequence is often represented as a sequence of tokens to allow computation.
For instance, the title of this post can be decomposed into six words split at the space character - `Preset`, `Vocabulary`, `Tokenizers`, `in`, `HuggingFace`, and `Transformers`.

Tokenizers require a fixed vocabulary,[^fixedvocab] but it is practically impossible to avoid the occurrence of unseen words in the wild.
To work around this limitation, tokenizers are instead built using sub-word splitting that may not necessarily be words from the English (or any other) dictionary, leading to the abstract notion of _tokens_.
Modern LLMs (like [Llama](https://www.llama.com)) always come bundled with tokenizers trained on a massive text corpus where the text is split based on character co-occurence statistics.[^tokenizers]

[^fixedvocab]: Moving beyond fixed tokenization schemes remains an open research problem.

[^tokenizers]: [SentencePiece](https://github.com/google/sentencepiece) is a popular library that implements methods like Byte-Pair Encoding (BPE) inspired by text compression algorithms.

In this post, instead of learning the vocabulary of tokens from data, we manually specify a fixed vocabulary and see how to implement such a tokenizer.

## Working Example: Path-Star Graphs

Let's use the toy example from the paper [Pitfalls of Next-Token Prediction](https://arxiv.org/abs/2403.06963).
We want to represent the task of path-finding in a directed tree as a sequence of tokens.
Each graph has a single start node with multiple emerging paths, one of which is a unique path to a goal node.
Each node is assigned a unique number at random.
We name these _Path-Star Graphs_.

![In this Path-Star Graph, a start node `4` has three emerging paths, with a unique path to the goal node `7`.](https://i.imgur.com/raFZ9Uc.png)

This graph is represented as a randomized list of directed edges `2,7|4,1|4,3|1,9|3,5|4,2`,[^figtypo] coded as `<from,to>` and separated by `|`.
The objective from start to goal is defined as `<start,goal>` separated by `/`, and ending with a `=` indicating the start of solution.

[^figtypo]: The figure has an erroneous `|` character at the end of edge list. The usage, however, uses the correct representation.

The tokens can therefore just be all the numerical labels of the nodes, and three additional characters `|`, `/`, and `=`. The `,` character is used merely for tokenization, i.e. splitting the sequence into tokens.

It would be imprudent to train a tokenizer for such a task where we already have a precise specification for represention as a sequence of tokens.

## Custom Tokenizer for Path-Star Graphs

Given the popularity of [HuggingFace Transformers](https://huggingface.co/docs/transformers) for using LLMs, I will show how to implement the [`PretrainedTokenizer`](https://huggingface.co/docs/transformers/v4.46.3/en/main_classes/tokenizer#transformers.PreTrainedTokenizer) interface to build a custom tokenizer compatible with the HuggingFace ecosystem.

As a simple thumb rule, all we need is to implement the methods from the base class definition that raise an exception.

```python
from typing import List


class PreTrainedTokenizer(PreTrainedTokenizerBase):
    ...

    @property
    def vocab_size(self) -> int:
        raise NotImplementedError

    def _tokenize(self, text, **kwargs) -> List[int]:
        raise NotImplementedError

    def _convert_token_to_id(self, token: str) -> int:
        raise NotImplementedError

    def _convert_id_to_token(self, index: int) -> str:
        raise NotImplementedError

    def get_vocab(self) -> Dict[str, int]:
        raise NotImplementedError

    ...
```

Here is the complete implementation of this interface as the `PathStarTokenizer` class,

```python
from transformers import PreTrainedTokenizer


class PathStarTokenizer(PreTrainedTokenizer):
    def __init__(self, N, padding_side="left"):
        self._token_ids = {
            **{f"{i}": i for i in range(N)},
            "|": N,
            "=": N + 1,
            "/": N + 2,
        }

        self._id_tokens = {v: k for k, v in self._token_ids.items()}

        super().__init__(padding_side=padding_side)

        self.add_special_tokens({"pad_token": "[PAD]", "unk_token": "[UNK]"})

    @property
    def vocab_size(self) -> int:
        return len(self._token_ids)

    def _tokenize(self, text: str, **kwargs):
        splits = text.split("=")
        graph, goal = splits[0].split("/")
        graph = [v.split(",") for v in graph.split("|")]

        tok_text = []
        for i, v in enumerate(graph):
            tok_text += v
            if i < len(graph) - 1:
                tok_text += ["|"]

        tok_text += ["/"] + goal.split(",")

        if len(splits) == 2:
            tok_text += ["="]
            if splits[1]:
                tok_text += splits[1].split(",")

        return tok_text

    def _convert_token_to_id(self, token: str) -> int:
        return self._token_ids[token] if token in self._token_ids else self.unk_token_id

    def _convert_id_to_token(self, index: int) -> str:
        return self._id_tokens[index] if index in self._id_tokens else self.unk_token

    def get_vocab(self):
        return self._token_ids
```

The most important method here is the `_tokenize`, which contains the core logic to parse an input string into tokens.
As noted earlier, we use the `,` character only for parsing the directed edges and rest of the logic is fairly straightforward.
A few details in the constructor need to be highlighted,

- I recommend addition a special padding token (here `[PAD]`), so that tokenization of multiple strings of uneven lengths can be padded.
- I prefer using left padding, especially for decoder-only models so that constructing attention masks is easier.
- As a fail safe, adding a special unknown token (here `[UNK]`) avoids the tokenizer from crashing. For our Path-Star graph, however, this token should end up never being used as long as the graph strings are well specified.

All other methods are trivial bookkeeping and self-explanatory, allowing us to use the exisiting machinery implemented by the HuggingFace tokenizers library.

### Usage

We are now ready to use this class for tokenization in the same style as any tokenizer one would use from the [HuggingFace Hub](https://huggingface.co/docs/transformers/v4.46.3/en/main_classes/tokenizer#tokenizer).

```python
tokenizer = PathStarTokenizer(50)

inputs = [
    "2,7|4,1|4,3|1,9|3,5|4,2/4,7=", ## Example graph from figure.
    "31,41|31,15/31,15=31,15"
]

tokenized_inputs = tokenizer(inputs, padding=True)

print(tokenized_inputs["input_ids"])
```

Note that the two input strings are of unequal length, and therefore should be left-padded (with token `53`) from our class definition. The tokenized output is,

```json
[
  [2, 7, 50, 4, 1, 50, 4, 3, 50, 1, 9, 50, 3, 5, 50, 4, 2, 52, 4, 7, 51],
  [
    53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 31, 41, 50, 31, 15, 52, 31, 15, 51,
    31, 15
  ]
]
```

Implementing preset vocabulary tokenizers with HuggingFace compatibility turned out to be fairly easy. Tokenize away!
