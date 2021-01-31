import * as $ from "jquery";
import { getCookie } from "./common";

export function prepareContainer() {
    var userId = getCookie("user");
    var sessionId = getCookie("session");

    var containerRequest = $.ajax({
        url: "https://api.thedutchmc.nl/muce/container",
        method: 'post',
        data: {
            userId: userId,
            sessionId: sessionId
        }
    });

    containerRequest.done(function(e) {
        console.log(e);
        console.log(userId);
    });

    containerRequest.fail(function(e) {
        console.log(e);
    });
}