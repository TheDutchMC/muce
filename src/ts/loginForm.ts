import * as $ from "jquery";
import { setCookie } from "./common";


export function setupLoginForm() {
    var loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
    })
    
    var loginButton = document.getElementById("login-btn");
    loginButton.addEventListener("click", function(event) {
        login();
    });

    var emailInputField = document.getElementById("login-form-email");
    emailInputField.addEventListener("blur", function(event) {
        validateEmail();
    });

    var passwordInputField = document.getElementById("login-form-password");
    passwordInputField.addEventListener("blur", function(event) {
        validatePassword();
    })
}

interface LoginFormElement extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

interface LoginResponse {
    status:         number;
    session:        string;
    user:           string;
}

function login() {
    var form = <LoginFormElement> document.getElementById("login-form");
    
    if(!(validateEmail() && validatePassword())) return;

    var email = form.email.value;
    var password = form.password.value;

    var loginRequest = $.ajax({
        url: "https://api.muce.apps.thedutchmc.nl/login",
        data: {
            email: email,
            password: password
        }
    });

    var informationBox = document.getElementById("information-box");

    loginRequest.done(function(e) {
        var response = <LoginResponse> e;

        if(response.status != 0) {
            informationBox.innerHTML = "Your E-Mail or password is invalid!";
            informationBox.style.visibility = "visible";
            return;
        }

        informationBox.style.visibility = "hidden";
        informationBox.innerHTML = "";

        setCookie("session", response.session, 30*24*60*60); //30 days
        setCookie("user", response.user, 30*24*60*60); //30 days

        informationBox.classList.add("login-form-ok");
        informationBox.innerHTML = "Login successful!";
        informationBox.style.visibility = "visible";

        //TODO redirect user to a page indicating that we're preparing their container, after that we want to redirect the user to their container.
    });

    loginRequest.fail(function(e) {
        informationBox.innerHTML = "Something went wrong. Please try again later!";
        informationBox.style.visibility = "visible";
    });
}

function validateEmail(): boolean {
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm
    var emailField = (<LoginFormElement> document.getElementById("login-form")).email;
    
    var valid = emailRegex.test(emailField.value);
    if(!valid) {
        emailField.classList.add("login-form-not-valid");
        return false;
    } else {
        emailField.classList.remove("login-form-not-valid");
        return true;
    }
}

function validatePassword(): boolean {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm;
    var passwordField = (<LoginFormElement> document.getElementById("login-form")).password;

    var valid = passwordRegex.test(passwordField.value);
    if(!valid) {
        passwordField.classList.add("login-form-not-valid");
        return false;
    } else {
        passwordField.classList.remove("login-form-not-valid");
        return true;
    }
}