import { getCookie } from "./common";
import { UserResponse, LogoutResponse } from "./responses"; 
import * as $ from "jquery";
import * as Config from "./config";

export function loadWorkspace() {

    //Get the user ID and session ID from the cookies
    var userId = getCookie("user");
    var sessionId = getCookie("session");

    if(userId == "" || sessionId == "") {
        location.href = "./login.html";
    }

    //Create an iframe element, linking to the docker container running the code-server instance
    var vscodeIframe= document.createElement("iframe");
    vscodeIframe.src = "https://workspace.muce.apps.thedutchmc.nl/workspace/" + userId + "/";
    
    //Make a POST request to the backend to get the email address of the user.
    $.ajax({
        url: Config.MUCE_API + "/user",
        method: 'post',
        data: {
            sessionId: sessionId,
            userId: userId
        },
        success: function(e) {
            var response = <UserResponse> e;

            //Get the <p> accountname
            var accountName = document.getElementById("accountname");

            //If the function did not succeed, remove the accountname element and throw an error
            if(!response.success) {
                accountName.remove();
                throw new Error("Failed to load user email!");
            }

            accountName.innerHTML = response.email;
        },
        error: function(e) {
            //Get the <p> accountname, remove it, and throw an error
            var accountName = document.getElementById("accountname").remove();
            throw new Error("Failed to load user email!");     
        }
    });

    //Calculate the width and height of the iframe.
    // Height = windowHeight*0.07 -4
    // Width = windowWidth -4
    var h = window.innerHeight - (window.innerHeight *0.07);
    var w = window.innerWidth;

    //Apply the size to the IFrame
    vscodeIframe.style.height = (h -4) + "px";
    vscodeIframe.style.width = (w -4) + "px";

    //Add the IFrame to the body
    document.body.appendChild(vscodeIframe);

    //Add an event listener to the window, so that if the window resizes we resize the IFrame
    window.addEventListener("resize", function(e) {
        var h = window.innerHeight - (window.innerHeight *0.07);
        var w = window.innerWidth;

        vscodeIframe.style.height = (h -4) + "px";
        vscodeIframe.style.width = (w-4) + "px";
    });

    var previewbtn = <HTMLLinkElement> document.getElementById("previewbtn");
    previewbtn.href = "https://workspace.muce.apps.thedutchmc.nl/preview/" + userId;


    var logoutBtn = document.getElementById("logoutbtn");
    logoutBtn.addEventListener("click", function(e) {
        var logoutRequest = $.ajax({
            url: Config.MUCE_API + "/logout",
            method: 'post',
            data: {
                userId: userId,
                sessionId: sessionId
            }
        });

        logoutRequest.done(function(e) {
            var response = <LogoutResponse> e;

            if(!response.success) {
                alert("Something went wrong whilst logging out!");
            }

            window.location.href = "/index.html";
        });

        logoutRequest.fail(function(e) {
            alert("Something went wrong whilst logging out!");
            throw new Error(String(e));
        });
    });
}