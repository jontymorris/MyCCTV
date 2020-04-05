## My CCTV

A webapp to display multiple CCTV sources in one easy to organise page, allowing them to be saved and viewed in a timelapse. Someone with access to public CCTV cameras in their town may want to use this to see what is going on, even when they are away from their computer.

### Setup the server

#### Step 1
Install the Prerequisites:
`NodeJS`
`MySQL Server`

#### Step 2
Edit the DB settings accordingly

`./config.js`
```js
...
config.database = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'MyCCTV'
}
...
```
> You will need to create a new database on the MySQL server with the same name above

#### Install packages
Run `npm install` to install required modules

### Start the server

Simply run the following command
`node server.js`

### REST API
In the case you don't want to use the provided Frontend **(coming soon)**, here are the API Calls you may need.

### Get all cameras

#### Request
`[GET] /getCameras`
#### Responce
```json
[
  {
    "id": 5,
    "name": "surf",
    "location": "marine parade",
    "refreshRate": 60,
    "ip": "http://202.56.51.237:8888/cgi-bin/camera",
    "lastRefresh": 1586052350109
  },
  {
    "id": 6,
    "name": "traffic1",
    "location": "marine parade",
    "refreshRate": 60,
    "ip": "https://www.trafficnz.info/camera/739.jpg",
    "lastRefresh": 1586052350109
  },
  ...
]
```

### Get all images from a camera

#### Request
`[GET] /getImages?id=6`

#### Responce
```json
[
  {
    "File_Name": "./images/6_1585887198695.jpeg",
    "Time_Taken": "2020-04-02T15:13:18.000Z"
  },
  {
    "File_Name": "./images/6_1585887258725.jpeg",
    "Time_Taken": "2020-04-02T15:14:18.000Z"
  },
  {
    "File_Name": "./images/6_1585887318873.jpeg",
    "Time_Taken": "2020-04-02T15:15:19.000Z"
  },
  ...
]
```

### More calls coming soon!

