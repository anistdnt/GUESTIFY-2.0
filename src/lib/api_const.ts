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
        GET_STATS : "/getStats",
        BOOKING:{
            CREATE : "/booking/create",
        }
    },
    ADMIN:{
        DASHBOARD: {
            BOX: "/statistics/:uid",
            ROOM_GRAPH: "/statistics/:uid/graph/rooms",
            BOOKING_LINE: "/statistics/graph/bookings",
        },
        BOOKING:{
            LIST : "/booking/list",
            VIEW: "/booking/:id/details",
            CHANGE_STATUS: "/booking/:id/status",
            DELETE: "/booking",
            CLOSE_PAYMENT_SESSION: "/booking/:id/payment/close",
            CREATE_PAYMENT_SESSION: "/booking/:id/payment/create-session",
            PAYMENTS: "/booking/:id/payment/logs"
        },
        PAYMENTS:{
            LOGS: "/admin/payment/logs",
            TRANSACTION_STATS: "/payment/transaction/stats",
            TRANSACTION_SUMMARY: "/payment/transaction/summary"
        },
        ATTRACTIONS: {
            LIST: "/admin/attractions",
            ENLSIT: "/attraction/new",
            DELETE: "/pg/attraction/:id",
            TOGGLE: "/pg/:id/attraction/toggle"
        },
        EXTENSIONS: {
            LIST: "/extension/list",
            INSTALL: "/extension/:ext_id/install",
            UNINSTALL: "/extension/:ext_id/uninstall",
        }
    },
    COLLEGE: {
        LIST : "/getAllColleges",
        GET_BY_ID : "/college",
    },
    PG: {
        ALL : "/getAllpg",
        ALL_BY_DIST : "/getAllPgByDistrict",
        GET_PG_BY_ID : "/getPg",
        ADD : "/addpg",
        DELETE : "/deletePG",
        UPDATE : "/updatePg",
        ADD_ROOM : "addRooms",
        FOR_MAP : "/getPgForMap",
        GET_PG_NEAR_ME : "/getPgNearMe",
        GET_PG_NEAR_PG : "/getPgNearPg",
        GET_PG_STATS: "/statistics/:uid/pg",
        CATELOGUE: "/user/:uid/pg/catelogue",
        ATTRACTIONS: "/pg/:pg_id/attractions"
    },
    ROOM: {
        GET_ROOM_BY_ID : "/getPg",
        UPDATE : "/updatePg",
        DELETE: "/deleteRoom",
        VIEW_ROOM_DETAILS: "/room/:id",
        CATELOGUE: "/pg/:pgid/room/catelogue"
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
        DELETE: "/deleteImage",
        MULTIDELETE: "/deleteMultipleImages"
    },
    WISHLIST: {
        ADD: "/wishlist/add",
        VIEW: "/wishlist",
        DELETE: "/wishlist/remove"
    },
    BOOKING: {
        VIEW: "/booking/:id/details",
        ROOMLIST: "/booking/roomlist"
    },
    CHECKOUT: {
        CREATE_SESSION: "/create-checkout-session",
        CHECKOUT_INFO: "/booking/session/success"
    }
}