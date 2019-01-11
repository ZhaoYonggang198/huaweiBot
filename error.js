const ErrorResponse = {
  Invalid_parameter: {
    errorCode: "1",
    errorMessage: "Invalid parameter"
  },
  Incorrect_signature: {
    errorCode: "2",
    errorMessage: "Incorrect signature"
  },
  Too_many_parameters: {
    errorCode: "3",
    errorMessage: "Too many parameters"
  },
  Unsupported_signature_method: {
    errorCode: "4",
    errorMessage: "Unsupported signature method"
  },
  Invalid_timestamp_parameter: {
    errorCode: "5",
    errorMessage: "Invalid/Used timestamp parameter"
  },
  Unsupported_open_api: {
    errorCode: "6",
    errorMessage: "Unsupported open api"
  },
  Invalid_user_id: {
    errorCode: "20",
    errorMessage: "Invalid user id"
  },
  Invalid_API_key: {
    errorCode: "41",
    errorMessage: "Invalid API key"
  },
  Session_key_invalid: {
    errorCode: "42",
    errorMessage: "Session key invalid or no longer valid"
  },
  Access_token_invalid: {
    errorCode: "43",
    errorMessage: "Access token invalid or no longer valid"
  },
  Access_token_expired: {
    errorCode: "64",
    errorMessage: "Access token expired"
  },
  No_permission_to_access_user_data: {
    errorCode: "60",
    errorMessage: "No permission to access user data"
  },
  No_permission_to_access_data_for_this_referer: {
    errorCode: "61",
    errorMessage: "No permission to access data for this referer"
  },
  Unknown_error: {
    errorCode: "101",
    errorMessage: "Unknown error"
  },
  Server_internal_error: {
    errorCode: "102",
    errorMessage: "Server internal error"
  },
  Service_temporarily_unavailable: {
    errorCode: "103",
    errorMessage: "Service temporarily unavailable"
  }
}

module.exports = ErrorResponse
