
var API_KEY = 'AIzaSyAQfbWiMEPryLnvDyTPyX8eDNQueQVr8jo';
var CLIENT_ID = '803832630173-labohf6hrvuhh39b5kong0dfjahp8cf3.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

var auth2;
var userId;
var authToken;
var emailList = {}


//var base64 = require('js-base64').Base64;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + googleUser.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  console.log(googleUser.getGrantedScopes());
  //console.log(googleUser.getAuthResponse().access_token)
  var id_token = googleUser.getAuthResponse().id_token;
  //console.log(id_token);
  userId = googleUser.getId();
  auth2 = gapi.auth2.getAuthInstance();  
  gapi.auth2.getAuthInstance().signIn();
  var token = "ya";
  gapi.client.setApiKey(API_KEY);
  gapi.auth.authorize({
	  client_id: CLIENT_ID,
	  scope: 'https://www.googleapis.com/auth/gmail.modify',
	  immediate: true
  }, getEmailsClient);

}

function getEmailsClient(){
	console.log("yeahyeah");
	gapi.client.load('gmail', 'v1', displayInbox);
}

function displayInbox(){
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX',
  });
  request.execute(function(response) {
    for (let i = 0; i < response.messages.length; i++){
		let messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': response.messages[i].id
      });
	  messageRequest.execute(addToEmailList);
	}
  });
}




function addToEmailList(emailData){
	if (emailList.hasOwnProperty(emailData.id)){
		  return;
	}

	emailList[emailData.id] = emailData;

	let data = emailData.payload.body.data;
	if (data === undefined){
		return;
	}
	let body = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
	let subject = getSubject(emailData.payload.headers);
	let toAdd = document.createElement("LI");
	let textNode = document.createTextNode(subject);
	toAdd.addEventListener("click", function(){displayBody(body);});
	toAdd.appendChild(textNode);
	document.getElementById("emailList").appendChild(toAdd);
	//console.log(emailList);
}

function getSubject(headers){
	for (let i = 0; i < headers.length; i++){
		if (headers[i].name == "Subject"){
			return headers[i].value;
		}
	}
	return "No subject found";
}


function displayBody(emailBody){
	//console.log(emailBody);
	document.getElementById('staging').innerHTML = emailBody;
}

function signOut() {
  auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  document.getElementById("emailList").innerHTML = "";
  document.getElementById("staging").innerHTML = "";
  emailList = {};
}

