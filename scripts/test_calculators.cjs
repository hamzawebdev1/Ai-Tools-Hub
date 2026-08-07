const CalcEngine = require('../src/services/calculatorEngine');
const ConvEngine = require('../src/services/converterEngine');

console.log('Testing Percentage calculation...');
const pct = CalcEngine.calculatePercentage(100, 15);
console.log('Pct result:', pct.formattedResult);

console.log('Testing EMI calculation...');
const emi = CalcEngine.calculateEMI(100000, 7.5, 15);
console.log('EMI result:', emi.formattedResult);

console.log('Testing Unit conversion...');
const unit = ConvEngine.convertUnit('length', 'meter', 'foot', 10);
console.log('Unit result:', unit.result, unit.explanation);

console.log('Testing Color conversion...');
const rgb = ConvEngine.hexToRgb('#4F46E5');
console.log('RGB result:', rgb);

console.log('All tests passed successfully!');
