
var auth2 = {};
var isVonSchule;
var emailSuffix1 = "htl-ottakring.ac.at";
var emailSuffix2 = "htl-ottakring.at";
var emaill;
// var adminEmail = 'x.eleazar98@htl-ottakring.ac.at';
var adminEmail = '';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
var helper = (function() {
    return {
        /**
         * Hides the sign in button and starts the post-authorization operations.
         *
         * @param {Object} authResult An Object which contains the access token and
         *   other authentication information.
         */


        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function() {
            // Revoke the access token.
            auth2.disconnect();
        },

        onSignInCallback: function(authResult) {
            $('#authResult').html('Auth Result:<br/>');
            for (var field in authResult) {
                $('#authResult').append(' ' + field + ': ' +
                    authResult[field] + '<br/>');
            }
            if (authResult.isSignedIn.get()) {
                $('body').css("background-image","url(/"/")");
                $('#authOps').show(200);
                $('#gConnect').hide();
                helper.profile();
                helper.people();
            } else {
                if (authResult['error'] || authResult.currentUser.get().getAuthResponse() == null) {
                    // There was an error, which means the user is not signed in.
                    // As an example, you can handle by writing to the console:
                    console.log('There was an error: ' + authResult['error']);
                }
                $('#authResult').append('Logged out');
                $('#authOps').hide('200');
                $('#gConnect').show();
            }
            console.log('authResult', authResult);
        },

        /**
         * Gets and renders the list of people visible to this app.
         */
        people: function() {
            gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'visible'
            }).then(function(res) {
                var people = res.result;
                $('#visiblePeople').empty();
                $('#visiblePeople').append('Number of people visible to this app: ' +
                    people.totalItems + '<br/>');
                for (var personIndex in people.items) {
                    person = people.items[personIndex];
                    $('#visiblePeople').append('<img src="' + person.image.url + '">');
                }
            });
        },

        /**
         * Gets and renders the currently signed in user's profile data.
         */
        profile: function(){
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function(res) {
                var profile = res.result;

                var str = profile.emails[0].value;
                var typee;
               // profile.group
                console.log("EmailSuffix1: "+str.indexOf(emailSuffix1));
                console.log("EmailSuffix2: "+str.indexOf(emailSuffix2));
                if(str == adminEmail){
                    typee = 'Admin';
                    isVonSchule = true;
                    console.log(typee);
                    document.getElementById('formCheck').action = "admin";
                }
                else if((str.indexOf(emailSuffix1) == -1) && (str.indexOf(emailSuffix2) == -1)){
                    isVonSchule = false;
                }
                else if((str.indexOf(emailSuffix1) != -1) || (str.indexOf(emailSuffix2) != -1)){
                    isVonSchule = true;
                }
                console.log("Nach Check: "+isVonSchule);

                if(!isVonSchule){
                    auth2.disconnect();
                }

                console.log('profilestart');
                console.log(profile);
                console.log('profileend');
                $('#profile').empty();
                $('#profileimg').append(
                    $('<div class=\"col-md-2\"><img src=\"' + profile.image.url + '\"></div>'));
                var matches = str.match(/\d+/g);
                if(!typee){
                    if (matches != null) {
                        typee = 'Schüler';
                        console.log(typee);
                        if(document.getElementById('formCheck')) {
                            document.getElementById('formCheck').action = "schueler";
                        }
                    }
                    // TEST 123
                    else typee = 'Professor';
                    console.log(typee);
                    if(document.getElementById('formCheck')) {
                        document.getElementById('formCheck').action = "lehrer";
                    }
                }
                $('#profile').append(' '+typee+' '+toTitleCase(profile.name.givenName) + " " + toTitleCase(profile.name.familyName));
                if (profile.emails) {
                    for (var i=0; i < profile.emails.length; i++){
                        emaill=profile.emails[i].value;
                        $('#profilemail').append('<small>'+emaill+'</small>').append(' ');
                        if(document.getElementById('emailCheck') &&
                            document.getElementById('vnameCheck') &&
                            document.getElementById('nnameCheck') &&
                            document.getElementById('formCheck')) {
                                document.getElementById('emailCheck').value = emaill;
                                document.getElementById('vnameCheck').value = profile.name.givenName;
                                document.getElementById('nnameCheck').value = profile.name.familyName;
                                document.getElementById('formCheck').submit();
                        }
                    }
                }
                if (profile.cover && profile.coverPhoto) {
                    $('#profile').append(
                        $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
                }
            }, function(err) {
                var error = err.result;
                $('#profile').empty();
                $('#profile').append(error.message);
            });
        }
    };
})();



/**
 * jQuery initialization
 */
$(document).ready(function() {
    $('#disconnect').click(helper.disconnect);
    $('#loaderror').hide();
    if ($('meta')[0].content == 'YOUR_CLIENT_ID') {
        alert('This sample requires your OAuth credentials (client ID) ' +
            'from the Google APIs console:\n' +
            '    https://code.google.com/apis/console/#:access\n\n' +
            'Find and replace YOUR_CLIENT_ID with your client ID.'
        );
    }
});

/**
 * Handler for when the sign-in state changes.
 *
 * @param {boolean} isSignedIn The new signed in state.
 */
var updateSignIn = function() {
    console.log('update sign in state');
    if (auth2.isSignedIn.get()) {
        console.log('signed in');
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }else{
        console.log('signed out');
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }
};

/**
 * This method sets up the sign-in listener after the client library loads.
 */
function startApp() {
    gapi.load('auth2', function() {
        gapi.client.load('plus','v1').then(function() {
            gapi.signin2.render('signin-button', {
                scope: 'https://www.googleapis.com/auth/plus.login',
                fetch_basic_profile: false });
            gapi.auth2.init({fetch_basic_profile: true,
                scope:'https://www.googleapis.com/auth/plus.login'}).then(
                function (){
                    console.log('init');
                    auth2 = gapi.auth2.getAuthInstance();
                    auth2.isSignedIn.listen(updateSignIn);
                    auth2.then(updateSignIn);
                });
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function(resp) {
                console.log('Retrieved profile for:' + resp.displayName);
            });
        });
    });
}
/**
 * Created by XyruzKyle on 25/11/2016.
 */
