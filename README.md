# AF2BIND: Prediction of ligand-binding sites using AlphaFold2
Predicting ligand-binding sites, particularly in the absence of previously resolved homologous structures, presents a significant challenge in structural biology. Here, we leverage the internal pairwise representation of AlphaFold2 (AF2) to train a model, AF2BIND, to accurately predict small-molecule-binding residues given only a target protein. AF2BIND uses 20 "bait" amino acids to optimally extract the binding signal in the absence of a small-molecule ligand. We find that the AF2 pair representation outperforms other neural-network representations for binding-site prediction. Moreover, unique combinations of the 20 bait amino acids are correlated with chemical properties of the ligand.

For more details see preprint:

**AF2BIND: Predicting ligand-binding sites using the pair representation of AlphaFold2**
* Artem Gazizov, Anna Lian, Casper Alexander Goverde, Sergey Ovchinnikov, Nicholas F. Polizzi
* https://doi.org/10.1101/2023.10.15.562410


<a href="https://colab.research.google.com/github/sokrypton/af2bind/blob/main/af2bind.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

<p align="center"><img src="https://raw.githubusercontent.com/artemg97/af2bind_prod/main/logo.png" height="128" /></p>

Experiments were conducted using the latest [ColabDesign](https://github.com/sokrypton/ColabDesign) github commit `v1.1.1`, with the Alphafold's weights as of [2022-03-02](https://storage.googleapis.com/alphafold/alphafold_params_2022-03-02.tar)
