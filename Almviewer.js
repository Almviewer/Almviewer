Nachrichten = new Meteor.Collection('nachrichten');

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

	Template.registration.events = ({
		'click #registrierButton': function(event, template){
			event.preventDefault();
			var emailVar = document.getElementById('email').value;
			var passwordVar = document.getElementById('password').value;
			var passwordVarWdh = document.getElementById('passwordwdh').value;
			var usernameVar = document.getElementById('username').value;
			if(passwordVar == passwordVarWdh){
			console.log("Form submitted.");
			alert('Registriert');
			Accounts.createUser({
				username: usernameVar,
				email: emailVar,
				password: passwordVar,
			});
		}
		}
	});

	Template.login.events = ({
		'click #loginButton': function(event){
			event.preventDefault();
			var emailVar = document.getElementById('login_email').value;
			var passwordVar = document.getElementById('login_password').value;
			console.log("Eingeloggt");
			Meteor.loginWithPassword(emailVar,passwordVar);
		}
	});

	Template.logout.events = ({
    	'click #logoutButton': function(event){
      event.preventDefault();
      Meteor.logout();
    }
  });

	/*Template.rating.events = ({
		'click .rateit': function(event){
			alert('rating: ' + $(this).rateit('value')); 
		}
	});*/
}

if (Meteor.isServer) {
	Meteor.startup(function () {
    // code to run on server at startup
});
}
