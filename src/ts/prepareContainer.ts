import * as $ from "jquery";
import { getCookie, sleep } from "./common";
import { CreateContainerResponse } from "./responses";
import * as Config from "./config";

export function prepareContainer() {
    var userId = getCookie("user");
    var sessionId = getCookie("session");

    var containerRequest = $.ajax({
        url: Config.MUCE_API + "/container",
        method: 'post',
        data: {
            userId: userId,
            sessionId: sessionId
        }
    });

    containerRequest.done(function(e) {
        var response = <CreateContainerResponse> e;

        if(!response.sessionvalid) {
            window.location.href = "/login.html";
            return;
        }

        if(!response.success) {
            alert("Something went wrong. Please try again later!");
            return;
        }

        sleep(5000).then(() => {
            window.location.href = "./workspace.html";
        });
    });

    containerRequest.fail(function(e) {
        console.log(e);
    });
}