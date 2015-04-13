Routen = new Meteor.Collection('Routen');
Steige = new Meteor.Collection('Steige');

if (Meteor.isClient) {

  Session.set('prefix', {});
  Session.set('rInfo', '');

  Session.set('selectedAnz', 0);
  Session.set('aktRouteninfo', "");
  Session.set('lowerSchw', 0);
  Session.set('greaterSchw', 0);
  var anzR=4;
  var laktSchw;
  var gaktSchw;
  var aktSchw;
  Session.set('aktSchw', {});

  Session.setDefault("counter", 0);
  Meteor.subscribe("userStatus");

  Router.route('/', function () {
    this.render('startseite');
    document.getElementById('navStart').className = "active";
    if(Meteor.user()<1){document.getElementById('navReg').className = "";}
    if(Meteor.user()<1){document.getElementById('navRout').className = "";}
    if(Meteor.user()<1){document.getElementById('navImp').className = "";}
    if(Meteor.user()!=0){document.getElementById('navVor').className = "";}
  });

  Router.route('/routennear', function () {
    this.render('routennear');
  });

  Router.route('/profil', function () {
    this.render('profil');
  });

  Router.route('/registration', function () {
    this.render('registration');
    document.getElementById('navReg').className = "active";
    document.getElementById('navStart').className = "";
    document.getElementById('navImp').className = "";
    document.getElementById('navRout').className = "";
  });

  Router.route('/start_loggedin', function () {
    this.render('start_loggedin');
  });

  Router.route('/routen', function () {
    this.render('routen');
    document.getElementById('navReg').className = "";
    document.getElementById('navStart').className = "";
    document.getElementById('navImp').className = "";
    document.getElementById('navRout').className = "active";

  });

  Router.route('/vorschlag', function () {
    this.render('vorschlag');
    if(Meteor.user()!=0){document.getElementById('navLogStart').className = "";}
    document.getElementById('navImp').className = "";
    document.getElementById('navVor').className = "active";
    if(Meteor.user()!=0){document.getElementById('navProf').className = "";}
  });

  Router.route('/impressum', function () {
    this.render('impressum');
    document.getElementById('navReg').className = "";
    document.getElementById('navLogStart').className = "";
    document.getElementById('navImp').className = "active";
    document.getElementById('navRout').className = "";
  });

  Meteor.startup(function() {
    reCAPTCHA.config({
      publickey: '6LeotAETAAAAAB1avIaV30Z_MMQ3UzvuVNpgp2Q2'
    });
  });

  UserSchema = new SimpleSchema({
    username: {
      type: String,
      regEx: /^[A-Za-z0-9_-]/,
      min: 4,
      max: 15
    },
    password: {
      type: String,
      regEx: /^[A-Za-z0-9]/,
      min: 4,
      max: 18
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      min: 5,
      max: 40,
    },
  });

  Template.routen.route = function () {
    return Steige.find({name: { $regex: Session.get('prefix')+".*", $options: 'i' }});
  };

  Template.vorschlag.route = function () {
    return Steige.find({name: { $regex: Session.get('prefix')+".*", $options: 'i' }});
  };


  function routenAusgabe(){
    $(".routeninput").on("change keyup paste click", function(){
      Session.set('prefix', $('.routeninput').val());
    });
  }

  Template.routen.events = ({
    'keyup #routeninput': function(event){
      event.preventDefault();
      routenAusgabe();
    },

    'click #routenAusgabe p a': function(event){
      event.preventDefault();
      routenInfoAusgabe();
    }

  });

  Template.vorschlag.events = ({
    'keyup #routeninput': function(event){
      event.preventDefault();
      routenAusgabe();
    },

    'click #routenAusgabe p a': function(event){
      event.preventDefault();
      routenInfoAusgabe();
    }

  });

   //sdjfjsdfksdfksjdf
   //sjdfjksdfsjdfjsdf
   //ijhfsdhfkshdkjfks

   function routenInfoAusgabe(){



    //var aktSteig = Route.find({name: { $regex: Session.get('prefix')+".*", $options: 'i' }});
    var t = $('#aktRout').text();
    t = t.replace(/\s/g, '');

    $('#routenInfo').load(''+ t + '4.html');
    $('.googleeinbindung').load('google'+ t + '.html');

    
  }

  Template.routenvorschlag.events = ({
  'click #auswahl_routenAnz': function(event){
    event.preventDefault();
    routenVorschlag();
  }
});

  function routenVorschlag(){
   var e = document.getElementById("auswahl_routenAnz");
   selectedAnz = e.options[e.selectedIndex].value;
   
   var f = document.getElementById("aktRout").text;
   Session.set('aktRouteninfo', ""+f);
   anzR = selectedAnz;
     //BULLSHIT Code der funzen sollte aba weil das kack find() weiter unten iwie net die Werte, die ich in die Sessions speichere übernimmt, sind 
     //halt unten die Werte für die Sessions fix vergeben
     //Session.set('selectedAnz', anzR);
     
     aktSchw = Steige.findOne({name: Session.get('aktRouteninfo')}).schwierigkeitsgrad;
     laktSchw = aktSchw -0.5;
     gaktSchw = aktSchw +0.5;
     Session.set('lowerSchw', laktSchw);
     Session.set('greaterSchw', gaktSchw);
     Session.set('aktSchw', aktSchw);

     for(var i = 1; i <= 5; i++){
      if(selectedAnz == 1){
        Session.set('selectedAnz', 1);
      }
      if(selectedAnz == 2){
        Session.set('selectedAnz', 2);
      }
      if(selectedAnz == 3){
        Session.set('selectedAnz', 3);
      }
      if(selectedAnz == 4){
        Session.set('selectedAnz', 4);
      }
      if(selectedAnz == 5){
        Session.set('selectedAnz', 5);
      }

    }


  }

     //if(ready == true){

      Template.routenvorschlag.routenV = function () {
        return Steige.find({schwierigkeitsgrad: {$gt: Session.get('lowerSchw'), $lt: Session.get('greaterSchw')}}, {limit: Session.get('selectedAnz')});
      //return Steige.find({schwierigkeitsgrad: {$gt: 1.5, $lt: 2.5}}, {limit: anzR});

    };

    Template.registration.events = ({
      'submit form': function(e) {

        e.preventDefault();

        var formData = {
          emailVar: document.getElementById('email').value,
          passwordVar: document.getElementById('password').value,
          passwordVarWdh: document.getElementById('passwordwdh').value,
          usernameVar: document.getElementById('username').value
        };

        var captchaData = {
          captcha_challenge_id: Recaptcha.get_challenge(),
          captcha_solution: Recaptcha.get_response()
        };

        var emailVar = document.getElementById('email').value;
        var passwordVar = document.getElementById('password').value;
        var passwordVarWdh = document.getElementById('passwordwdh').value;
        var usernameVar = document.getElementById('username').value;
        var agbcheck = document.getElementById('agb').checked;

        if(passwordVar == passwordVarWdh){

          obj = {username: usernameVar, email: emailVar, password: passwordVar};
          var contextreg = UserSchema.namedContext("myContext");

          contextreg.validate(obj);

          if (!contextreg.isValid()) {
            console.log("Falsche Eingabe");
          }

          if (contextreg.isValid()){
            Meteor.call('formSubmissionMethod', formData, captchaData, function(error, result) {
              if (error) {
                console.log('There was an error: ' + error.reason);
              } else {
                console.log('Success!');
                console.log("Form submitted.");
                Accounts.createUser({
                  username: usernameVar,
                  email: emailVar,
                  password: passwordVar,
                });

                Router.go('/');
              }
            });
          }
        }

        else{
          alert('Passwort wurde falsch wiederholt');
        }
      }
    });

Template.login.events = ({
  'click #loginButton': function(event){
    event.preventDefault();
    var usernameVar = document.getElementById('login_user').value;
    var passwordVar = document.getElementById('login_password').value;
    console.log("Eingeloggt");
    Meteor.loginWithPassword(usernameVar,passwordVar);
  }
});

Template.logout.events = ({
  'click #logoutButton': function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go('/');
  }
});

