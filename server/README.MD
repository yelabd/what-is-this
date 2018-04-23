# Server

The server is hosted at `http://167.99.228.85:8000`.

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
    "user": {
        "date_joined": "2018-04-21T18:11:27.154812",
        "id": 6,
        "last_login": "2018-04-23T18:59:05.587760",
        "username": "aj1"
    }
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
    "user": {
        "date_joined": "2018-04-21T18:11:27.154812",
        "id": 6,
        "last_login": "2018-04-23T18:59:05.587760",
        "username": "aj1"
    }
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
* Method: GET
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Successful response:
`{
  "date_joined": "2018-04-21T18:03:50",
  "id": 5,
  "last_login": "2018-04-21T18:04:12.425781",
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
    "next": "/api/classification/?limit=20&offset=20",
    "offset": 0,
    "previous": null,
    "total_count": 27
  },
  "objects": [
    {
      "confidence": "100%",
      "id": 3,
      "photo": "/media/img/3.jpeg",
      "resource_uri": "/api/classification/3/",
      "result": "ur mom lol"
    },
    {
      "confidence": "0% not at all",
      "id": 8,
      "photo": "/media/img/8.jpeg",
      "resource_uri": "/api/classification/8/",
      "result": "i have no clue"
    }]
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
  "confidence": "0% not at all",
  "id": 22,
  "photo": "/media/22.jpeg",
  "resource_uri": "/api/classification/22/",
  "result": "i have no clue",
  "user_id": 6
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### List classifications for user
* Endpoint: `/api/user/<userid>/classifications/`
* Method: GET
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Successful response:
`{
  "objects": [
    {
      "confidence": "0% not at all",
      "id": 30,
      "photo": "30.jpeg",
      "result": "i have no clue",
      "user_id": 6
    },
    {
      "confidence": "0% not at all",
      "id": 31,
      "photo": "31.jpeg",
      "result": "i have no clue",
      "user_id": 6
    }],
  "success": true
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### Post new classification
* Endpoint: `/api/user//classification/create/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* Parameters: passed in the request body as JSON. Any image format should be fine.
    `{
    "photo": "data:image/jpeg;base64,[base64datahere]"
    }`
* Successful response:
`{
  "classification": {
    "confidence": "0% not at all",
    "id": 34,
    "photo": "/media/34.jpeg",
    "result": "i have no clue",
    "user_id": 6
  },
  "success": true
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`
