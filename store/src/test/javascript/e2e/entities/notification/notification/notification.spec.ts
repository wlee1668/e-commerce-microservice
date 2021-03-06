/* tslint:disable no-unused-expression */
import { browser, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import NotificationComponentsPage from './notification.page-object';
import { NotificationDeleteDialog } from './notification.page-object';
import NotificationUpdatePage from './notification-update.page-object';

const expect = chai.expect;

describe('Notification e2e test', () => {
  let navBarPage: NavBarPage;
  let notificationUpdatePage: NotificationUpdatePage;
  let notificationComponentsPage: NotificationComponentsPage;
  let notificationDeleteDialog: NotificationDeleteDialog;

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.autoSignIn();
  });

  it('should load Notifications', async () => {
    navBarPage.getEntityPage('notification');
    notificationComponentsPage = new NotificationComponentsPage();
    expect(await notificationComponentsPage.getTitle().getText()).to.match(/Notifications/);
  });

  it('should load create Notification page', async () => {
    notificationComponentsPage.clickOnCreateButton();
    notificationUpdatePage = new NotificationUpdatePage();
    expect(await notificationUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /storeApp.notificationNotification.home.createOrEditLabel/
    );
  });

  it('should create and save Notifications', async () => {
    const nbButtonsBeforeCreate = await notificationComponentsPage.countDeleteButtons();

    notificationUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await notificationUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
    notificationUpdatePage.setDetailsInput('details');
    expect(await notificationUpdatePage.getDetailsInput()).to.match(/details/);
    notificationUpdatePage.setSentDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await notificationUpdatePage.getSentDateInput()).to.contain('2001-01-01T02:30');
    notificationUpdatePage.formatSelectLastOption();
    notificationUpdatePage.setUserIdInput('5');
    expect(await notificationUpdatePage.getUserIdInput()).to.eq('5');
    notificationUpdatePage.setProductIdInput('5');
    expect(await notificationUpdatePage.getProductIdInput()).to.eq('5');
    await notificationUpdatePage.save();
    expect(await notificationUpdatePage.getSaveButton().isPresent()).to.be.false;

    notificationComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await notificationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Notification', async () => {
    notificationComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await notificationComponentsPage.countDeleteButtons();
    await notificationComponentsPage.clickOnLastDeleteButton();

    notificationDeleteDialog = new NotificationDeleteDialog();
    expect(await notificationDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /storeApp.notificationNotification.delete.question/
    );
    await notificationDeleteDialog.clickOnConfirmButton();

    notificationComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await notificationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});
