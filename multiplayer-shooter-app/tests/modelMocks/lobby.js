import moment from 'moment';

const lobby = {
    "_id": "5ffc41546e59a025e87781dd",
    "gameUser": "5fc8a77f8568a11ea0d91080",
    "gameMap": {
        "_id": "5fc8ab8bad62ec01e8478554",
        "mapTitle": "Forest Green",
        "mapTexturePath": "http://localhost:8080/assets/maps/5fc8ab8bad62ec01e8478554/map-texture.png",
        "mapCollisionTexturePath": "http://localhost:8080/assets/maps/5fc8ab8bad62ec01e8478554/map-collision-texture.png",
        "mapCreatedAt": "2020-12-03T09:10:35.702Z",
        "mapUpdatedAt": "2020-12-03T09:10:35.702Z"
    },
    "gameMode": {
        "_id": "5fec371fc3a8882ff06145ed",
        "gameModeTitle": "Free For All",
        "gameModeCreatedAt": "2020-12-30T08:15:27.396Z",
        "gameModeUpdatedAt": "2020-12-30T08:15:27.396Z"
    },
    "gameStartDatetime": new moment(moment(), "YYYY-MM-DDTHH:mm").utc().format(),
    "gameEndDatetime": new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(10, "minutes"),
    "gameTimeLimit": 3600,
    "gameMaxPlayers": 12,
    "gameCreatedAt": "2021-01-11T12:15:16.507Z",
    "gameUpdatedAt": "2021-01-11T12:15:16.507Z"
}
export default lobby;