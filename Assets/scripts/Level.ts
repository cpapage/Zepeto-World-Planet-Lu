import { Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

/**
 * This script implements the level component. It has the spawn points of the player and NPCs.
 */
export default class LevelComponent extends ZepetoScriptBehaviour {
    public PlayerSpawnPoint : Transform;
    public NPCSpawnPoints : Transform[];
    public KrenSpawn : Transform;

    Start() {    

    }

}