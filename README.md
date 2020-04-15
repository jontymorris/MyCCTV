## My CCTV

A webapp to display multiple CCTV sources in one easy to organise page, allowing them to be saved and viewed in a timelapse. Someone with access to public CCTV cameras in their town may want to use this to see what is going on, even when they are away from their computer.

### Setup the server

#### Step 1
Install the Prerequisites:
`NodeJS`
`MongoDB`

#### Install packages
Run `npm install` to install required modules

### Start the server

Simply run the following command

`npm run [all/server/client]`
> 'all' runs both server client

### REST API
In the case you don't want to use the provided Frontend, here are the API Calls you may need.

### Get all cameras

#### Request
`[GET] /cameras`
#### Responce
```json
{
    "status":"success",
    "message":"Camera retrieved successfully",
    "data":[
        {"images":[],
        "_id":"5e8d271c7d4d6b06ff8ea183",
        "name":"A skate park",
        "ip":"...",
        "refreshRate":60,
        "location":"Somewhere",
        "__v":11},
    ]
}
```

### Get a single camera

#### Request
`[GET] /camera/:id`
#### Parameters
```
'id' of Camera to get
```

### Add a camera

#### Request
`[POST] /cameras`
#### Parameters
```
'name'
'location' (optional)
'refreshRate'
'ip'
```

### Delete a camera

#### Request
`[DELETE] /camera/:id`
#### Parameters
```
'id' of Camera to delete
```

### Modify a camera

#### Request
`[PUT/PATCH] /camera/:id`
#### Parameters
```
'name'
'location' (optional)
'refreshRate'
'ip'
```
