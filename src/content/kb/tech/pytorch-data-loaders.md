---
title: PyTorch Data Loaders are abstraction done right!
description: A quick introduction to writing your first data loader in PyTorch
date: Nov 25 2017, 1:59 -0400
area: tech
redirectsFrom:
  - /blog/ml/pytorch-data-loaders
---

_PyTorch_ is great fun. Seriously! It has only been a few weeks that I started
working with it. It already is the least painful thing in the process, which,
is kind of the point of having such a library.

The first task that any Machine Learning engineer would struggle with is
to load and handle data. _PyTorch_ provides an excellent abstraction
in the form of [`torch.util.data.Dataset`](https://pytorch.org/docs/master/data.html#torch.utils.data.Dataset).
Such dataset classes are handy as they allow treating the dataset as just another iterator (almost) object.
This pattern allows us to build a variety of transforms on top a custom base class (e.g. resizing images
in an image dataset) staying true to the "separation of concerns" principle.
It is always a pleasure to experience such powerful abstractions which are very
simple at the core.

This article will first show how dataset classes are used and then illustrate how to
build a custom dataset class using some dummy data.

## Example

The [`pytorch/vision`](https://github.com/pytorch/vision) repository hosts a handful of
common datasets. One of the most popular one being the _MNIST_ dataset.

```python
from torchvision.datasets import MNIST

data_train = MNIST('~/pytorch_data', train=True, download=True)
```

This one line is all you need to have the data processed and setup for you. Under the hood,
it downloads the byte files, decodes and converts them into a readable format. It also handles
the case when the dataset has already been downloaded and processed. It cleanly abstracts out
all the pestering details. This object can now be accessed using standard indexes.

```python
print(data_train[0])
```

But that is not all. Most of the time you wouldn't really be accessing such indices but actually
sending in the matrices to your model. _PyTorch_ provides another wrapper interface called the
[`torch.utils.data.DataLoader`](https://pytorch.org/docs/master/data.html#torch.utils.data.DataLoader).
This comes in handy when you need to prepare data batches (and perhaps shuffle them before every run).

```python
from torch.utils.data import DataLoader

data_train_loader = DataLoader(data_train, batch_size=64, shuffle=True)

for batch_idx, samples in enumerate(data_train_loader):
    # samples will be a 64 x D dimensional tensor
    # feed it to your neural network model
    net(samples)
```

For those interested in a real working example, I use a
similar loader to train _LeNet-5_. The full source is available at
[`activatedgeek/LeNet-5/run.py`](https://github.com/activatedgeek/LeNet-5/blob/master/run.py#L24).

The ones familiar with a standard batch machine learning pipeline should be able to
relate to this and understand how terrifically simple this abstraction has made the whole
process. For others, I would recommend working on your data manually and see how
unassumingly messy this process can become and eat away precious time.

While, most of the times, one will be working on non-standard datasets and would
require custom processing to get things done. We will next look at how to design our
own data loader. At its core, it is nothing more than utilizing the Python magic methods
as we will see. Spending a few hours doing this abstraction now would save many later.

### A Custom Dataset Loader

Let us take a look at the actual implementation of the `Dataset` interface. See [here](https://github.com/pytorch/pytorch/blob/master/torch/utils/data/dataset.py#L5) for
full context.

```python
class Dataset(object):
    def __getitem__(self, index):
        raise NotImplementedError

    def __len__(self):
        raise NotImplementedError
```

Told you, this is not at all complex (and why should it be?). This is the necessary and sufficient
interace that we must implement to get the nice abstraction (a nice syntactic sugar to say the least)
above. Let us call our dataset `MyDataset` and its purpose is to return squares of values in range `[a,b]`.

```python

class MyDataset(Dataset):
    """
    This dataset contains a list of numbers in the range [a,b] inclusive
    """
    def __init__(self, a=0, b=1):
        super(MyDataset, self).__init__()

        assert a <= b

        self.a = a
        self.b = b

    def __len__(self):
        return self.b - self.a + 1

    def __getitem__(self, index):
        assert self.a <= index <= self.b

        return index, index**2

```

You could now use this along with a DataLoader class as

```python
data_train = MyDataset(a=1,b=128)
data_train_loader = DataLoader(data_train, batch_size=64, shuffle=True)
print(len(data_train)) # 128
```

and this would work right away! Notice the use of assertions to ensure some
basic sanity checks. But now, let us say I wanted to return the values powered
to 8 and also retain all the goodness of `MyDataset`. All I need is to extend it
further and build a derived class.

```python
class MyDatasetDerived(MyDataset):

    def __init__(self, a=0, b=1):
        super(MyDatasetDerived, self).__init__(a, b)

    def __getitem__(self, index):
        index, value = super(MyDatasetDerived, self).__getitem__(index)
        return index, value**4
```

I know, I know, that dataset means nothing. But in essence, this is all there is to
writing data loaders in _PyTorch_. It just exploits the goodness of Python combined
with your own object-oriented programming skills. While a good exercise would be to
go through a variety of data loaders for a number of popular datasets like `ImageNet`
and `CIFAR-10/100`,

### A Model Dataset Class

I would like to present the following rules of thumb while designing your next data
loader in the form of a following commented template. It consists of some basic rules
of thumb I observed to be helpful allowing maximum flexibility with playing with data.

```python
class MyIdealDataset(Dataset):

    def __init__(self, *args):
        super(MyIdealDataset, self).__init__()

        """
        1. Store all meaningful arguments to the constructor here for debugging.
        2. Do most of the heavy-lifting like downloading the dataset, checking for consistency of already existing dataset etc. here
        3. Aspire to store just the sufficient number of variables for usage in other member methods. Keeps the memory footprint low.
        4. For any further derived classes, this is the place to apply any pre-computed transforms over the sufficient variables (e.g. building a paired dataset from a dataset of singleton images)
        """

    def __len__(self):
        """
        This function gets called with len()

        1. The length should be a deterministic function of some instance variables and should be a non-ambiguous representation of the total sample count. This gets tricky especially when certain samples are randomly generated, be careful
        2. This method should be O(1) and contain no heavy-lifting. Ideally, just return a pre-computed variable during the constructor call.
        3. Make sure to override this method in further derived classes to avoid unexpected samplings.
        """

    def __getitem__(self, index):
        """
        1. Make appropriate assertions on the "index" argument. Python allows slices as well, so it is important to be clear of what arguments to support. Just supporting integer indices works well most of the times.
        2. This is the place to load large data on-demand. DONOT ever load all data in the constructor as that unnecessarily bloats memory.
        3. This method should be as fast as possible and should only be using certain pre-computed values. e.g. When loading images, the path directory should be handled during the constructor and this method should only load the file into memory and apply relevant transforms.
        4. Whenever lazy loading is possible, this is the place to be. e.g. Loading images only when called should be here. Keeps the memory footprint low.
        5. Subsequently, this also becomes the place for any input transforms (like resizing, cropping, conversion to tensor and so on)
        """
```

## Conclusion

Writing a `DataLoader` was so easy that I already submitted a PR to add the `Omniglot` dataset to the repository of
Vision datasets under _PyTorch_ during my first day of working with it. You can check the
[PR#373](https://github.com/pytorch/vision/pull/323) for a more realistic example of writing DataLoaders from scratch.

Overall, the takeaway here is that "separation of concerns" goes a long way. Build the dataset from its unit item
and derive custom transformation classes from this base dataset. This rather amazingly helps in fast
experimentation with the data.
