import { BitcoinGraphPage } from './app.po';

describe('bitcoin-graph App', function() {
  let page: BitcoinGraphPage;

  beforeEach(() => {
    page = new BitcoinGraphPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
