import LobbyModel from "./LobbyModel";
import PlayerModel from "./PlayerModel";

export default class WorldModel {

    constructor (worldModel) {
        this.worldWidth = worldModel.worldWidth;
        this.worldHeight = worldModel.worldHeight;

        this.lobbyModel = new LobbyModel(worldModel.lobby);
        this.playerModel = new PlayerModel();
        this.opponentPlayerModels = [];
    }


}