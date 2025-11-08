export const API = {
    NOTIFICATION: {
        GET_ALL: "/getAllNotifications",
        ALL_NOTIFICATIONS: "/sse-listener",
        UPDATE_NOTIFICATION: "/updateNotification",
        UPDATE_NOTIFICATIONs : "/updateNotifications",
        DELETE_NOTIFICATION : "/deleteNotification",
        DELETE_NOTIFICATIONS : "/deleteNotifications",
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
        GET_STATS : "/getStats"
    },
    ADMIN:{
        BOOKING:{
            LIST : "/booking/list",
            CREATE : "/booking/create",
            VIEW: "/booking/:id/details",
            CHANGE_STATUS: "/booking/:id/status",
            DELETE: "/booking",
            CLOSE_PAYMENT_SESSION: "/booking/:id/payment/close"
        }
    },
    COLLEGE: {
        LIST : "/getAllColleges",
        GET_BY_ID : "/college",
    },
    PG: {
        ALL : "/getAllpg",
        GET_PG_BY_ID : "/getPg",
        ADD : "/addpg",
        DELETE : "/deletePG",
        UPDATE : "/updatePg",
        ADD_ROOM : "addRooms",
        FOR_MAP : "/getPgForMap",
        GET_PG_NEAR_ME : "/getPgNearMe",
        GET_PG_NEAR_PG : "/getPgNearPg",
    },
    ROOM: {
        GET_ROOM_BY_ID : "/getPg",
        UPDATE : "/updatePg",
        DELETE: "/deleteRoom",
        VIEW_ROOM_DETAILS: "/room/:id"
    },
    REVIEW: {
        GET_REVIWS_OF_PG : "/getReviews",
        ADD_REVIEW:"/addReview"
    },
    VERIFICATION: {
        SEND_PHONE_OTP: "/auth/send-otp",
        VERIFY_PHONE_OTP: "/auth/verify-otp",
        SEND_EMAIL_OTP: "/auth/email/send-otp",
        VERIFY_EMAIL_OTP: "/auth/email/verify-otp",
    },
    OWNER: {
        GET_OWNER_BY_ID: "/getOwner",
        UPDATE_OWNER: "/updateOwner"
    },
    IMAGE: {
        UPLOAD: "/uploadImage",
        DELETE: "/deleteImage"
    },
    WISHLIST: {
        ADD: "/wishlist/add",
        VIEW: "/wishlist",
        DELETE: "/wishlist/remove"
    },
}