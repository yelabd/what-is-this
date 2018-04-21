# Server

Note: all URLs **must** have a trailing slash.

## User functions

### Login:
* Endpoint: `/api/user/login/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
* Parameters: passed in the request body as JSON:
    `{
    "username": "...",
    "password": "..."
    }`
* Successful response:
`{
    "api_key": "...",
    "success": true,
    "username": "..."
}`
* Failure response:
`{
    "reason": "incorrect username/password",
    "success": false
}`

### Register:
* Endpoint: `/api/user/register/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
* Parameters: passed in the request body as JSON:
    `{
    "username": "...",
    "password": "..."
    }`
* Successful response:
`{
    "api_key": "...",
    "success": true,
    "username": "..."
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### Logout:
* Endpoint: `/api/user/logout/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Successful response:
`{
    "success": true
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### Get User Info:
* Endpoint: `/api/user/<id>/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Successful response:
`{
  "date_joined": "2018-04-21T18:03:50",
  "first_name": "",
  "id": 5,
  "is_active": true,
  "is_staff": false,
  "last_login": "2018-04-21T18:04:12.425781",
  "last_name": "",
  "resource_uri": "/api/user/5/",
  "username": "ajbienz@purdue.edu"
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

## Classification functions

### List classifications
* Endpoint: `/api/classification/<id>/`
* Method: GET
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* URL Params:
    * `limit`: optional, number of items to return. Default = 20.
    * `offset`: optional, index from which to start listing objects. Default = 0. Useful for paging through results.
* Successful response:
`{
  "meta": {
    "limit": 20,
    "next": null,
    "offset": 0,
    "previous": null,
    "total_count": 1
  },
  "objects": [
    {
      "confidence": "100%",
      "id": 3,
      "photo": "img/arch_LRkl7FW.jpg",
      "resource_uri": "/api/classification/3/",
      "result": "ur mom lol"
    }
  ]
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### Get classification info:
* Endpoint: `/api/classification/<id>/`
* Method: GET
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Successful response:
`{
  "confidence": "100%",
  "id": 3,
  "photo": "img/arch_LRkl7FW.jpg",
  "resource_uri": "/api/classification/3/",
  "result": "ur mom lol"
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### List classifications for user
Coming soon...

### Post new classification
Coming soon...
