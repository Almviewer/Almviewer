if (Meteor.isClient) {

	Session.setDefault("counter", 0);
	Meteor.subscribe("userStatus");

	Router.route('/', function () {
		this.render('startseite');
	});

	Router.route('/profil', function () {
		this.render('profil');
	});

	Router.route('/registration', function () {
		this.render('registration');
	});

	Router.route('/start_loggedin', function () {
		this.render('start_loggedin');
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
							alert('Registriert');
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
			var pro_passwordVar = document.getElementById('pro_password').value;
			var pro_passwordwdhVar = document.getElementById('pro_passwordwdh').value;
			if(pro_passwordVar==pro_passwordwdhVar){
				Meteor.call('updatepasswordfunction', pro_passwordVar);
			}
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
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{email:email}});
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
