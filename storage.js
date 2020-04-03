var fs = require('fs');
var mysql = require('mysql');
var request = require('request');

class Camera {

    constructor(id, name, location, refreshRate, ip){
        
        this.id = id;
        this.name = name;
        this.location = location;
        this.refreshRate = refreshRate;
        this.ip = ip;

        // Set last refresh to go on work start
        this.lastRefresh = new Date().setSeconds(
            new Date().getSeconds() - this.refreshRate
        );
      
    }
  
    isReady(){
        var now = new Date();

        if ((now - this.lastRefresh)/1000 > this.refreshRate){
            this.lastRefresh = now;
            return true;
        }
        return false;
    }
}

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    // Query database
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    // Close connection
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if(err)
                    return reject(err);
                resolve();
            });
        });
    }
}

class Storage{
    constructor(saveLocation){
        // Setup paths
        if(!saveLocation){
            saveLocation = './images/';
        }
        this.saveLocation = saveLocation;
        
        // Create paths
        if (!fs.existsSync(this.saveLocation)){
            fs.mkdirSync(this.saveLocation);
        }

        // Init database
        this.db = new Database({
            host: "localhost",
            user: 'arun',
            password: 'password',
            database: 'MyCCTV'
        });
        this.dbSetup();

    }

    // Get cameras from DB
    getCameras(){
        return new Promise((resolve, reject) => {
            var cameras = [];

            this.db.query("SELECT * FROM Cameras").then(responce => {
                
                for (let i = 0; i < responce.length; i++) {
                    cameras.push(new Camera(
                        responce[i]['ID'],
                        responce[i]['Name'],
                        responce[i]['Location'],
                        responce[i]['Refresh_Rate'],
                        responce[i]['IP']
                    ));              
                }

                resolve(cameras);

            }).catch(err => {reject(err)});
        });
    }

    // Add camera to DB
    addCamera(camera){
        return new Promise((resolve, reject) => {
            this.db.query(`
                INSERT INTO Cameras (Name, Location, Refresh_Rate, IP)
                VALUES (
                '${camera["name"]}',
                '${camera["location"]}',
                '${camera["refreshRate"]}',
                '${camera["ip"]}');`
            ).then(result => {
                resolve(result.insertId)
            }).catch(err => {reject(err)});
        });
    }

    // Remove camera from CCTV
    removeCamera(camera){
        this.db.query(`
            DELETE FROM Cameras WHERE ID=${camera.id}`
        ).catch(err => {throw err;});

        // TODO: Delete all files on record in database

        this.db.query(`
            DELETE FROM ImageRecord WHERE ID=${camera.id}`
        ).catch(err => {throw err;});
    }

    // Save image on file with link in db
    takeImage(camera){

        var saveLocation = this.saveLocation;
        var db = this.db;
        
        request.head(camera.ip, function(err, res, body){

            if (!err){
                // Create file path
                var fileType = res.headers['content-type'].split('/')[1]
                var fileName = `${camera.id}_${Date.now()}.${fileType}`
                var filePath = saveLocation + fileName;

                // Save image on disk
                request(camera.ip).pipe(fs.createWriteStream(filePath)).on('close', function(){
                    
                    // Add file link to database
                    db.query(
                        `INSERT INTO ImageRecord (ID, File_Name)
                        VALUES ('${camera.id}', '${filePath}');`
                    ).catch(err => {
                        throw err;
                    });

                });
            }
            else
                console.log('Couldnt download ' + camera.ip)
        });

    }

    // Setup tables
    dbSetup(){

        var cameraTable = `
        CREATE TABLE Cameras (
            ID INT AUTO_INCREMENT,
            Name TEXT NOT NULL,
            Location TEXT,
            Refresh_Rate INT NOT NULL,
            IP TEXT NOT NULL,
            PRIMARY KEY (ID)
        );`

        this.db.query(cameraTable).then(result => {
            console.log('Created `cameraTable` Table\n')
        }).catch(error => {
            if(!error.message.includes('ER_TABLE_EXISTS_ERROR'))
                throw error;
            else
                console.log('`cameraTable` already exists\n')
        });

        var imageRecordTable = `
        CREATE TABLE ImageRecord (
            ID INT NOT NULL,
            File_Name TEXT NOT NULL,
            Time_Taken TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`

        this.db.query(imageRecordTable).then(result => {
            console.log('Created `imageRecordTable` SQL Table\n')
        }).catch(error => {
            if(!error.message.includes('ER_TABLE_EXISTS_ERROR'))
                throw error;
            else
                console.log('`imageRecordTable` already exists\n')
        });
        
    }

    // Get each camera's latest image
    getLatestImages(){
        return new Promise((resolve, reject) => {
            this.db.query(`
                SELECT ID, File_Name, Time_Taken 
                FROM ImageRecord s1
                WHERE Time_Taken = (SELECT MAX(Time_Taken) FROM ImageRecord s2 WHERE s1.ID = s2.ID)
                ORDER BY ID, Time_Taken;    
            `).then(responce => {
                resolve(responce);
            }).catch(err => {reject(err);});
        })
    }

    // Return date-ordered list of image urls
    getCameraImages(camera){
        return new Promise((resolve, reject) => {
            this.db.query(`
                SELECT File_Name, Time_Taken
                FROM ImageRecord
                WHERE ID = ${camera.id} ORDER BY Time_Taken;
            `).then(responce => {
                resolve(responce);
            }).catch(err => {reject(err);});
        })
    }

}

module.exports.Storage = Storage;
module.exports.Camera = Camera;