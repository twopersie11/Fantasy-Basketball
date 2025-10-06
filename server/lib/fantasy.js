const fantasyAdvice = require('../data/fantasyAdvice.json');
const fantasyCriteria = require('../data/criteria.json');

const getFantasyOptions = () =>
  fantasyCriteria.map((criterion) => ({
    id: criterion.value,
    label: criterion.label,
    description: fantasyAdvice[criterion.value]?.description || '',
  }));

const getFantasyAdvice = (optionId) => fantasyAdvice[optionId] || null;

module.exports = {
  getFantasyOptions,
  getFantasyAdvice,
};
