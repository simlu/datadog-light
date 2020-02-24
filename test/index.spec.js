const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Datadog = require('../src/index');

describe('Testing datadog-light', {
  useNock: true,
  timestamp: 1582401450
}, () => {
  let dd;
  let ddGlobalTag;
  let unix;
  beforeEach(() => {
    dd = Datadog(process.env.API_KEY);
    ddGlobalTag = Datadog(process.env.API_KEY, { tags: ['global-tag'] });
    unix = new Date() / 1;
  });

  describe('Testing sendDistributionMetric', () => {
    it('Testing points as array', async () => {
      dd.DistributionMetric.enqueue('metric.name', [unix, unix]);
      const r = await dd.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing points as object', async () => {
      await dd.DistributionMetric.enqueue('metric.name', { [unix]: 7, [unix + 1]: 3 });
      const r = await dd.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing multiple enqueue', async () => {
      dd.DistributionMetric.enqueue('metric.name1', [unix, unix]);
      dd.DistributionMetric.enqueue('metric.name2', [unix, unix]);
      const r = await dd.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing with local tag', async () => {
      await dd.DistributionMetric.enqueue('metric.name', [unix], { tags: ['local-tag'] });
      const r = await dd.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing with global tag', async () => {
      await ddGlobalTag.DistributionMetric.enqueue('metric.name', [unix]);
      const r = await ddGlobalTag.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing with local and global tag', async () => {
      await ddGlobalTag.DistributionMetric.enqueue('metric.name', [unix], { tags: ['local-tag'] });
      const r = await ddGlobalTag.DistributionMetric.flush();
      expect(r).to.equal(true);
    });

    it('Testing empty flush', async () => {
      const r = await ddGlobalTag.DistributionMetric.flush();
      expect(r).to.equal(true);
    });
  });
});
