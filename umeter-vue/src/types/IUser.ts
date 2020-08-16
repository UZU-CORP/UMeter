interface IUser {
    id: number;
    username: string;
    type: EUserType;
    accountDetails: {[state: string]: any} | null
}

enum EUserType {
    ADMIN = "admin",
    STAKEHOLDER = "stakeholder",
    SUBSCRIBER = "subscriber"
}