import * as $ from "jquery";
import { setCookie } from "./common";
import { RegisterResponse } from "./responses";
import * as Config from "./config";

export function setupRegisterForm() {
    var loginForm = document.getElementById("register-form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
    })
    
    var loginButton = document.getElementById("login-btn");
    loginButton.addEventListener("click", function(event) {
        register();
    });

    var emailInputField = document.getElementById("login-form-email");
    emailInputField.addEventListener("blur", function(event) {
        validateEmail();
    });

    var passwordInputField = document.getElementById("login-form-password");
    passwordInputField.addEventListener("blur", function(event) {
        validatePassword();
    })

    var repeatPasswordInputField = document.getElementById("login-form-password-repeat");
    repeatPasswordInputField.addEventListener("blur", function(event) {
        validatePasswordRepeat();
    })
}

interface RegisterFormElement extends HTMLFormElement {
    email:              HTMLInputElement;
    password:           HTMLInputElement;
    repeatpassword:     HTMLInputElement;
}

function register() {
    var form = <RegisterFormElement> document.getElementById("register-form");

    if(!(validateEmail() && validatePassword())) return;
    
    var informationBox = document.getElementById("information-box");

    var passwordField = form.password.value;
    var passwordRepeatField = form.repeatpassword.value;

    if(passwordField != passwordRepeatField) {
        informationBox.innerHTML = "Passwords do not match!";
        informationBox.style.visibility = "visible";
        informationBox.classList.remove("form-information-green");
        informationBox.classList.add("form-information-red");

        return;
    }

    var registerRequest = $.ajax({
        url: Config.MUCE_API + "/register",
        method: 'post',
        data: {
            email: btoa(form.email.value),
            password: btoa(form.password.value)
        }
    });

    registerRequest.done(function(e) {
        var response = <RegisterResponse> e;

        if(response.accountexists) {
            informationBox.innerHTML = "Account already exists!"
            informationBox.style.visibility = "visible";
            informationBox.classList.remove("form-information-green");
            informationBox.classList.add("form-information-red");
            return;
        }

        if(!response.success) {
            informationBox.innerHTML = "Something went wrong. Please try again later!";
            informationBox.style.visibility = "visible";
            informationBox.classList.remove("form-information-green");
            informationBox.classList.add("form-information-red");
            return;
        }

        informationBox.style.visibility = "hidden";
        informationBox.innerHTML = "";

        setCookie("session", response.sessionid, 30*24*60*60); //30 days
        setCookie("user", String(response.userid), 30*24*60*60); //30 days

        informationBox.classList.remove("form-information-red");
        informationBox.classList.add("form-information-green");
        informationBox.innerHTML = "Registration successful!";
        informationBox.style.visibility = "visible";

        window.location.href = "preparing.html";
    });

    registerRequest.fail(function(e) {
        informationBox.innerHTML = "Something went wrong. Please try again later!";
        informationBox.style.visibility = "visible";
        informationBox.classList.remove("form-information-green");
        informationBox.classList.add("form-information-red");
        return;
    })
}

function validateEmail(): boolean {
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm
    var emailField = (<RegisterFormElement> document.getElementById("register-form")).email;
    
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
    var passwordField = (<RegisterFormElement> document.getElementById("register-form")).password;

    var valid = passwordRegex.test(passwordField.value);
    if(!valid) {
        passwordField.classList.add("login-form-not-valid");
        return false;
    } else {
        passwordField.classList.remove("login-form-not-valid");
        return true;
    }
}


function validatePasswordRepeat(): boolean {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm;
    var passwordField = (<RegisterFormElement> document.getElementById("register-form")).repeatpassword;

    var valid = passwordRegex.test(passwordField.value);
    if(!valid) {
        passwordField.classList.add("login-form-not-valid");
        return false;
    } else {
        passwordField.classList.remove("login-form-not-valid");
        return true;
    }
}