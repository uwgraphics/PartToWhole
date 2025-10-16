// Grab elements (helper)
const $ = (id) => document.getElementById(id);

// --- sizes & data ---
const pieSize = 100;
const barSize = 400;

const unalignedNonAnchorSmall = [10,6,15,3,16,42,8];
const alignedNonAnchorSmall = [37,13,15,7,13,11,4];
const nearAlignedNonAnchorSmall = [37,11,15,7,11,9,8];
const farAlignedNonAnchorSmall = [34,10,15,6,12,16,7];

const unalignedAnchor25 = [8,7,25,5,8,38,9];
const unalignedNearAnchor = [8,7,22,7,8,38,10];
const unalignedFarAnchor = [8,7,19,7,9,38,13];

const unalignedNonAnchorLarge = [4,16,35,25,5,9,6];
const alignedNonAnchorLarge = [17,8,35,11,7,9,13];
const unalignedAnchor50 = [18,13,50,3,4,7,5];

// --- create charts once (returning update fns) ---
const pieChart1  = createPie(unalignedNonAnchorSmall, 2, pieSize,  $('pieChartDiv1'));
const pieChart2  = createPie(unalignedNonAnchorLarge, 2, pieSize,  $('pieChartDiv2'));
const barChart1  = createBar(unalignedNonAnchorSmall, 2, barSize,  $('barChartDiv1'));
const barChart2  = createBar(unalignedNonAnchorLarge, 2, barSize,  $('barChartDiv2')); 

const pieAnchor1 = createPie(unalignedNonAnchorSmall, 2, pieSize, $('pieAnchorDiv1'));
const pieAnchor2 = createPie(unalignedNonAnchorLarge, 2, pieSize, $('pieAnchorDiv2'));
const barAnchor1 = createBar(unalignedNonAnchorSmall, 2, barSize, $('barAnchorDiv1'));
const barAnchor2 = createBar(unalignedNonAnchorLarge, 2, barSize, $('barAnchorDiv2'));

const pieAlign1 = createPie(unalignedAnchor25, 2, pieSize,  $('pieAlignDiv1'));
const pieAlign2 = createPie(unalignedAnchor50, 2, pieSize,  $('pieAlignDiv2'));
const barAlign1 = createBar(unalignedAnchor25, 2, barSize,  $('barAlignDiv1'));
const barAlign2 = createBar(unalignedAnchor50, 2, barSize,  $('barAlignDiv2')); 

const pieAlH1 = createPie(alignedNonAnchorSmall, 2, pieSize,  $('pieAlHDiv1'));
const pieAlH2 = createPie(unalignedNonAnchorSmall, 2, pieSize,  $('pieAlHDiv2'));
const barAlH1 = createBar(alignedNonAnchorSmall, 2, barSize,  $('barAlHDiv1'));
const barAlH2 = createBar(unalignedNonAnchorSmall, 2, barSize,  $('barAlHDiv2')); 

const pieAlDH1 = createPie(alignedNonAnchorSmall, 2, pieSize,  $('pieAlDHDiv1'));
const pieAlDH2 = createPie(nearAlignedNonAnchorSmall, 2, pieSize,  $('pieAlDHDiv2'));
const pieAlDH3 = createPie(farAlignedNonAnchorSmall, 2, pieSize,  $('pieAlDHDiv3'));
const barAlDH1 = createBar(alignedNonAnchorSmall, 2, barSize,  $('barAlDHDiv1'));
const barAlDH2 = createBar(nearAlignedNonAnchorSmall, 2, barSize,  $('barAlDHDiv2')); 
const barAlDH3 = createBar(farAlignedNonAnchorSmall, 2, barSize,  $('barAlDHDiv2')); 

const pieAnH1 = createPie(unalignedAnchor25, 2, pieSize,  $('pieAnHDiv1'));
const pieAnH2 = createPie(unalignedNonAnchorSmall, 2, pieSize,  $('pieAnHDiv2'));
const barAnH1 = createBar(unalignedAnchor25, 2, barSize,  $('barAnHDiv1'));
const barAnH2 = createBar(unalignedNonAnchorSmall, 2, barSize,  $('barAnHDiv2')); 

