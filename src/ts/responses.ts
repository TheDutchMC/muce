export interface LoginResponse {
    sessionid:          string;
    userid:             string;
    accountexists:      boolean;
    login:              boolean;
}

export interface RegisterResponse {
    success:            boolean;
    accountexists:      boolean;
    userid:             string;
    sessionid:          string;
}

export interface UserResponse {
    success:            boolean;
    email:              string;
}

export interface CreateContainerResponse {
    success:            boolean;
    sessionvalid:       boolean;
}

export interface LogoutResponse {
    success:            boolean;
}