# AF2BIND: lightweight and fast prediction of ligand-binding sites 
The accurate prediction of ligand-binding sites in proteins remains an outstanding challenge, despite its potential to accelerate drug discovery and inform on natural protein function. Protein-ligand interactions play an important role in cell signaling by carrying out essential biological processes. Here, we train a neural network, AF2BIND, using embedding features from a protein structure prediction model, AlphaFold2, to accurately predict the binding epitopes of proteins from single structures. AF2BIND effectively captures binding signatures of small-molecule-binding sites, without knowledge of the true ligand. 

<a href="https://colab.research.google.com/github/sokrypton/af2bind/blob/main/af2bind.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>


<p align="center"><img src="https://raw.githubusercontent.com/artemg97/af2bind_prod/main/logo.png" height="128" /></p>

Experiments were conducted using the latest ColabDesign github commit as of 03/11/2023 (https://github.com/sokrypton/ColabDesign on commit `961c7afda81a2bc8d8990d539cce25dc5a15dd1f`), with the Alphafold's weights as of 2022-03-02 (https://github.com/deepmind/alphafold on https://storage.googleapis.com/alphafold/alphafold_params_2022-03-02.tar)
