---
title: Numerical code snippets
date: Jul 5 2020, 15:25 -0700
updated: Apr 7 2021, 16:06 +0530
area: tech
redirectsFrom:
  - /kb/pytorch-code-snippets
---

## CUDA Specific Builds

### PyTorch

To install specific CUDA version builds for PyTorch, use

```shell
pip uninstall -y torch
pip install --no-cache-dir torch -f https://download.pytorch.org/whl/cu101/torch_stable.html
```

`cu101` corresponds to CUDA 10.1, and needs to be changed appropriately. Test for GPU
with

```python
import torch
print(torch.cuda.is_available())
```

### JAX

Similarly, for JAX:

```shell
pip uninstall -y jaxlib
pip install --no-cache-dir jaxlib==0.1.64+cuda111 -f https://storage.googleapis.com/jax-releases/jax_releases.html
```

Test for GPU with,

````python
```python
from jax.lib import xla_bridge
print(xla_bridge.get_backend().platform)
````

### TF

For TensorFlow, verify the CUDA-packaged wheels [here](https://www.tensorflow.org/install/source#gpu)
and install the appropriate version.

Test for GPU devices with,

```python
import tensorflow as tf
print(tf.config.list_physical_devices('XLA_GPU'))  ## or 'GPU'
```

## Jupyter Lab widgets

If widgets like [tqdm progress bars](https://tqdm.github.io) are not working
in Jupyter Lab, run the following once in every new environment containing Jupyter.

```bash
$ pip install ipywidgets
$ jupyter nbextension enable --py widgetsnbextension
$ jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

After searching innumerable times, I finally have it handy. This was originally
discussed in [Issue #394](https://github.com/tqdm/tqdm/issues/394) on Github.

## Vectorized Pairwise Distances

For $\mathbf{X} \in \mathbb{R}^{... \times m \times d}, \mathbf{Y} \in \mathbb{R}^{... \times n \times d}$, the pairwise distance matrix between each pair of these batched matrices is $\mathbf{D} \in \mathbb{R}^{... \times m \times n}$, where ... represent arbitrary batch dimension (think batches of pairs of $m$ and $n$ samples of dimension $d$).

```python
## in PyTorch
def pairwise_dist(x, y):
    xx = (x * x).sum(dim=-1).unsqueeze(-1)
    yy = (y * y).sum(dim=-1).unsqueeze(-2)
    xy = torch.einsum('...ji,...ki->...jk', x, y)
    d = xx + yy - 2. * xy
    return d
```
