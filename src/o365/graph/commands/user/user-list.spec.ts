import commands from '../../commands';
import Command, { CommandOption, CommandError } from '../../../../Command';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../GraphAuth';
const command: Command = require('./user-list');
import * as assert from 'assert';
import request from '../../../../request';
import Utils from '../../../../Utils';
import { Service } from '../../../../Auth';

describe(commands.USER_LIST, () => {
  let vorpal: Vorpal;
  let log: string[];
  let cmdInstance: any;
  let cmdInstanceLogSpy: sinon.SinonSpy;
  let trackEvent: any;
  let telemetry: any;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(auth, 'ensureAccessToken').callsFake(() => { return Promise.resolve('ABC'); });
    trackEvent = sinon.stub(appInsights, 'trackEvent').callsFake((t) => {
      telemetry = t;
    });
  });

  beforeEach(() => {
    vorpal = require('../../../../vorpal-init');
    log = [];
    cmdInstance = {
      log: (msg: string) => {
        log.push(msg);
      }
    };
    cmdInstanceLogSpy = sinon.spy(cmdInstance, 'log');
    auth.service = new Service();
    telemetry = null;
    (command as any).items = [];
  });

  afterEach(() => {
    Utils.restore([
      vorpal.find,
      request.get
    ]);
  });

  after(() => {
    Utils.restore([
      appInsights.trackEvent,
      auth.ensureAccessToken,
      auth.restoreAuth
    ]);
  });

  it('has correct name', () => {
    assert.equal(command.name.startsWith(commands.USER_LIST), true);
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
        assert.equal(telemetry.name, commands.USER_LIST);
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('aborts when not logged in to Microsoft Graph', (done) => {
    auth.service = new Service();
    auth.service.connected = false;
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: true } }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('Log in to the Microsoft Graph first')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('lists users in the tenant with the default properties', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Aarif Sherzai","userPrincipalName":"AarifS@contoso.onmicrosoft.com"},{"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Conf Room Adams","userPrincipalName":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","userPrincipalName":"AdamW@contoso.onmicrosoft.com"},{"displayName":"Adele Vance","userPrincipalName":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","userPrincipalName":"admin@contoso.onmicrosoft.com"},{"displayName":"Adriana Napolitani","userPrincipalName":"AdrianaN@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Alex Wilber","userPrincipalName":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","userPrincipalName":"AliceL@contoso.onmicrosoft.com"},{"displayName":"Alisha Guerrero","userPrincipalName":"AlishaG@contoso.onmicrosoft.com"},{"displayName":"Allan Deyoung","userPrincipalName":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","userPrincipalName":"AnnaL@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Arif Badakhshi","userPrincipalName":"ArifB@contoso.onmicrosoft.com"},{"displayName":"Conf Room Baker","userPrincipalName":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","userPrincipalName":"BasimK@contoso.onmicrosoft.com"},{"displayName":"Betsy Drake","userPrincipalName":"BetsyD@contoso.onmicrosoft.com"},{"displayName":"Bianca Pisani","userPrincipalName":"BiancaP@contoso.onmicrosoft.com"},{"displayName":"Bianca Pagnotto","userPrincipalName":"BiancaPa@contoso.onmicrosoft.com"},{"displayName":"Brian Johnson (TAILSPIN)","userPrincipalName":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","userPrincipalName":"CameronW@contoso.onmicrosoft.com"},{"displayName":"Candy Dominguez","userPrincipalName":"CandyD@contoso.onmicrosoft.com"},{"displayName":"Caterina Costa","userPrincipalName":"CaterinaC@contoso.onmicrosoft.com"},{"displayName":"Christie Cline","userPrincipalName":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","userPrincipalName":"ChristophW@contoso.onmicrosoft.com"},{"displayName":"Clarissa Trentini","userPrincipalName":"ClarissaT@contoso.onmicrosoft.com"},{"displayName":"Claudia Pugliesi","userPrincipalName":"ClaudiaP@contoso.onmicrosoft.com"},{"displayName":"Cristina Gallo","userPrincipalName":"CristinaG@contoso.onmicrosoft.com"},{"displayName":"Conf Room Crystal","userPrincipalName":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","userPrincipalName":"DaisyS@contoso.onmicrosoft.com"},{"displayName":"Dastgir Refai","userPrincipalName":"DastgirR@contoso.onmicrosoft.com"},{"displayName":"Debra Berger","userPrincipalName":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","userPrincipalName":"DeliaD@contoso.onmicrosoft.com"},{"displayName":"Diego Siciliani","userPrincipalName":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","userPrincipalName":"DollyG@contoso.onmicrosoft.com"},{"displayName":"Douglas Fife","userPrincipalName":"DouglasF@contoso.onmicrosoft.com"},{"displayName":"Emily Braun","userPrincipalName":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","userPrincipalName":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","userPrincipalName":"GebhardS@contoso.onmicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Giorgia Angelo","userPrincipalName":"GiorgiaA@contoso.onmicrosoft.com"},{"displayName":"Grady Archie","userPrincipalName":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","userPrincipalName":"HannahA@contoso.onmicrosoft.com"},{"displayName":"Harry Olds","userPrincipalName":"HarryO@contoso.onmicrosoft.com"},{"displayName":"Harvey Rayford","userPrincipalName":"HarveyR@contoso.onmicrosoft.com"},{"displayName":"Helga Faber","userPrincipalName":"HelgaF@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","userPrincipalName":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","userPrincipalName":"HumaydZ@contoso.onmicrosoft.com"},{"displayName":"Irvin Sayers","userPrincipalName":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","userPrincipalName":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","userPrincipalName":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","userPrincipalName":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"},{"displayName":"Jung-Hwan Yoon","userPrincipalName":"JungY@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Kimberly Reyes","userPrincipalName":"KimberlyR@contoso.onmicrosoft.com"},{"displayName":"Lee Gu","userPrincipalName":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","userPrincipalName":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","userPrincipalName":"LinaI@contoso.onmicrosoft.com"},{"displayName":"Lynne Robbins","userPrincipalName":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","userPrincipalName":"MargieR@contoso.onmicrosoft.com"},{"displayName":"Marie Schmid","userPrincipalName":"MarieS@contoso.onmicrosoft.com"},{"displayName":"Martha Daniels","userPrincipalName":"MarthaD@contoso.onmicrosoft.com"},{"displayName":"Maya Glass","userPrincipalName":"MayaG@contoso.onmicrosoft.com"},{"displayName":"Megan Bowen","userPrincipalName":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","userPrincipalName":"MeredithV@contoso.onmicrosoft.com"},{"displayName":"Mia Fanucci","userPrincipalName":"MiaF@contoso.onmicrosoft.com"},{"displayName":"Miriam Graham","userPrincipalName":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","userPrincipalName":"MiriamS@contoso.onmicrosoft.com"},{"displayName":"Mona Schultz","userPrincipalName":"MonaS@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Myrna Casey","userPrincipalName":"MyrnaC@contoso.onmicrosoft.com"},{"displayName":"Nele Kohler","userPrincipalName":"NeleK@contoso.onmicrosoft.com"},{"displayName":"Nestor Wilke","userPrincipalName":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","userPrincipalName":"NicholasR@contoso.onmicrosoft.com"},{"displayName":"Noell Pettway","userPrincipalName":"NoellP@contoso.onmicrosoft.com"},{"displayName":"Ola Atkinson","userPrincipalName":"OlaA@contoso.onmicrosoft.com"},{"displayName":"Pam Zimmerman","userPrincipalName":"PamZ@contoso.onmicrosoft.com"},{"displayName":"Patrica Glenn","userPrincipalName":"PatricaG@contoso.onmicrosoft.com"},{"displayName":"Patti Fernandez","userPrincipalName":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","userPrincipalName":"PattyB@contoso.onmicrosoft.com"},{"displayName":"Pauline Chapman","userPrincipalName":"PaulineC@contoso.onmicrosoft.com"},{"displayName":"Pradeep Gupta","userPrincipalName":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","userPrincipalName":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","userPrincipalName":"RaulR@contoso.onmicrosoft.com"},{"displayName":"Rex Poling","userPrincipalName":"RexP@contoso.onmicrosoft.com"},{"displayName":"Rodney Rife","userPrincipalName":"RodneyR@contoso.onmicrosoft.com"},{"displayName":"Roman Fogg","userPrincipalName":"RomanF@contoso.onmicrosoft.com"},{"displayName":"Rory Brigham","userPrincipalName":"RoryB@contoso.onmicrosoft.com"},{"displayName":"Rosa Lo","userPrincipalName":"RosaL@contoso.onmicrosoft.com"},{"displayName":"Rosie Hale","userPrincipalName":"RosieH@contoso.onmicrosoft.com"},{"displayName":"Ryan Small","userPrincipalName":"RyanS@contoso.onmicrosoft.com"},{"displayName":"Santos Surratt","userPrincipalName":"SantosS@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Seung-In Jang","userPrincipalName":"SeungJ@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Simon Narvaez","userPrincipalName":"SimonN@contoso.onmicrosoft.com"},{"displayName":"Conf Room Stevens","userPrincipalName":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","userPrincipalName":"SungH@contoso.onmicrosoft.com"},{"displayName":"Teresa Sabbatini","userPrincipalName":"TeresaS@contoso.onmicrosoft.com"},{"displayName":"Young-Cheol Lim","userPrincipalName":"YoungL@contoso.onmicrosoft.com"},{"displayName":"Zachary Parsons","userPrincipalName":"ZacharyP@contoso.onmicrosoft.com"}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Aarif Sherzai","userPrincipalName":"AarifS@contoso.onmicrosoft.com"},{"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Conf Room Adams","userPrincipalName":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","userPrincipalName":"AdamW@contoso.onmicrosoft.com"},{"displayName":"Adele Vance","userPrincipalName":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","userPrincipalName":"admin@contoso.onmicrosoft.com"},{"displayName":"Adriana Napolitani","userPrincipalName":"AdrianaN@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Alex Wilber","userPrincipalName":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","userPrincipalName":"AliceL@contoso.onmicrosoft.com"},{"displayName":"Alisha Guerrero","userPrincipalName":"AlishaG@contoso.onmicrosoft.com"},{"displayName":"Allan Deyoung","userPrincipalName":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","userPrincipalName":"AnnaL@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Arif Badakhshi","userPrincipalName":"ArifB@contoso.onmicrosoft.com"},{"displayName":"Conf Room Baker","userPrincipalName":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","userPrincipalName":"BasimK@contoso.onmicrosoft.com"},{"displayName":"Betsy Drake","userPrincipalName":"BetsyD@contoso.onmicrosoft.com"},{"displayName":"Bianca Pisani","userPrincipalName":"BiancaP@contoso.onmicrosoft.com"},{"displayName":"Bianca Pagnotto","userPrincipalName":"BiancaPa@contoso.onmicrosoft.com"},{"displayName":"Brian Johnson (TAILSPIN)","userPrincipalName":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","userPrincipalName":"CameronW@contoso.onmicrosoft.com"},{"displayName":"Candy Dominguez","userPrincipalName":"CandyD@contoso.onmicrosoft.com"},{"displayName":"Caterina Costa","userPrincipalName":"CaterinaC@contoso.onmicrosoft.com"},{"displayName":"Christie Cline","userPrincipalName":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","userPrincipalName":"ChristophW@contoso.onmicrosoft.com"},{"displayName":"Clarissa Trentini","userPrincipalName":"ClarissaT@contoso.onmicrosoft.com"},{"displayName":"Claudia Pugliesi","userPrincipalName":"ClaudiaP@contoso.onmicrosoft.com"},{"displayName":"Cristina Gallo","userPrincipalName":"CristinaG@contoso.onmicrosoft.com"},{"displayName":"Conf Room Crystal","userPrincipalName":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","userPrincipalName":"DaisyS@contoso.onmicrosoft.com"},{"displayName":"Dastgir Refai","userPrincipalName":"DastgirR@contoso.onmicrosoft.com"},{"displayName":"Debra Berger","userPrincipalName":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","userPrincipalName":"DeliaD@contoso.onmicrosoft.com"},{"displayName":"Diego Siciliani","userPrincipalName":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","userPrincipalName":"DollyG@contoso.onmicrosoft.com"},{"displayName":"Douglas Fife","userPrincipalName":"DouglasF@contoso.onmicrosoft.com"},{"displayName":"Emily Braun","userPrincipalName":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","userPrincipalName":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","userPrincipalName":"GebhardS@contoso.onmicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Giorgia Angelo","userPrincipalName":"GiorgiaA@contoso.onmicrosoft.com"},{"displayName":"Grady Archie","userPrincipalName":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","userPrincipalName":"HannahA@contoso.onmicrosoft.com"},{"displayName":"Harry Olds","userPrincipalName":"HarryO@contoso.onmicrosoft.com"},{"displayName":"Harvey Rayford","userPrincipalName":"HarveyR@contoso.onmicrosoft.com"},{"displayName":"Helga Faber","userPrincipalName":"HelgaF@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","userPrincipalName":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","userPrincipalName":"HumaydZ@contoso.onmicrosoft.com"},{"displayName":"Irvin Sayers","userPrincipalName":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","userPrincipalName":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","userPrincipalName":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","userPrincipalName":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"},{"displayName":"Jung-Hwan Yoon","userPrincipalName":"JungY@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Kimberly Reyes","userPrincipalName":"KimberlyR@contoso.onmicrosoft.com"},{"displayName":"Lee Gu","userPrincipalName":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","userPrincipalName":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","userPrincipalName":"LinaI@contoso.onmicrosoft.com"},{"displayName":"Lynne Robbins","userPrincipalName":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","userPrincipalName":"MargieR@contoso.onmicrosoft.com"},{"displayName":"Marie Schmid","userPrincipalName":"MarieS@contoso.onmicrosoft.com"},{"displayName":"Martha Daniels","userPrincipalName":"MarthaD@contoso.onmicrosoft.com"},{"displayName":"Maya Glass","userPrincipalName":"MayaG@contoso.onmicrosoft.com"},{"displayName":"Megan Bowen","userPrincipalName":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","userPrincipalName":"MeredithV@contoso.onmicrosoft.com"},{"displayName":"Mia Fanucci","userPrincipalName":"MiaF@contoso.onmicrosoft.com"},{"displayName":"Miriam Graham","userPrincipalName":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","userPrincipalName":"MiriamS@contoso.onmicrosoft.com"},{"displayName":"Mona Schultz","userPrincipalName":"MonaS@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Myrna Casey","userPrincipalName":"MyrnaC@contoso.onmicrosoft.com"},{"displayName":"Nele Kohler","userPrincipalName":"NeleK@contoso.onmicrosoft.com"},{"displayName":"Nestor Wilke","userPrincipalName":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","userPrincipalName":"NicholasR@contoso.onmicrosoft.com"},{"displayName":"Noell Pettway","userPrincipalName":"NoellP@contoso.onmicrosoft.com"},{"displayName":"Ola Atkinson","userPrincipalName":"OlaA@contoso.onmicrosoft.com"},{"displayName":"Pam Zimmerman","userPrincipalName":"PamZ@contoso.onmicrosoft.com"},{"displayName":"Patrica Glenn","userPrincipalName":"PatricaG@contoso.onmicrosoft.com"},{"displayName":"Patti Fernandez","userPrincipalName":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","userPrincipalName":"PattyB@contoso.onmicrosoft.com"},{"displayName":"Pauline Chapman","userPrincipalName":"PaulineC@contoso.onmicrosoft.com"},{"displayName":"Pradeep Gupta","userPrincipalName":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","userPrincipalName":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","userPrincipalName":"RaulR@contoso.onmicrosoft.com"},{"displayName":"Rex Poling","userPrincipalName":"RexP@contoso.onmicrosoft.com"},{"displayName":"Rodney Rife","userPrincipalName":"RodneyR@contoso.onmicrosoft.com"},{"displayName":"Roman Fogg","userPrincipalName":"RomanF@contoso.onmicrosoft.com"},{"displayName":"Rory Brigham","userPrincipalName":"RoryB@contoso.onmicrosoft.com"},{"displayName":"Rosa Lo","userPrincipalName":"RosaL@contoso.onmicrosoft.com"},{"displayName":"Rosie Hale","userPrincipalName":"RosieH@contoso.onmicrosoft.com"},{"displayName":"Ryan Small","userPrincipalName":"RyanS@contoso.onmicrosoft.com"},{"displayName":"Santos Surratt","userPrincipalName":"SantosS@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Seung-In Jang","userPrincipalName":"SeungJ@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Simon Narvaez","userPrincipalName":"SimonN@contoso.onmicrosoft.com"},{"displayName":"Conf Room Stevens","userPrincipalName":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","userPrincipalName":"SungH@contoso.onmicrosoft.com"},{"displayName":"Teresa Sabbatini","userPrincipalName":"TeresaS@contoso.onmicrosoft.com"},{"displayName":"Young-Cheol Lim","userPrincipalName":"YoungL@contoso.onmicrosoft.com"},{"displayName":"Zachary Parsons","userPrincipalName":"ZacharyP@contoso.onmicrosoft.com"}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('lists users in the tenant with the default properties (debug)', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Aarif Sherzai","userPrincipalName":"AarifS@contoso.onmicrosoft.com"},{"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Conf Room Adams","userPrincipalName":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","userPrincipalName":"AdamW@contoso.onmicrosoft.com"},{"displayName":"Adele Vance","userPrincipalName":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","userPrincipalName":"admin@contoso.onmicrosoft.com"},{"displayName":"Adriana Napolitani","userPrincipalName":"AdrianaN@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Alex Wilber","userPrincipalName":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","userPrincipalName":"AliceL@contoso.onmicrosoft.com"},{"displayName":"Alisha Guerrero","userPrincipalName":"AlishaG@contoso.onmicrosoft.com"},{"displayName":"Allan Deyoung","userPrincipalName":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","userPrincipalName":"AnnaL@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Arif Badakhshi","userPrincipalName":"ArifB@contoso.onmicrosoft.com"},{"displayName":"Conf Room Baker","userPrincipalName":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","userPrincipalName":"BasimK@contoso.onmicrosoft.com"},{"displayName":"Betsy Drake","userPrincipalName":"BetsyD@contoso.onmicrosoft.com"},{"displayName":"Bianca Pisani","userPrincipalName":"BiancaP@contoso.onmicrosoft.com"},{"displayName":"Bianca Pagnotto","userPrincipalName":"BiancaPa@contoso.onmicrosoft.com"},{"displayName":"Brian Johnson (TAILSPIN)","userPrincipalName":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","userPrincipalName":"CameronW@contoso.onmicrosoft.com"},{"displayName":"Candy Dominguez","userPrincipalName":"CandyD@contoso.onmicrosoft.com"},{"displayName":"Caterina Costa","userPrincipalName":"CaterinaC@contoso.onmicrosoft.com"},{"displayName":"Christie Cline","userPrincipalName":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","userPrincipalName":"ChristophW@contoso.onmicrosoft.com"},{"displayName":"Clarissa Trentini","userPrincipalName":"ClarissaT@contoso.onmicrosoft.com"},{"displayName":"Claudia Pugliesi","userPrincipalName":"ClaudiaP@contoso.onmicrosoft.com"},{"displayName":"Cristina Gallo","userPrincipalName":"CristinaG@contoso.onmicrosoft.com"},{"displayName":"Conf Room Crystal","userPrincipalName":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","userPrincipalName":"DaisyS@contoso.onmicrosoft.com"},{"displayName":"Dastgir Refai","userPrincipalName":"DastgirR@contoso.onmicrosoft.com"},{"displayName":"Debra Berger","userPrincipalName":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","userPrincipalName":"DeliaD@contoso.onmicrosoft.com"},{"displayName":"Diego Siciliani","userPrincipalName":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","userPrincipalName":"DollyG@contoso.onmicrosoft.com"},{"displayName":"Douglas Fife","userPrincipalName":"DouglasF@contoso.onmicrosoft.com"},{"displayName":"Emily Braun","userPrincipalName":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","userPrincipalName":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","userPrincipalName":"GebhardS@contoso.onmicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Giorgia Angelo","userPrincipalName":"GiorgiaA@contoso.onmicrosoft.com"},{"displayName":"Grady Archie","userPrincipalName":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","userPrincipalName":"HannahA@contoso.onmicrosoft.com"},{"displayName":"Harry Olds","userPrincipalName":"HarryO@contoso.onmicrosoft.com"},{"displayName":"Harvey Rayford","userPrincipalName":"HarveyR@contoso.onmicrosoft.com"},{"displayName":"Helga Faber","userPrincipalName":"HelgaF@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","userPrincipalName":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","userPrincipalName":"HumaydZ@contoso.onmicrosoft.com"},{"displayName":"Irvin Sayers","userPrincipalName":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","userPrincipalName":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","userPrincipalName":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","userPrincipalName":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"},{"displayName":"Jung-Hwan Yoon","userPrincipalName":"JungY@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Kimberly Reyes","userPrincipalName":"KimberlyR@contoso.onmicrosoft.com"},{"displayName":"Lee Gu","userPrincipalName":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","userPrincipalName":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","userPrincipalName":"LinaI@contoso.onmicrosoft.com"},{"displayName":"Lynne Robbins","userPrincipalName":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","userPrincipalName":"MargieR@contoso.onmicrosoft.com"},{"displayName":"Marie Schmid","userPrincipalName":"MarieS@contoso.onmicrosoft.com"},{"displayName":"Martha Daniels","userPrincipalName":"MarthaD@contoso.onmicrosoft.com"},{"displayName":"Maya Glass","userPrincipalName":"MayaG@contoso.onmicrosoft.com"},{"displayName":"Megan Bowen","userPrincipalName":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","userPrincipalName":"MeredithV@contoso.onmicrosoft.com"},{"displayName":"Mia Fanucci","userPrincipalName":"MiaF@contoso.onmicrosoft.com"},{"displayName":"Miriam Graham","userPrincipalName":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","userPrincipalName":"MiriamS@contoso.onmicrosoft.com"},{"displayName":"Mona Schultz","userPrincipalName":"MonaS@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Myrna Casey","userPrincipalName":"MyrnaC@contoso.onmicrosoft.com"},{"displayName":"Nele Kohler","userPrincipalName":"NeleK@contoso.onmicrosoft.com"},{"displayName":"Nestor Wilke","userPrincipalName":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","userPrincipalName":"NicholasR@contoso.onmicrosoft.com"},{"displayName":"Noell Pettway","userPrincipalName":"NoellP@contoso.onmicrosoft.com"},{"displayName":"Ola Atkinson","userPrincipalName":"OlaA@contoso.onmicrosoft.com"},{"displayName":"Pam Zimmerman","userPrincipalName":"PamZ@contoso.onmicrosoft.com"},{"displayName":"Patrica Glenn","userPrincipalName":"PatricaG@contoso.onmicrosoft.com"},{"displayName":"Patti Fernandez","userPrincipalName":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","userPrincipalName":"PattyB@contoso.onmicrosoft.com"},{"displayName":"Pauline Chapman","userPrincipalName":"PaulineC@contoso.onmicrosoft.com"},{"displayName":"Pradeep Gupta","userPrincipalName":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","userPrincipalName":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","userPrincipalName":"RaulR@contoso.onmicrosoft.com"},{"displayName":"Rex Poling","userPrincipalName":"RexP@contoso.onmicrosoft.com"},{"displayName":"Rodney Rife","userPrincipalName":"RodneyR@contoso.onmicrosoft.com"},{"displayName":"Roman Fogg","userPrincipalName":"RomanF@contoso.onmicrosoft.com"},{"displayName":"Rory Brigham","userPrincipalName":"RoryB@contoso.onmicrosoft.com"},{"displayName":"Rosa Lo","userPrincipalName":"RosaL@contoso.onmicrosoft.com"},{"displayName":"Rosie Hale","userPrincipalName":"RosieH@contoso.onmicrosoft.com"},{"displayName":"Ryan Small","userPrincipalName":"RyanS@contoso.onmicrosoft.com"},{"displayName":"Santos Surratt","userPrincipalName":"SantosS@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Seung-In Jang","userPrincipalName":"SeungJ@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Simon Narvaez","userPrincipalName":"SimonN@contoso.onmicrosoft.com"},{"displayName":"Conf Room Stevens","userPrincipalName":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","userPrincipalName":"SungH@contoso.onmicrosoft.com"},{"displayName":"Teresa Sabbatini","userPrincipalName":"TeresaS@contoso.onmicrosoft.com"},{"displayName":"Young-Cheol Lim","userPrincipalName":"YoungL@contoso.onmicrosoft.com"},{"displayName":"Zachary Parsons","userPrincipalName":"ZacharyP@contoso.onmicrosoft.com"}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: true } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Aarif Sherzai","userPrincipalName":"AarifS@contoso.onmicrosoft.com"},{"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Conf Room Adams","userPrincipalName":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","userPrincipalName":"AdamW@contoso.onmicrosoft.com"},{"displayName":"Adele Vance","userPrincipalName":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","userPrincipalName":"admin@contoso.onmicrosoft.com"},{"displayName":"Adriana Napolitani","userPrincipalName":"AdrianaN@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Alex Wilber","userPrincipalName":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","userPrincipalName":"AliceL@contoso.onmicrosoft.com"},{"displayName":"Alisha Guerrero","userPrincipalName":"AlishaG@contoso.onmicrosoft.com"},{"displayName":"Allan Deyoung","userPrincipalName":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","userPrincipalName":"AnnaL@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Arif Badakhshi","userPrincipalName":"ArifB@contoso.onmicrosoft.com"},{"displayName":"Conf Room Baker","userPrincipalName":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","userPrincipalName":"BasimK@contoso.onmicrosoft.com"},{"displayName":"Betsy Drake","userPrincipalName":"BetsyD@contoso.onmicrosoft.com"},{"displayName":"Bianca Pisani","userPrincipalName":"BiancaP@contoso.onmicrosoft.com"},{"displayName":"Bianca Pagnotto","userPrincipalName":"BiancaPa@contoso.onmicrosoft.com"},{"displayName":"Brian Johnson (TAILSPIN)","userPrincipalName":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","userPrincipalName":"CameronW@contoso.onmicrosoft.com"},{"displayName":"Candy Dominguez","userPrincipalName":"CandyD@contoso.onmicrosoft.com"},{"displayName":"Caterina Costa","userPrincipalName":"CaterinaC@contoso.onmicrosoft.com"},{"displayName":"Christie Cline","userPrincipalName":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","userPrincipalName":"ChristophW@contoso.onmicrosoft.com"},{"displayName":"Clarissa Trentini","userPrincipalName":"ClarissaT@contoso.onmicrosoft.com"},{"displayName":"Claudia Pugliesi","userPrincipalName":"ClaudiaP@contoso.onmicrosoft.com"},{"displayName":"Cristina Gallo","userPrincipalName":"CristinaG@contoso.onmicrosoft.com"},{"displayName":"Conf Room Crystal","userPrincipalName":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","userPrincipalName":"DaisyS@contoso.onmicrosoft.com"},{"displayName":"Dastgir Refai","userPrincipalName":"DastgirR@contoso.onmicrosoft.com"},{"displayName":"Debra Berger","userPrincipalName":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","userPrincipalName":"DeliaD@contoso.onmicrosoft.com"},{"displayName":"Diego Siciliani","userPrincipalName":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","userPrincipalName":"DollyG@contoso.onmicrosoft.com"},{"displayName":"Douglas Fife","userPrincipalName":"DouglasF@contoso.onmicrosoft.com"},{"displayName":"Emily Braun","userPrincipalName":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","userPrincipalName":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","userPrincipalName":"GebhardS@contoso.onmicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Giorgia Angelo","userPrincipalName":"GiorgiaA@contoso.onmicrosoft.com"},{"displayName":"Grady Archie","userPrincipalName":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","userPrincipalName":"HannahA@contoso.onmicrosoft.com"},{"displayName":"Harry Olds","userPrincipalName":"HarryO@contoso.onmicrosoft.com"},{"displayName":"Harvey Rayford","userPrincipalName":"HarveyR@contoso.onmicrosoft.com"},{"displayName":"Helga Faber","userPrincipalName":"HelgaF@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","userPrincipalName":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","userPrincipalName":"HumaydZ@contoso.onmicrosoft.com"},{"displayName":"Irvin Sayers","userPrincipalName":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","userPrincipalName":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","userPrincipalName":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","userPrincipalName":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"},{"displayName":"Jung-Hwan Yoon","userPrincipalName":"JungY@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Kimberly Reyes","userPrincipalName":"KimberlyR@contoso.onmicrosoft.com"},{"displayName":"Lee Gu","userPrincipalName":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","userPrincipalName":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","userPrincipalName":"LinaI@contoso.onmicrosoft.com"},{"displayName":"Lynne Robbins","userPrincipalName":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","userPrincipalName":"MargieR@contoso.onmicrosoft.com"},{"displayName":"Marie Schmid","userPrincipalName":"MarieS@contoso.onmicrosoft.com"},{"displayName":"Martha Daniels","userPrincipalName":"MarthaD@contoso.onmicrosoft.com"},{"displayName":"Maya Glass","userPrincipalName":"MayaG@contoso.onmicrosoft.com"},{"displayName":"Megan Bowen","userPrincipalName":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","userPrincipalName":"MeredithV@contoso.onmicrosoft.com"},{"displayName":"Mia Fanucci","userPrincipalName":"MiaF@contoso.onmicrosoft.com"},{"displayName":"Miriam Graham","userPrincipalName":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","userPrincipalName":"MiriamS@contoso.onmicrosoft.com"},{"displayName":"Mona Schultz","userPrincipalName":"MonaS@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Myrna Casey","userPrincipalName":"MyrnaC@contoso.onmicrosoft.com"},{"displayName":"Nele Kohler","userPrincipalName":"NeleK@contoso.onmicrosoft.com"},{"displayName":"Nestor Wilke","userPrincipalName":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","userPrincipalName":"NicholasR@contoso.onmicrosoft.com"},{"displayName":"Noell Pettway","userPrincipalName":"NoellP@contoso.onmicrosoft.com"},{"displayName":"Ola Atkinson","userPrincipalName":"OlaA@contoso.onmicrosoft.com"},{"displayName":"Pam Zimmerman","userPrincipalName":"PamZ@contoso.onmicrosoft.com"},{"displayName":"Patrica Glenn","userPrincipalName":"PatricaG@contoso.onmicrosoft.com"},{"displayName":"Patti Fernandez","userPrincipalName":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","userPrincipalName":"PattyB@contoso.onmicrosoft.com"},{"displayName":"Pauline Chapman","userPrincipalName":"PaulineC@contoso.onmicrosoft.com"},{"displayName":"Pradeep Gupta","userPrincipalName":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","userPrincipalName":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","userPrincipalName":"RaulR@contoso.onmicrosoft.com"},{"displayName":"Rex Poling","userPrincipalName":"RexP@contoso.onmicrosoft.com"},{"displayName":"Rodney Rife","userPrincipalName":"RodneyR@contoso.onmicrosoft.com"},{"displayName":"Roman Fogg","userPrincipalName":"RomanF@contoso.onmicrosoft.com"},{"displayName":"Rory Brigham","userPrincipalName":"RoryB@contoso.onmicrosoft.com"},{"displayName":"Rosa Lo","userPrincipalName":"RosaL@contoso.onmicrosoft.com"},{"displayName":"Rosie Hale","userPrincipalName":"RosieH@contoso.onmicrosoft.com"},{"displayName":"Ryan Small","userPrincipalName":"RyanS@contoso.onmicrosoft.com"},{"displayName":"Santos Surratt","userPrincipalName":"SantosS@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Seung-In Jang","userPrincipalName":"SeungJ@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Simon Narvaez","userPrincipalName":"SimonN@contoso.onmicrosoft.com"},{"displayName":"Conf Room Stevens","userPrincipalName":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","userPrincipalName":"SungH@contoso.onmicrosoft.com"},{"displayName":"Teresa Sabbatini","userPrincipalName":"TeresaS@contoso.onmicrosoft.com"},{"displayName":"Young-Cheol Lim","userPrincipalName":"YoungL@contoso.onmicrosoft.com"},{"displayName":"Zachary Parsons","userPrincipalName":"ZacharyP@contoso.onmicrosoft.com"}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves only the specified user property', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=displayName&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Aarif Sherzai"},{"displayName":"Achim Maier"},{"displayName":"Conf Room Adams"},{"displayName":"Adam Wallen"},{"displayName":"Adele Vance"},{"displayName":"MOD Administrator"},{"displayName":"Adriana Napolitani"},{"displayName":"Aldo Muller"},{"displayName":"Alex Wilber"},{"displayName":"Alice Lucchese"},{"displayName":"Alisha Guerrero"},{"displayName":"Allan Deyoung"},{"displayName":"Anna Lange"},{"displayName":"Anne Matthews"},{"displayName":"Arif Badakhshi"},{"displayName":"Conf Room Baker"},{"displayName":"Basim Karzai"},{"displayName":"Betsy Drake"},{"displayName":"Bianca Pisani"},{"displayName":"Bianca Pagnotto"},{"displayName":"Brian Johnson (TAILSPIN)"},{"displayName":"Cameron White"},{"displayName":"Candy Dominguez"},{"displayName":"Caterina Costa"},{"displayName":"Christie Cline"},{"displayName":"Christoph Werner"},{"displayName":"Clarissa Trentini"},{"displayName":"Claudia Pugliesi"},{"displayName":"Cristina Gallo"},{"displayName":"Conf Room Crystal"},{"displayName":"Daisy Sherman"},{"displayName":"Dastgir Refai"},{"displayName":"Debra Berger"},{"displayName":"Delia Dennis"},{"displayName":"Diego Siciliani"},{"displayName":"Dolly Golden"},{"displayName":"Douglas Fife"},{"displayName":"Emily Braun"},{"displayName":"Enrico Cattaneo"},{"displayName":"Gebhard Stein"},{"displayName":"Gerhart Moller"},{"displayName":"Giorgia Angelo"},{"displayName":"Grady Archie"},{"displayName":"Hannah Albrecht"},{"displayName":"Harry Olds"},{"displayName":"Harvey Rayford"},{"displayName":"Helga Faber"},{"displayName":"Henrietta Mueller"},{"displayName":"Conf Room Hood"},{"displayName":"Humayd Zaher"},{"displayName":"Irvin Sayers"},{"displayName":"Isaiah Langer"},{"displayName":"Johanna Lorenz"},{"displayName":"Joni Sherman"},{"displayName":"Jordan Miller"},{"displayName":"Joshua Murphy"},{"displayName":"Jung-Hwan Yoon"},{"displayName":"Karl Matteson"},{"displayName":"Kimberly Reyes"},{"displayName":"Lee Gu"},{"displayName":"Lidia Holloway"},{"displayName":"Lina Iadanza"},{"displayName":"Lynne Robbins"},{"displayName":"Margie Riley"},{"displayName":"Marie Schmid"},{"displayName":"Martha Daniels"},{"displayName":"Maya Glass"},{"displayName":"Megan Bowen"},{"displayName":"Meredith Valdez"},{"displayName":"Mia Fanucci"},{"displayName":"Miriam Graham"},{"displayName":"Miriam Schultz"},{"displayName":"Mona Schultz"},{"displayName":"Moses McIntosh"},{"displayName":"Myrna Casey"},{"displayName":"Nele Kohler"},{"displayName":"Nestor Wilke"},{"displayName":"Nicholas Rose"},{"displayName":"Noell Pettway"},{"displayName":"Ola Atkinson"},{"displayName":"Pam Zimmerman"},{"displayName":"Patrica Glenn"},{"displayName":"Patti Fernandez"},{"displayName":"Patty Brock"},{"displayName":"Pauline Chapman"},{"displayName":"Pradeep Gupta"},{"displayName":"Conf Room Rainier"},{"displayName":"Raul Razo"},{"displayName":"Rex Poling"},{"displayName":"Rodney Rife"},{"displayName":"Roman Fogg"},{"displayName":"Rory Brigham"},{"displayName":"Rosa Lo"},{"displayName":"Rosie Hale"},{"displayName":"Ryan Small"},{"displayName":"Santos Surratt"},{"displayName":"Sara Mazzanti"},{"displayName":"Seung-In Jang"},{"displayName":"Shannon Mazza"},{"displayName":"Silvia Milani"},{"displayName":"Simon Narvaez"},{"displayName":"Conf Room Stevens"},{"displayName":"Sung-Hwan Han"},{"displayName":"Teresa Sabbatini"},{"displayName":"Young-Cheol Lim"},{"displayName":"Zachary Parsons"}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false, properties: 'displayName' } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Aarif Sherzai"},{"displayName":"Achim Maier"},{"displayName":"Conf Room Adams"},{"displayName":"Adam Wallen"},{"displayName":"Adele Vance"},{"displayName":"MOD Administrator"},{"displayName":"Adriana Napolitani"},{"displayName":"Aldo Muller"},{"displayName":"Alex Wilber"},{"displayName":"Alice Lucchese"},{"displayName":"Alisha Guerrero"},{"displayName":"Allan Deyoung"},{"displayName":"Anna Lange"},{"displayName":"Anne Matthews"},{"displayName":"Arif Badakhshi"},{"displayName":"Conf Room Baker"},{"displayName":"Basim Karzai"},{"displayName":"Betsy Drake"},{"displayName":"Bianca Pisani"},{"displayName":"Bianca Pagnotto"},{"displayName":"Brian Johnson (TAILSPIN)"},{"displayName":"Cameron White"},{"displayName":"Candy Dominguez"},{"displayName":"Caterina Costa"},{"displayName":"Christie Cline"},{"displayName":"Christoph Werner"},{"displayName":"Clarissa Trentini"},{"displayName":"Claudia Pugliesi"},{"displayName":"Cristina Gallo"},{"displayName":"Conf Room Crystal"},{"displayName":"Daisy Sherman"},{"displayName":"Dastgir Refai"},{"displayName":"Debra Berger"},{"displayName":"Delia Dennis"},{"displayName":"Diego Siciliani"},{"displayName":"Dolly Golden"},{"displayName":"Douglas Fife"},{"displayName":"Emily Braun"},{"displayName":"Enrico Cattaneo"},{"displayName":"Gebhard Stein"},{"displayName":"Gerhart Moller"},{"displayName":"Giorgia Angelo"},{"displayName":"Grady Archie"},{"displayName":"Hannah Albrecht"},{"displayName":"Harry Olds"},{"displayName":"Harvey Rayford"},{"displayName":"Helga Faber"},{"displayName":"Henrietta Mueller"},{"displayName":"Conf Room Hood"},{"displayName":"Humayd Zaher"},{"displayName":"Irvin Sayers"},{"displayName":"Isaiah Langer"},{"displayName":"Johanna Lorenz"},{"displayName":"Joni Sherman"},{"displayName":"Jordan Miller"},{"displayName":"Joshua Murphy"},{"displayName":"Jung-Hwan Yoon"},{"displayName":"Karl Matteson"},{"displayName":"Kimberly Reyes"},{"displayName":"Lee Gu"},{"displayName":"Lidia Holloway"},{"displayName":"Lina Iadanza"},{"displayName":"Lynne Robbins"},{"displayName":"Margie Riley"},{"displayName":"Marie Schmid"},{"displayName":"Martha Daniels"},{"displayName":"Maya Glass"},{"displayName":"Megan Bowen"},{"displayName":"Meredith Valdez"},{"displayName":"Mia Fanucci"},{"displayName":"Miriam Graham"},{"displayName":"Miriam Schultz"},{"displayName":"Mona Schultz"},{"displayName":"Moses McIntosh"},{"displayName":"Myrna Casey"},{"displayName":"Nele Kohler"},{"displayName":"Nestor Wilke"},{"displayName":"Nicholas Rose"},{"displayName":"Noell Pettway"},{"displayName":"Ola Atkinson"},{"displayName":"Pam Zimmerman"},{"displayName":"Patrica Glenn"},{"displayName":"Patti Fernandez"},{"displayName":"Patty Brock"},{"displayName":"Pauline Chapman"},{"displayName":"Pradeep Gupta"},{"displayName":"Conf Room Rainier"},{"displayName":"Raul Razo"},{"displayName":"Rex Poling"},{"displayName":"Rodney Rife"},{"displayName":"Roman Fogg"},{"displayName":"Rory Brigham"},{"displayName":"Rosa Lo"},{"displayName":"Rosie Hale"},{"displayName":"Ryan Small"},{"displayName":"Santos Surratt"},{"displayName":"Sara Mazzanti"},{"displayName":"Seung-In Jang"},{"displayName":"Shannon Mazza"},{"displayName":"Silvia Milani"},{"displayName":"Simon Narvaez"},{"displayName":"Conf Room Stevens"},{"displayName":"Sung-Hwan Han"},{"displayName":"Teresa Sabbatini"},{"displayName":"Young-Cheol Lim"},{"displayName":"Zachary Parsons"}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves only the specified user properties', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=displayName,mail&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Aarif Sherzai","mail":null},{"displayName":"Achim Maier","mail":null},{"displayName":"Conf Room Adams","mail":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","mail":null},{"displayName":"Adele Vance","mail":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","mail":"admin@contoso.OnMicrosoft.com"},{"displayName":"Adriana Napolitani","mail":null},{"displayName":"Aldo Muller","mail":null},{"displayName":"Alex Wilber","mail":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","mail":null},{"displayName":"Alisha Guerrero","mail":null},{"displayName":"Allan Deyoung","mail":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","mail":null},{"displayName":"Anne Matthews","mail":null},{"displayName":"Arif Badakhshi","mail":null},{"displayName":"Conf Room Baker","mail":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","mail":null},{"displayName":"Betsy Drake","mail":null},{"displayName":"Bianca Pisani","mail":null},{"displayName":"Bianca Pagnotto","mail":null},{"displayName":"Brian Johnson (TAILSPIN)","mail":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","mail":null},{"displayName":"Candy Dominguez","mail":null},{"displayName":"Caterina Costa","mail":null},{"displayName":"Christie Cline","mail":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","mail":null},{"displayName":"Clarissa Trentini","mail":null},{"displayName":"Claudia Pugliesi","mail":null},{"displayName":"Cristina Gallo","mail":null},{"displayName":"Conf Room Crystal","mail":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","mail":null},{"displayName":"Dastgir Refai","mail":null},{"displayName":"Debra Berger","mail":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","mail":null},{"displayName":"Diego Siciliani","mail":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","mail":null},{"displayName":"Douglas Fife","mail":null},{"displayName":"Emily Braun","mail":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","mail":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","mail":null},{"displayName":"Gerhart Moller","mail":null},{"displayName":"Giorgia Angelo","mail":null},{"displayName":"Grady Archie","mail":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","mail":null},{"displayName":"Harry Olds","mail":null},{"displayName":"Harvey Rayford","mail":null},{"displayName":"Helga Faber","mail":null},{"displayName":"Henrietta Mueller","mail":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","mail":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","mail":null},{"displayName":"Irvin Sayers","mail":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","mail":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","mail":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","mail":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","mail":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","mail":null},{"displayName":"Jung-Hwan Yoon","mail":null},{"displayName":"Karl Matteson","mail":null},{"displayName":"Kimberly Reyes","mail":null},{"displayName":"Lee Gu","mail":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","mail":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","mail":null},{"displayName":"Lynne Robbins","mail":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","mail":null},{"displayName":"Marie Schmid","mail":null},{"displayName":"Martha Daniels","mail":null},{"displayName":"Maya Glass","mail":null},{"displayName":"Megan Bowen","mail":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","mail":null},{"displayName":"Mia Fanucci","mail":null},{"displayName":"Miriam Graham","mail":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","mail":null},{"displayName":"Mona Schultz","mail":null},{"displayName":"Moses McIntosh","mail":null},{"displayName":"Myrna Casey","mail":null},{"displayName":"Nele Kohler","mail":null},{"displayName":"Nestor Wilke","mail":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","mail":null},{"displayName":"Noell Pettway","mail":null},{"displayName":"Ola Atkinson","mail":null},{"displayName":"Pam Zimmerman","mail":null},{"displayName":"Patrica Glenn","mail":null},{"displayName":"Patti Fernandez","mail":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","mail":null},{"displayName":"Pauline Chapman","mail":null},{"displayName":"Pradeep Gupta","mail":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","mail":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","mail":null},{"displayName":"Rex Poling","mail":null},{"displayName":"Rodney Rife","mail":null},{"displayName":"Roman Fogg","mail":null},{"displayName":"Rory Brigham","mail":null},{"displayName":"Rosa Lo","mail":null},{"displayName":"Rosie Hale","mail":null},{"displayName":"Ryan Small","mail":null},{"displayName":"Santos Surratt","mail":null},{"displayName":"Sara Mazzanti","mail":null},{"displayName":"Seung-In Jang","mail":null},{"displayName":"Shannon Mazza","mail":null},{"displayName":"Silvia Milani","mail":null},{"displayName":"Simon Narvaez","mail":null},{"displayName":"Conf Room Stevens","mail":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","mail":null},{"displayName":"Teresa Sabbatini","mail":null},{"displayName":"Young-Cheol Lim","mail":null},{"displayName":"Zachary Parsons","mail":null}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false, properties: 'displayName,mail' } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Aarif Sherzai","mail":null},{"displayName":"Achim Maier","mail":null},{"displayName":"Conf Room Adams","mail":"Adams@contoso.onmicrosoft.com"},{"displayName":"Adam Wallen","mail":null},{"displayName":"Adele Vance","mail":"AdeleV@contoso.OnMicrosoft.com"},{"displayName":"MOD Administrator","mail":"admin@contoso.OnMicrosoft.com"},{"displayName":"Adriana Napolitani","mail":null},{"displayName":"Aldo Muller","mail":null},{"displayName":"Alex Wilber","mail":"AlexW@contoso.OnMicrosoft.com"},{"displayName":"Alice Lucchese","mail":null},{"displayName":"Alisha Guerrero","mail":null},{"displayName":"Allan Deyoung","mail":"AllanD@contoso.OnMicrosoft.com"},{"displayName":"Anna Lange","mail":null},{"displayName":"Anne Matthews","mail":null},{"displayName":"Arif Badakhshi","mail":null},{"displayName":"Conf Room Baker","mail":"Baker@contoso.onmicrosoft.com"},{"displayName":"Basim Karzai","mail":null},{"displayName":"Betsy Drake","mail":null},{"displayName":"Bianca Pisani","mail":null},{"displayName":"Bianca Pagnotto","mail":null},{"displayName":"Brian Johnson (TAILSPIN)","mail":"BrianJ@contoso.onmicrosoft.com"},{"displayName":"Cameron White","mail":null},{"displayName":"Candy Dominguez","mail":null},{"displayName":"Caterina Costa","mail":null},{"displayName":"Christie Cline","mail":"ChristieC@contoso.OnMicrosoft.com"},{"displayName":"Christoph Werner","mail":null},{"displayName":"Clarissa Trentini","mail":null},{"displayName":"Claudia Pugliesi","mail":null},{"displayName":"Cristina Gallo","mail":null},{"displayName":"Conf Room Crystal","mail":"Crystal@contoso.onmicrosoft.com"},{"displayName":"Daisy Sherman","mail":null},{"displayName":"Dastgir Refai","mail":null},{"displayName":"Debra Berger","mail":"DebraB@contoso.OnMicrosoft.com"},{"displayName":"Delia Dennis","mail":null},{"displayName":"Diego Siciliani","mail":"DiegoS@contoso.OnMicrosoft.com"},{"displayName":"Dolly Golden","mail":null},{"displayName":"Douglas Fife","mail":null},{"displayName":"Emily Braun","mail":"EmilyB@contoso.OnMicrosoft.com"},{"displayName":"Enrico Cattaneo","mail":"EnricoC@contoso.OnMicrosoft.com"},{"displayName":"Gebhard Stein","mail":null},{"displayName":"Gerhart Moller","mail":null},{"displayName":"Giorgia Angelo","mail":null},{"displayName":"Grady Archie","mail":"GradyA@contoso.OnMicrosoft.com"},{"displayName":"Hannah Albrecht","mail":null},{"displayName":"Harry Olds","mail":null},{"displayName":"Harvey Rayford","mail":null},{"displayName":"Helga Faber","mail":null},{"displayName":"Henrietta Mueller","mail":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Hood","mail":"Hood@contoso.onmicrosoft.com"},{"displayName":"Humayd Zaher","mail":null},{"displayName":"Irvin Sayers","mail":"IrvinS@contoso.OnMicrosoft.com"},{"displayName":"Isaiah Langer","mail":"IsaiahL@contoso.OnMicrosoft.com"},{"displayName":"Johanna Lorenz","mail":"JohannaL@contoso.OnMicrosoft.com"},{"displayName":"Joni Sherman","mail":"JoniS@contoso.OnMicrosoft.com"},{"displayName":"Jordan Miller","mail":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Joshua Murphy","mail":null},{"displayName":"Jung-Hwan Yoon","mail":null},{"displayName":"Karl Matteson","mail":null},{"displayName":"Kimberly Reyes","mail":null},{"displayName":"Lee Gu","mail":"LeeG@contoso.OnMicrosoft.com"},{"displayName":"Lidia Holloway","mail":"LidiaH@contoso.OnMicrosoft.com"},{"displayName":"Lina Iadanza","mail":null},{"displayName":"Lynne Robbins","mail":"LynneR@contoso.OnMicrosoft.com"},{"displayName":"Margie Riley","mail":null},{"displayName":"Marie Schmid","mail":null},{"displayName":"Martha Daniels","mail":null},{"displayName":"Maya Glass","mail":null},{"displayName":"Megan Bowen","mail":"MeganB@contoso.OnMicrosoft.com"},{"displayName":"Meredith Valdez","mail":null},{"displayName":"Mia Fanucci","mail":null},{"displayName":"Miriam Graham","mail":"MiriamG@contoso.OnMicrosoft.com"},{"displayName":"Miriam Schultz","mail":null},{"displayName":"Mona Schultz","mail":null},{"displayName":"Moses McIntosh","mail":null},{"displayName":"Myrna Casey","mail":null},{"displayName":"Nele Kohler","mail":null},{"displayName":"Nestor Wilke","mail":"NestorW@contoso.OnMicrosoft.com"},{"displayName":"Nicholas Rose","mail":null},{"displayName":"Noell Pettway","mail":null},{"displayName":"Ola Atkinson","mail":null},{"displayName":"Pam Zimmerman","mail":null},{"displayName":"Patrica Glenn","mail":null},{"displayName":"Patti Fernandez","mail":"PattiF@contoso.OnMicrosoft.com"},{"displayName":"Patty Brock","mail":null},{"displayName":"Pauline Chapman","mail":null},{"displayName":"Pradeep Gupta","mail":"PradeepG@contoso.OnMicrosoft.com"},{"displayName":"Conf Room Rainier","mail":"Rainier@contoso.onmicrosoft.com"},{"displayName":"Raul Razo","mail":null},{"displayName":"Rex Poling","mail":null},{"displayName":"Rodney Rife","mail":null},{"displayName":"Roman Fogg","mail":null},{"displayName":"Rory Brigham","mail":null},{"displayName":"Rosa Lo","mail":null},{"displayName":"Rosie Hale","mail":null},{"displayName":"Ryan Small","mail":null},{"displayName":"Santos Surratt","mail":null},{"displayName":"Sara Mazzanti","mail":null},{"displayName":"Seung-In Jang","mail":null},{"displayName":"Shannon Mazza","mail":null},{"displayName":"Silvia Milani","mail":null},{"displayName":"Simon Narvaez","mail":null},{"displayName":"Conf Room Stevens","mail":"Stevens@contoso.onmicrosoft.com"},{"displayName":"Sung-Hwan Han","mail":null},{"displayName":"Teresa Sabbatini","mail":null},{"displayName":"Young-Cheol Lim","mail":null},{"displayName":"Zachary Parsons","mail":null}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('filters users by one property', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$filter=startsWith(surname, 'M')&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false, surname: 'M' } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Karl Matteson","userPrincipalName":"KarlM@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Shannon Mazza","userPrincipalName":"ShannonM@contoso.onmicrosoft.com"},{"displayName":"Sara Mazzanti","userPrincipalName":"SaraM@contoso.onmicrosoft.com"},{"displayName":"Moses McIntosh","userPrincipalName":"MosesM@contoso.onmicrosoft.com"},{"displayName":"Silvia Milani","userPrincipalName":"SilviaM@contoso.onmicrosoft.com"},{"displayName":"Jordan Miller","userPrincipalName":"JordanM@contoso.OnMicrosoft.com"},{"displayName":"Gerhart Moller","userPrincipalName":"GerhartM@contoso.onmicrosoft.com"},{"displayName":"Henrietta Mueller","userPrincipalName":"HenriettaM@contoso.OnMicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"},{"displayName":"Joshua Murphy","userPrincipalName":"JoshuaM@contoso.onmicrosoft.com"}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('filters users by multiple properties', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$filter=startsWith(surname, 'M') and startsWith(givenName, 'A')&$top=100`) {
        return Promise.resolve({
          "value": [
            {"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"}
          ]});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false, surname: 'M', givenName: 'A' } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([
          {"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"},{"displayName":"Anne Matthews","userPrincipalName":"AnneM@contoso.onmicrosoft.com"},{"displayName":"Aldo Muller","userPrincipalName":"AldoM@contoso.onmicrosoft.com"}
        ]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('escapes special characters in filters', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$filter=startsWith(displayName, 'O''Brien')&$top=100`) {
        return Promise.resolve({
          "value": []});
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false, displayName: 'O\'Brien' } }, () => {
      try {
        assert(cmdInstanceLogSpy.calledWith([]));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('handles error when retrieving second page of users', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$top=100`) {
        return Promise.resolve({
          "@odata.nextLink": "https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$top=100&$top=100&$skiptoken=X%2744537074090001000000000000000014000000C233BFA08475B84E8BF8C40335F8944D01000000000000000000000000000017312E322E3834302E3131333535362E312E342E32333331020000000000017D06501DC4C194438D57CFE494F81C1E%27",
          "value": [
            {"displayName":"Aarif Sherzai","userPrincipalName":"AarifS@contoso.onmicrosoft.com"},{"displayName":"Achim Maier","userPrincipalName":"AchimM@contoso.onmicrosoft.com"}
          ]});
      }

      if (opts.url === `https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,displayName&$top=100&$top=100&$skiptoken=X%2744537074090001000000000000000014000000C233BFA08475B84E8BF8C40335F8944D01000000000000000000000000000017312E322E3834302E3131333535362E312E342E32333331020000000000017D06501DC4C194438D57CFE494F81C1E%27`) {
        return Promise.reject('An error has occurred');
      }

      return Promise.reject('Invalid request');
    });

    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: false } }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('An error has occurred')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('allows unknown properties', () => {
    const allowUnknownOptions = command.allowUnknownOptions();
    assert.equal(allowUnknownOptions, true);
  });

  it('supports debug mode', () => {
    const options = (command.options() as CommandOption[]);
    let containsOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsOption = true;
      }
    });
    assert(containsOption);
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
    assert(find.calledWith(commands.USER_LIST));
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

  it('correctly handles lack of valid access token', (done) => {
    Utils.restore(auth.ensureAccessToken);
    sinon.stub(auth, 'ensureAccessToken').callsFake(() => { return Promise.reject(new Error('Error getting access token')); });
    auth.service = new Service();
    auth.service.connected = true;
    auth.service.resource = 'https://graph.microsoft.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: true } }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('Error getting access token')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });
});