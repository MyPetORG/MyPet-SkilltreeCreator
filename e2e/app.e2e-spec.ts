import { SkilltreeCreatorPage } from "./app.po";

describe('selectedSkilltree-creator App', () => {
  let page: SkilltreeCreatorPage;

  beforeEach(() => {
    page = new SkilltreeCreatorPage();
  });

  it('should display selectedSkilltree saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
