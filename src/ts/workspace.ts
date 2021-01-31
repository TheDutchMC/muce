import { getCookie } from "./common";
import { UserResponse } from "./responses"; 
import * as $ from "jquery";

export function loadWorkspace() {

    //Get the user ID and session ID from the cookies
    var userId = getCookie("user");
    var sessionId = getCookie("session");

    //Create an iframe element, linking to the docker container running the code-server instance
    var vscodeIframe= document.createElement("iframe");
    vscodeIframe.src = "https://workspace.muce.apps.thedutchmc.nl/workspace/" + userId + "/";
    
    //Make a POST request to the backend to get the email address of the user.
    $.ajax({
        url: "https://api.thedutchmc.nl/muce/user",
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
}