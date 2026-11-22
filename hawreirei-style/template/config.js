// HAWREIREI house style — shared constants (palette, canvas).
const W = 1080, H = 1920;
let ctx = null;
const C = {
  paper: '#F1E8D2', ink: '#2B2219', sea: '#A6CCD3', land: '#E4D3A2', red: '#C8463A', brass: '#D9B158',
  caption: '#F5E9C4', table: '#7B6A57',
  rice: '#F7F1DE', riceEdge: 'rgba(120,96,52,.55)',
  legend: '#E2CFA6', legendInk: '#8A2F24',   // the manuscript page of the legend; its red rubric
  sq1: '#F3E6C4', sq2: '#B98B57',             // chessboard: cream and wood
};
const MAIN = document.getElementById('c').getContext('2d');
