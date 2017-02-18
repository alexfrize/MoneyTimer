import { MoneytimerPage } from './app.po';

describe('moneytimer App', function() {
  let page: MoneytimerPage;

  beforeEach(() => {
    page = new MoneytimerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
