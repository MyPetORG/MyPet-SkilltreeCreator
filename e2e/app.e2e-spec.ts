import { SkilltreeCreatorPage } from "./app.po";

describe('skilltree-creator App', () => {
  let page: SkilltreeCreatorPage;

  beforeEach(() => {
    page = new SkilltreeCreatorPage();
  });

  it('should display skilltree saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
