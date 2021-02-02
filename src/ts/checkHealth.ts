import * as $ from "jquery";
import { HealthResponse } from "./responses";
import { MUCE_API, MUCE_WORKSPACE } from "./config";

export function checkHealth() {
    var healthTable = document.getElementById("healthtable");
    
    var rowCheckApi = document.createElement("tr");
    var tdCheckApiName = document.createElement("td");
    tdCheckApiName.innerHTML = "MUCE API";
    tdCheckApiName.classList.add("left");

    var tdCheckApiHealh = document.createElement("td");
    tdCheckApiHealh.classList.add("right");

    var checkApiRequest = $.ajax({
        url: MUCE_API + "/health",
        method: 'get'
    });

    checkApiRequest.done(function(e) {
        var response = <HealthResponse> e;

        tdCheckApiHealh.innerHTML = response.health;

        if(response.health == "OK") {
            tdCheckApiHealh.classList.add("ok");
            tdCheckApiHealh.classList.remove("fail");
        } else {
            tdCheckApiHealh.classList.remove("ok");
            tdCheckApiHealh.classList.add("fail");
        }
    });

    checkApiRequest.fail(function(e) {
        tdCheckApiHealh.classList.remove("ok");
        tdCheckApiHealh.classList.add("fail");
        tdCheckApiHealh.innerHTML = "FAIL";
    })

    rowCheckApi.append(tdCheckApiName, tdCheckApiHealh);
    healthTable.append(rowCheckApi);

    var rowCheckNginx = document.createElement("tr");
    var tdCheckNginxName = document.createElement("td");
    tdCheckNginxName.innerHTML = "NGINX";
    tdCheckNginxName.classList.add("left");

    var tdCheckNginxHealth = document.createElement("td");
    tdCheckNginxHealth.classList.add("right");

    var checkNginxRequest = $.ajax({
        url: MUCE_WORKSPACE + "/preview/1/health/",
        method: 'get'
    });

    checkNginxRequest.done(function(e) {

        console.log(e);
        tdCheckNginxHealth.innerHTML = String(e);

        if(e == "OK") {
            tdCheckNginxHealth.classList.add("ok");
            tdCheckNginxHealth.classList.remove("fail");
        } else {
            tdCheckNginxHealth.classList.remove("ok");
            tdCheckNginxHealth.classList.add("fail");
        }
    });

    checkNginxRequest.fail(function(e) {
        tdCheckNginxHealth.classList.remove("ok");
        tdCheckNginxHealth.classList.add("fail");
        tdCheckNginxHealth.innerHTML = "FAIL";
    })

    rowCheckNginx.append(tdCheckNginxName, tdCheckNginxHealth);
    healthTable.append(rowCheckNginx);
}
