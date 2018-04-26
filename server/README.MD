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
      "id": 13,
      "category": {
        "id": 1,
        "value": "Flowers"
      },
      "photo": "/media/13.jpeg",
      "result": [
        {
          "value": "daisy",
          "confidence": "0.9926299"
        },
        {
          "value": "tulips",
          "confidence": "0.002786922"
        },
        {
          "value": "sunflowers",
          "confidence": "0.0027608534"
        },
        {
          "value": "dandelion",
          "confidence": "0.0016336078"
        },
        {
          "value": "roses",
          "confidence": "0.00018868537"
        }
      ],
      "user_id": 1
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
  "id": 18,
  "photo": "/media/18_SDiErgs.jpeg",
  "resource_uri": "/api/classification/18/",
  "user_id": 1,
  "result": [
    {
      "value": "daisy",
      "confidence": "0.9926299"
    },
    {
      "value": "tulips",
      "confidence": "0.002786922"
    },
    {
      "value": "sunflowers",
      "confidence": "0.0027608534"
    },
    {
      "value": "dandelion",
      "confidence": "0.0016336078"
    },
    {
      "value": "roses",
      "confidence": "0.00018868537"
    }
  ]
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
      "category": {
        "id": 1,
        "value": "Flowers"
      },
      "id": 19,
      "photo": "/media/19_UUavy9c.jpeg",
      "result": [
        {
          "confidence": "0.9926299",
          "value": "daisy"
        },
        {
          "confidence": "0.002786922",
          "value": "tulips"
        },
        {
          "confidence": "0.0027608534",
          "value": "sunflowers"
        },
        {
          "confidence": "0.0016336078",
          "value": "dandelion"
        },
        {
          "confidence": "0.00018868537",
          "value": "roses"
        }
      ],
      "user_id": 1
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
    "category_id": 0,
    "photo": "data:image/jpeg;base64,[base64datahere]"
    }`
* Successful response:
`{
  "classification": {
    "category": {
      "id": 1,
      "value": "Flowers"
    },
    "id": 20,
    "photo": "/media/20_DCBd1QU.jpeg",
    "result": [
      {
        "confidence": "0.9926299",
        "value": "daisy"
      },
      {
        "confidence": "0.002786922",
        "value": "tulips"
      },
      {
        "confidence": "0.0027608534",
        "value": "sunflowers"
      },
      {
        "confidence": "0.0016336078",
        "value": "dandelion"
      },
      {
        "confidence": "0.00018868537",
        "value": "roses"
      }
    ],
    "user_id": 1
  },
  "success": true
}
* Failure response:
`{
    "reason": "...",
    "success": false
}`

### Get available Classification Categories
* Endpoint: `/api/classification_category/`
* Method: POST
* Headers:
    * `Content-Type: application/json`
    * `Authorization: ApiKey username:api_key`
        * Note: auth string is **NOT** base64 encoded like basic authorization -- just plaintext in the format above
* * URL Params:
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
      "id": 1,
      "resource_uri": "/api/classification_category/1/",
      "value": "Flowers"
    }
  ]
}`
* Failure response:
`{
    "reason": "...",
    "success": false
}`