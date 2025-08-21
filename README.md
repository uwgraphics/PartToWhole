# Anchoring and Alignment: Data Factors in Part-to-Whole Visualization
## Code and Data Repository
This repository contains the code and data for the paper [**Anchoring and Alignment: Data Factors in Part-to-Whole Visualization**](https://arxiv.org/abs/2508.01881). See also the [preprint](https://pages.graphics.cs.wisc.edu/PartToWhole/PartWhole-Preprint.pdf), the [supplementary document](pdf/supplementaryDocument.pdf) and the [preregistration](https://osf.io/e36au/).

![Teaser Figure](https://github.com/uwgraphics/PartToWhole/blob/main/preprint/teaserFigure.png)
Fig. 1: Ⓐ A pair of example stimuli from each combination of pie and stacked bar charts, aligned (segment starts/ends at a marker) and unaligned, and anchor (segment has a recognizable size) and non-anchor values. Ⓑ Predicted mean absolute error and response time to 95% CI. Anchor values and alignment positions show significant performance improvements in estimating values for both chart types. Results between conditions are significant (p < 0.05) except where noted.

### Abstract

We explore the effects of data and design considerations through the example case of part-to-whole data relationships.
Standard part-to-whole representations like pie charts and stacked bar charts make the relationships of parts to the whole explicit.
Value estimation in these charts benefits from two perceptual mechanisms: _anchoring_, where the value is close to a reference value with an easily recognized shape, and _alignment_ where the beginning or end of the shape is aligned with a marker.
In an online study, we explore how data and design factors such as value, position, and encoding together impact these effects in making estimations in part-to-whole charts.
The results show how salient values and alignment to positions on a scale affect task performance.
This demonstrates the need for informed visualization design based around how data properties and design factors affect perceptual mechanisms.

### Contents
* #### Notebooks
    * [`modelResults.ipynb`](notebooks/modelResults.ipynb): Modelling the experiment results with GLMMs
    * [`generateStimuli.ipynb`](notebooks/generateStimuli.ipynb): Stratified random sampling generation of stimuli
    * [`createChart.js`](notebooks/createChart.js): Generate the svg charts for each stimulus using D3.js

* #### Data
    * [`results.csv`](data/results.csv): Participant response results of the experiment
    * [`stimuli.csv`](data/stimuli.csv): Corresponding stimuli used for the experiment
