import commands from '../../commands';
import Command, { CommandError, CommandOption } from '../../../../Command';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth, { Site } from '../../SpoAuth';
const command: Command = require('./tenant-settings-list');
import * as assert from 'assert';
import request from '../../../../request';
import Utils from '../../../../Utils';

describe(commands.TENANT_SETTINGS_LIST, () => {
  let vorpal: Vorpal;
  let log: any[];
  let requests: any[];
  let cmdInstance: any;
  let trackEvent: any;
  let telemetry: any;

  let cmdInstanceLogSpy: sinon.SinonSpy;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(auth, 'ensureAccessToken').callsFake(() => { return Promise.resolve('ABC'); });
    sinon.stub(command as any, 'getRequestDigestForSite').callsFake(() => { return Promise.resolve({ FormDigestValue: 'abc' }); });
    trackEvent = sinon.stub(appInsights, 'trackEvent').callsFake((t) => {
      telemetry = t;
    });
  });

  beforeEach(() => {
    vorpal = require('../../../../vorpal-init');
    log = [];
    requests = [];
    cmdInstance = {
      log: (msg: string) => {
        log.push(msg);
      }
    };
    cmdInstanceLogSpy = sinon.spy(cmdInstance, 'log');
    auth.site = new Site();
    telemetry = null;
  });

  afterEach(() => {
    Utils.restore([
      vorpal.find,
      request.get,
      request.post
    ]);
  });

  after(() => {
    Utils.restore([
      appInsights.trackEvent,
      auth.ensureAccessToken,
      auth.restoreAuth,
      request.get,
      request.post
    ]);
  });

  it('has correct name', () => {
    assert.equal(command.name.startsWith(commands.TENANT_SETTINGS_LIST), true);
  });

  it('has a description', () => {
    assert.notEqual(command.description, null);
  });

  it('calls telemetry', (done) => {
    cmdInstance.action = command.action();
    cmdInstance.action({ options: {} }, () => {
      try {
        assert(trackEvent.called);
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('logs correct telemetry event', (done) => {
    cmdInstance.action = command.action();
    cmdInstance.action({ options: {} }, () => {
      try {
        assert.equal(telemetry.name, commands.TENANT_SETTINGS_LIST);
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('supports debug mode', () => {
    const options = (command.options() as CommandOption[]);
    let containsDebugOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsDebugOption = true;
      }
    });
    assert(containsDebugOption);
  });

  it('has help referring to the right command', () => {
    const cmd: any = {
      log: (msg: string) => { },
      prompt: () => { },
      helpInformation: () => { }
    };
    const find = sinon.stub(vorpal, 'find').callsFake(() => cmd);
    cmd.help = command.help();
    cmd.help({}, () => { });
    assert(find.calledWith(commands.TENANT_SETTINGS_LIST));
  });

  it('has help with examples', () => {
    const _log: string[] = [];
    const cmd: any = {
      log: (msg: string) => {
        _log.push(msg);
      },
      prompt: () => { },
      helpInformation: () => { }
    };
    sinon.stub(vorpal, 'find').callsFake(() => cmd);
    cmd.help = command.help();
    cmd.help({}, () => { });
    let containsExamples: boolean = false;
    _log.forEach(l => {
      if (l && l.indexOf('Examples:') > -1) {
        containsExamples = true;
      }
    });
    Utils.restore(vorpal.find);
    assert(containsExamples);
  });

  it('handles promise error while getting tenant appcatalog', (done) => {
    // get tenant app catalog
    sinon.stub(request, 'post').callsFake((opts) => {
      requests.push(opts);
      if (opts.url.indexOf('_vti_bin/client.svc/ProcessQuery') > -1) {
        return Promise.reject('An error has occurred');
      }
      if (opts.url.indexOf('contextinfo') > -1) {
        return Promise.resolve('abc');
      }
      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {

      }
    }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('An error has occurred')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('handles error while getting tenant appcatalog', (done) => {
    // get tenant app catalog
    sinon.stub(request, 'post').callsFake((opts) => {
      requests.push(opts);
      if (opts.url.indexOf('_vti_bin/client.svc/ProcessQuery') > -1) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.7018.1204", "ErrorInfo": {
              "ErrorMessage": "An error has occurred", "ErrorValue": null, "TraceCorrelationId": "18091989-62a6-4cad-9717-29892ee711bc", "ErrorCode": -1, "ErrorTypeName": "Microsoft.SharePoint.Client.ServerException"
            }, "TraceCorrelationId": "18091989-62a6-4cad-9717-29892ee711bc"
          }
        ]));
      }
      if (opts.url.indexOf('contextinfo') > -1) {
        return Promise.resolve('abc');
      }
      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {

      }
    }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('An error has occurred')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('lists the tenant settings (debug)', (done) => {
    // get tenant app catalog
    sinon.stub(request, 'post').callsFake((opts) => {
      requests.push(opts);
      if (opts.url.indexOf('_vti_bin/client.svc/ProcessQuery') > -1) {
        return Promise.resolve(JSON.stringify([
          {
          "SchemaVersion":"15.0.0.0","LibraryVersion":"16.0.8015.1218","ErrorInfo":null,"TraceCorrelationId":"6148899e-a042-6000-ee90-5bfa05d08b79"
          },4,{
          "IsNull":false
          },5,{
          "_ObjectType_":"Microsoft.Online.SharePoint.TenantAdministration.Tenant","_ObjectIdentity_":"6648899e-a042-6000-ee90-5bfa05d08b79|908bed80-a04a-4433-b4a0-883d9847d11d:ea1787c6-7ce2-4e71-be47-5e0deb30f9ee\nTenant","AllowDownloadingNonWebViewableFiles":true,"AllowedDomainListForSyncClient":[
          
          ],"AllowEditing":true,"AllowLimitedAccessOnUnmanagedDevices":false,"ApplyAppEnforcedRestrictionsToAdHocRecipients":true,"BccExternalSharingInvitations":false,"BccExternalSharingInvitationsList":null,"BlockAccessOnUnmanagedDevices":false,"BlockDownloadOfAllFilesForGuests":false,"BlockDownloadOfAllFilesOnUnmanagedDevices":false,"BlockDownloadOfViewableFilesForGuests":false,"BlockDownloadOfViewableFilesOnUnmanagedDevices":false,"BlockMacSync":false,"CommentsOnSitePagesDisabled":false,"CompatibilityRange":"15,15","ConditionalAccessPolicy":0,"DefaultLinkPermission":1,"DefaultSharingLinkType":1,"DisabledWebPartIds":null,"DisableReportProblemDialog":false,"DisallowInfectedFileDownload":false,"DisplayNamesOfFileViewers":true,"DisplayStartASiteOption":false,"EmailAttestationReAuthDays":30,"EmailAttestationRequired":false,"EnableGuestSignInAcceleration":false,"EnableMinimumVersionRequirement":true,"ExcludedFileExtensionsForSyncClient":[
          ""
          ],"ExternalServicesEnabled":true,"FileAnonymousLinkType":2,"FilePickerExternalImageSearchEnabled":true,"FolderAnonymousLinkType":2,"HideSyncButtonOnODB":false,"IPAddressAllowList":"","IPAddressEnforcement":false,"IPAddressWACTokenLifetime":15,"IsHubSitesMultiGeoFlightEnabled":false,"IsMultiGeo":false,"IsUnmanagedSyncClientForTenantRestricted":false,"IsUnmanagedSyncClientRestrictionFlightEnabled":true,"LegacyAuthProtocolsEnabled":true,"LimitedAccessFileType":1,"NoAccessRedirectUrl":null,"NotificationsInOneDriveForBusinessEnabled":true,"NotificationsInSharePointEnabled":true,"NotifyOwnersWhenInvitationsAccepted":true,"NotifyOwnersWhenItemsReshared":true,"ODBAccessRequests":0,"ODBMembersCanShare":0,"OfficeClientADALDisabled":false,"OneDriveForGuestsEnabled":false,"OneDriveStorageQuota":1048576,"OptOutOfGrooveBlock":false,"OptOutOfGrooveSoftBlock":false,"OrphanedPersonalSitesRetentionPeriod":30,"OwnerAnonymousNotification":true,"PermissiveBrowserFileHandlingOverride":false,"PreventExternalUsersFromResharing":true,"ProvisionSharedWithEveryoneFolder":false,"PublicCdnAllowedFileTypes":"CSS,EOT,GIF,ICO,JPEG,JPG,JS,MAP,PNG,SVG,TTF,WOFF","PublicCdnEnabled":false,"PublicCdnOrigins":[
          
          ],"RequireAcceptingAccountMatchInvitedAccount":true,"RequireAnonymousLinksExpireInDays":-1,"ResourceQuota":66700,"ResourceQuotaAllocated":13668,"RootSiteUrl":"https:\u002f\u002fprufinancial.sharepoint.com","SearchResolveExactEmailOrUPN":false,"SharingAllowedDomainList":"microsoft.com pramerica.ie pramericacdsdev.com prudential.com prufinancial.onmicrosoft.com","SharingBlockedDomainList":"deloitte.com","SharingCapability":1,"SharingDomainRestrictionMode":1,"ShowAllUsersClaim":false,"ShowEveryoneClaim":false,"ShowEveryoneExceptExternalUsersClaim":false,"ShowNGSCDialogForSyncOnODB":true,"ShowPeoplePickerSuggestionsForGuestUsers":false,"SignInAccelerationDomain":"","SocialBarOnSitePagesDisabled":false,"SpecialCharactersStateInFileFolderNames":1,"StartASiteFormUrl":null,"StorageQuota":4448256,"StorageQuotaAllocated":676508312,"SyncPrivacyProfileProperties":true,"UseFindPeopleInPeoplePicker":false,"UsePersistentCookiesForExplorerView":false,"UserVoiceForFeedbackEnabled":false,"HideDefaultThemes":true
          }
          ]));
      }
      if (opts.url.indexOf('contextinfo') > -1) {
        return Promise.resolve('abc');
      }
      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {
        debug: true
      }
    }, () => {
      try {
        assert.equal(cmdInstanceLogSpy.lastCall.args[0].AllowDownloadingNonWebViewableFiles, true);
        assert.equal(cmdInstanceLogSpy.lastCall.args[0].BccExternalSharingInvitationsList, null);
        assert.equal(cmdInstanceLogSpy.lastCall.args[0].HideDefaultThemes, true);
        assert.equal(cmdInstanceLogSpy.lastCall.args[0].UserVoiceForFeedbackEnabled, false);
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["_ObjectType_"], undefined);
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["_ObjectIdentity_"], undefined);

        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["SharingCapability"], 'ExternalUserSharingOnly');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["SharingDomainRestrictionMode"], 'AllowList');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["ODBMembersCanShare"], 'Unspecified');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["ODBAccessRequests"], 'Unspecified');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["DefaultSharingLinkType"], 'Direct');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["FileAnonymousLinkType"], 'Edit');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["FolderAnonymousLinkType"], 'Edit');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["DefaultLinkPermission"], 'View');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["ConditionalAccessPolicy"], 'AllowFullAccess');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["SpecialCharactersStateInFileFolderNames"], 'Allowed');
        assert.equal(cmdInstanceLogSpy.lastCall.args[0]["LimitedAccessFileType"], 'WebPreviewableFiles');
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('handles tenant settings error', (done) => {
    // get tenant app catalog
    sinon.stub(request, 'post').callsFake((opts) => {
      requests.push(opts);
      if (opts.url.indexOf('_vti_bin/client.svc/ProcessQuery') > -1) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.7407.1202", "ErrorInfo": { "ErrorMessage": "Timed out" }, "TraceCorrelationId": "2df74b9e-c022-5000-1529-309f2cd00843"
          }, 58, {
            "IsNull": false
          }, 59, {
            "_ObjectType_":"Microsoft.Online.SharePoint.TenantAdministration.Tenant"
          }
        ]));
      }
      if (opts.url.indexOf('contextinfo') > -1) {
        return Promise.resolve('abc');
      }
      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {

      }
    }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('Timed out')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });
});