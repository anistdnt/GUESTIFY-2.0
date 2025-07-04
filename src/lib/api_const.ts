export const API = {
    NOTIFICATION: {
        ALL_NOTIFICATIONS: "/getNotification",
        UPDATE_NOTIFICATION: "/updateNotification",
        UPDATE_NOTIFICATIONs : "/updateNotifications",
        DELETE_NOTIFICATION : "/deleteNotification",
        DELETE_NOTIFICATIONS : "/deleteNotifications"
    },
    USER: {
        LOGIN : "/loginUser",
        LOGOUT : "/logoutUser",
        REGISTER: "/registerUser",
        INFO : "/getProfile",
        UPDATE : "/updateProfile",
        FORGET_PASSWORD : "/forgetPassword",
        CHANGE_PASSWORD : "/changePassword",
        DELETE_ACCOUNT : "/deleteAccount",
        GET_PGs : "/getPg/user",
    },
    COLLEGE: {
        LIST : "/getAllColleges"
    },
    PG: {
        ALL : "/getAllpg",
        GET_PG_BY_ID : "/getPg",
        ADD : "/addpg",
        DELETE : "/deletePG"
    }

    
}