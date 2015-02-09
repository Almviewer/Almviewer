if (Meteor.isClient) {

	Session.setDefault("counter", 0);
Meteor.subscribe("userStatus");
	
	Router.route('/', function () {
		this.render('startseite');
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

	RegistrationSchema = new SimpleSchema({
		username: {
			type: String,
			regEx: /^[a-z0-9_-]/i,
			min: 4,
			max: 15
		},
		password: {
			type: String,
			regEx: /^[a-z0-9]/i,
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

			if(passwordVar == passwordVarWdh){

				obj = {username: usernameVar, email: emailVar, password: passwordVar};
				var context = RegistrationSchema.namedContext("myContext");

				context.validate(obj);

				if (!context.isValid()) {
					console.log("Falsche Eingabe");
				}

				if (context.isValid()){
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
			var usernameVar = document.getElementById('login_email').value;
			var passwordVar = document.getElementById('login_password').value;
			console.log("Eingeloggt");
			Meteor.loginWithPassword(usernameVar,passwordVar);
		}
	});

	Template.logout.events = ({
		'click #logoutButton': function(event){
			event.preventDefault();
			Meteor.logout();
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