const pieAnDH1 = createPie(unalignedAnchor25, 2, pieSize,  $('pieAnDHDiv1'));
const pieAnDH2 = createPie(unalignedNearAnchor, 2, pieSize,  $('pieAnDHDiv2'));
const pieAnDH3 = createPie(unalignedFarAnchor, 2, pieSize,  $('pieAnDHDiv3'));
const barAnDH1 = createBar(unalignedAnchor25, 2, barSize,  $('barAnDHDiv1'));
const barAnDH2 = createBar(unalignedNearAnchor, 2, barSize,  $('barAnDHDiv2')); 
const barAnDH3 = createBar(unalignedFarAnchor, 2, barSize,  $('barAnDHDiv2')); 

const pieAnR1 = createPie(unalignedAnchor25, 2, pieSize,  $('pieAnRDiv1'));
const pieAnR2 = createPie(unalignedNonAnchorSmall, 2, pieSize,  $('pieAnRDiv2'));
const barAnR1 = createBar(unalignedAnchor25, 2, barSize,  $('barAnRDiv1'));
const barAnR2 = createBar(unalignedNonAnchorSmall, 2, barSize,  $('barAnRDiv2')); 

const pieAlR1 = createPie(alignedNonAnchorSmall, 2, pieSize,  $('pieAlRDiv1'));
const pieAlR2 = createPie(unalignedNonAnchorSmall, 2, pieSize,  $('pieAlRDiv2'));
const barAlR1 = createBar(alignedNonAnchorSmall, 2, barSize,  $('barAlRDiv1'));
const barAlR2 = createBar(unalignedNonAnchorSmall, 2, barSize,  $('barAlRDiv2')); 

function resetAlHypSlide() {
    pieAlH1(alignedNonAnchorSmall, 0);
    pieAlH2(alignedNonAnchorLarge, 0);
    barAlH1(alignedNonAnchorSmall, 0);
    barAlH2(alignedNonAnchorLarge, 0);
}
function playAlHypSlide() {
    setTimeout(() => {
        pieAlH1(alignedNonAnchorSmall, 1000);
        pieAlH2(unalignedNonAnchorSmall, 1000);
        barAlH1(alignedNonAnchorSmall, 1000);
        barAlH2(unalignedNonAnchorSmall, 1000);
    }, 10);
}

function resetAnchoringSlide() {
    pieAnchor1(unalignedNonAnchorSmall, 0);
    pieAnchor2(unalignedNonAnchorLarge, 0);
    barAnchor1(unalignedNonAnchorSmall, 0);
    barAnchor2(unalignedNonAnchorLarge, 0);
}
function playAnchoringSlide() {
    setTimeout(() => {
        pieAnchor1(unalignedAnchor25, 1000);
        pieAnchor2(unalignedAnchor50, 1000);
        barAnchor1(unalignedAnchor25, 1000);
        barAnchor2(unalignedAnchor50, 1000);
    }, 10);
}

function resetAlignmentSlide() {
    pieAlign1(unalignedAnchor25, 0);
    pieAlign2(unalignedAnchor50, 0);
    barAlign1(unalignedAnchor25, 0);
    barAlign2(unalignedAnchor50, 0);
}
function playAlignmentSlide() {
    setTimeout(() => {
        pieAlign1(alignedNonAnchorSmall, 1000);
        pieAlign2(alignedNonAnchorLarge, 1000);
        barAlign1(alignedNonAnchorSmall, 1000);
        barAlign2(alignedNonAnchorLarge, 1000);
    }, 10);
}

Reveal.on('ready', (evt) => {
    if (evt.currentSlide?.id === 'anchoring-slide') {
        resetAnchoringSlide();
        playAnchoringSlide();
    }
    if (evt.currentSlide?.id === 'alignment-slide') {
        resetAlignmentSlide();
        playAlignmentSlide();
    }
    if (evt.currentSlide?.id === 'alHyp-slide') {
        resetAlHypSlide();
        playAlHypSlide();
    }
});

// Run every time we navigate to that slide
Reveal.on('slidechanged', (evt) => {
    if (evt.currentSlide?.id === 'anchoring-slide') {
        resetAnchoringSlide();
        playAnchoringSlide();
    }
    else if (evt.currentSlide?.id === 'alignment-slide') {
        resetAlignmentSlide();
        playAlignmentSlide();
    }
    else if (evt.currentSlide?.id === 'alHyp-slide') {
        resetAlHypSlide();
        playAlHypSlide();
    }
    if (evt.previousSlide?.id === 'anchoring-slide') resetAnchoringSlide();
    if (evt.previousSlide?.id === 'alignment-slide') resetAlignmentSlide();
    if (evt.previousSlide?.id === 'alHyp-slide') resetAlHypSlide();
});
