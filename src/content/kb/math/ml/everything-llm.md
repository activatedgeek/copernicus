---
title: Everything LLMs
description: Notes on working with Large Language Models.
date: Mar 12 2024, 19:56 -0400
updated: Apr 8 2024, 23:07 -0400
area: math
---

## Papers

- [Attention](https://arxiv.org/abs/1706.03762) operation - local context alignment
  - Cross-attention in the original decoder architecture had two blocks - first a self-attention block and then a cross-attention block where K,V come from input sequence, and Q from the output sequence.
  - Original transformer used dropout after each attention layer before the normalization, and also label smoothing for training.
  - Scaling by $\sqrt(d_k)$ since the variance of the dot product grows as $d_k$
- Positional encoding because the attention operation is a set operation
  - Sinusoidal embeddings use frequencies $2\pi$ to $20000\pi$,
  - Relative positional encoding adds a vector at each layer to the projected K/V embeddings $a_{ij} = w_{j-i}$, for a window of $2k + 1$, i.e. $k$ on both sides of the token. Beyond the window, we clip.
  - Rotary Positional Embedding is simply rotating the affine-transformed word embedding vector by amount of angle multiples of its position index, instead of adding to the vector
- [GPT](https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf)
  - Original GPT model used language modeling objective with a decoder-only model, with the embedding weights tied at the final linear layer.
  - A second stage was used for task-specific tuning, with both the language modeling objective and regularized by the actual prediction task. Delimiter tokens are also tokens.
  - GELU was used for activations and positional embeddings were learned.
- [GPT-2](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
  - Use the Layer normalization at the inputs instead of outputs.
  - It shows good zero-shot performance, and no need for task-specific finetuning.
- [T5](https://arxiv.org/abs/1910.10683) takes the approach of treating every problem as a text-to-text problem.
  - LayerNorm does not apply to bias term.
  - Position embeddings are simply a scalar addition to the corresponding logit used for attention, and shared across all layers, clipped until a logarithmic series up to 128.
  - Heavily curated Common Crawl dataset.
  - Span corruption is used as the key objective, where corrupted tokens are replaced by sentinel tokens in the input (multiple tokens also replaced with a single one), and the outputs are delimited by sentinel tokens.
  - Encoder-decoder models with the denoising objective generally tends to get the best performance out. But difference in details of the denoising objective don't quite seem to matter much.

* [UL2](https://arxiv.org/abs/2205.05131) proposes Mixture-of-Denoisers (MoD)
  - The conjecture is that distinguishing between different denoising tasks is beneficial for general learning. In addition, mode-switching via sentinel tokens for different downstream tasks is enabled.
  - The denoiser modes - Regular Denoiser (like T5), Sequential Denoiser (like causal LMs), and Extreme Denoiser
  - An additional paradigm token is used for mode-switching between the three denoisers.
  - Model is similar to T5.
* Encoder-only, Decoder-only, and Encoder-Decoder Models
  - There seems no reason to use encoder-only models alone. The cumbersomeness of task-specific classification heads on top of BERT-style encoder-only models makes them less appealing. Their generation capabilities are also limited.
  - Encoder-decoder models use separate parameters for inputs and targets, which interact only via cross-attention. Overall, the inductive biases of prefix LM decoder-only architectures may turn out to be similar to encoder-decoder architectures.
  - UL2 recommends that encoder-decoder architectures are generally preferable if storage is a concern. But in general, the self-supervision objective seems the more important choice.
* [Lost in the Middle](https://arxiv.org/abs/2307.03172)
  - Position of relevant information in the context significantly affects performance, with best when information is at the beginning or the end of the context.
  - Encoder-decoder models are relatively robust when information is within the training length.
  - Extended context models don't necessarily improve retrieval performance in terms of using the input context.
  - The Attention Sinks observation seems in line with this paper.
* [RoPE](https://arxiv.org/abs/2104.09864)
  - RoPE proposes to incorporate the relative position information by multiplying with the sinusoidal functions, instead of adding.
  - We are looking for a function that only depends on only the relative position between source tokens and target tokens.
  - Due to rotations, does not change the norm, and the choice of the dimension-dependent rotation leads to decaying behavior.
* [Llama](https://arxiv.org/abs/2302.13971)
  - Use a mixture of diverse datasets, include C4 used in T5.
  - Applies normalization (RMSNorm) at the input of each layer instead of output.
  - Uses SwiGLU activation instead of ReLU.

## Resources

[Common LLM Settings](https://docs.google.com/spreadsheets/d/14vbBbuRMEHoqeuMHkTfw3uiZVmyXNuoSp8s-aHvfvZk/htmlview#)

[Generating Text from Language Models](https://rycolab.io/classes/acl-2023-tutorial/) (ACL 2023 Tutorial)

[How to make LLMs go fast](https://vgel.me/posts/faster-inference/)
