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

# System Requirements

## Hardware requirement
AF2BIND requires a standalone computer with an Nvidia GPU.

## OS Requirements
AF2BIND was tested on Red Hat Enterprise Linux; Version 9.6

## Python dependencies

``` 
colabdesign
numpy
pandas
jax
pickle
py3Dmol
``` 
typical install time ≈ 10 minutes.

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

# Code example

We run af2bind on the PDB file 6w70 to get the predictions. 
To run the code, you should define the af2bind function, which is located in af2bind.ipynb.

```
target_pdb = "6w70" 
target_chain = "A"

mask_sidechains = True
mask_sequence = False

target_pdb = target_pdb.replace(" ","")
target_chain = target_chain.replace(" ","")
if target_chain == "":
  target_chain = "A"

pdb_filename = get_pdb(target_pdb)

clear_mem()
af_model = mk_afdesign_model(protocol="binder", debug=True)
af_model.prep_inputs(pdb_filename=pdb_filename,
                     chain=target_chain,
                     binder_len=20,
                     rm_target_sc=mask_sidechains,
                     rm_target_seq=mask_sequence)

r_idx = af_model._inputs["residue_index"][-20] + (1 + np.arange(20)) * 50
af_model._inputs["residue_index"][-20:] = r_idx.flatten()

af_model.set_seq("ACDEFGHIKLMNPQRSTVWY")
af_model.predict(verbose=False)

o = af2bind(af_model.aux["debug"]["outputs"],
            mask_sidechains=mask_sidechains)
pred_bind = o["p_bind"].copy()
```



# License

This project is covered under the MIT License.

# Other Models
The *.zip files contain all the other weights for models described in the manuscript (including ESM-2, ESM-IF, combinations, etc.). See train_script.ipynb for details on how features are combined.