Template.profil.helpers({
  'currentEmail': function() {
    return Meteor.user().emails[0].address;
  }
}); 

Template.profil.events = ({
  'click #profiluserButton': function(event){
    event.preventDefault();
    var pro_usernameVar = document.getElementById('pro_username').value;
    Meteor.call('updateuserfunction', pro_usernameVar);
  },
  'click #profilemailButton': function(event){
    event.preventDefault();
    var pro_emailVar = document.getElementById('pro_email').value;
    Meteor.call('updateemailfunction', pro_emailVar);
  },
  'click #profilpasswordButton': function(event){
    event.preventDefault();
    var pro_altpasswordVar = document.getElementById('pro_altpassword').value;
    var pro_neupasswordVar = document.getElementById('pro_neupassword').value;
    var pro_passwordwdhVar = document.getElementById('pro_passwordwdh').value;
    Accounts.changePassword(Meteor.users.password, pro_neupassword);
    //Meteor.call('updatepasswordfunction', pro_neupasswordVar);
  }
});

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    reCAPTCHA.config({
      privatekey: '6LeotAETAAAAACYBw6fe85bXmUi2OldM6NhS8inU'
    });
  });

  Meteor.methods({
    updateuserfunction: function (username) {
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{username:username}});
    }
  });

  Meteor.methods({
    updateemailfunction: function (email) {
      Meteor.users.update({_id:Meteor.user()._id}, {$set: {emails: [{address: email}]}});
    }
  });

  Meteor.methods({
    updatepasswordfunction: function (password) {
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{password:password}});
    }
  });

  Meteor.methods({
    formSubmissionMethod: function(formData, captchaData) {

      var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);

      if (!verifyCaptchaResponse.success) {
        console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
        throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
      } else
      console.log('reCAPTCHA verification passed!');

        //do stuff with your formData

        return true;
      } 
    });
}
