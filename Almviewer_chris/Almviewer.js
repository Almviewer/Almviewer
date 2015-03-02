Routen = new Meteor.Collection("Routen");
if (Meteor.isClient) {
  Session.set('prefix', {});
  Session.set('rInfo', '');
  Template.routen.route = function () {
    return Routen.find({name: { $regex: Session.get('prefix')+".*", $options: 'i' }});
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

   //sdjfjsdfksdfksjdf
   //sjdfjksdfsjdfjsdf
   //ijhfsdhfkshdkjfks

   function routenInfoAusgabe(){
   

    
    //var aktSteig = Route.find({name: { $regex: Session.get('prefix')+".*", $options: 'i' }});
    var t = $('#aktRout').text();
    t = t.replace(/\s/g, '');
 
        $('#routenInfo').load(''+ t + '.html');
        $('#googleeinbindung').load('google'+ t + '.html');
   
    
  }

   //sdjfjsdfksdfksjdf
   //sjdfjksdfsjdfjsdf
   //ijhfsdhfkshdkjfks

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
