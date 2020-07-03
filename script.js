
var API_KEY = 'AIzaSyB2mORxtpWlYI8Tnllco7mqlBLfLO4acxE';
var CLIENT_ID = '336583375329-k44sptphugo55i5eim3pl83ahbvajo38.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id = profile.getId();
  const url = "https://www.googleapis.com/gmail/v1/users/" + id + "/threads";
  const http = new XMLHttpRequest();
  http.open("GET", url);
  http.send();
  http.onreadystatechange = (e) => {
	  console.log(http.responseText);
  }
}

console.log("ya")
console.log("lol")