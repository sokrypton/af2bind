# AF2BIND: Prediction of ligand-binding sites using AlphaFold2
Predicting ligand-binding sites, particularly in the absence of previously resolved homologous structures, presents a significant challenge in structural biology. Here, we leverage the internal pairwise representation of AlphaFold2 (AF2) to train a model, AF2BIND, to accurately predict small-molecule-binding residues given only a target protein. AF2BIND uses 20 "bait" amino acids to optimally extract the binding signal in the absence of a small-molecule ligand. We find that the AF2 pair representation outperforms other neural-network representations for binding-site prediction. Moreover, unique combinations of the 20 bait amino acids are correlated with chemical properties of the ligand.

The pipeline for large proteins can be found here: https://github.com/arteemg/af2bind_prod/blob/main/af2bind_large_pdb.ipynb

For more details see preprint:

**AF2BIND: Predicting ligand-binding sites using the pair representation of AlphaFold2**
* Artem Gazizov, Anna Lian, Casper Alexander Goverde, Sergey Ovchinnikov, Nicholas F. Polizzi
* https://doi.org/10.1101/2023.10.15.562410


<a href="https://colab.research.google.com/github/sokrypton/af2bind/blob/main/af2bind.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

<p align="center"><img src="https://raw.githubusercontent.com/artemg97/af2bind_prod/main/logo.png" height="128" /></p>

Experiments were conducted using the latest [ColabDesign](https://github.com/sokrypton/ColabDesign) github commit `v1.1.1`, with the Alphafold's weights as of [2022-03-02](https://storage.googleapis.com/alphafold/alphafold_params_2022-03-02.tar)

# Software requirements

AF2BIND was tested on Red Hat Enterprise Linux; Version 9.6

# Installation

first install jax (with GPU support)

``` pip install "jax[cuda]" -f https://storage.googleapis.com/jax-releases/jax_cuda_releases.html ```

second install colabdesign

```
pip install git+https://github.com/sokrypton/ColabDesign.git@v1.1.1
# download alphafold weights
mkdir params
curl -fsSL https://storage.googleapis.com/alphafold/alphafold_params_2022-12-06.tar | tar x -C params
```

# License

This project is covered under the MIT License.

# Other Models
The *.zip files contain all the other weights for models described in the manuscript (including ESM-2, ESM-IF, combinations, etc.). See train_script.ipynb for details on how features are combined.
