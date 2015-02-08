if (Meteor.isClient) {

	Session.setDefault("counter", 0);
	Router.route('/', function () {
		this.render('startseite');
	});

	Router.route('/registration', function () {
		this.render('registration');
	});

	Router.route('/start_loggedin', function () {
		this.render('start_loggedin');
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
		'click #registrierButton': function(event, template){
			event.preventDefault();
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
					console.log("Form submitted.");
					alert('Registriert');
					Accounts.createUser({
						username: usernameVar,
						email: emailVar,
						password: passwordVar,
					});

					Router.go('/');
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
	Meteor.startup(function () {
    // code to run on server at startup
});
}
