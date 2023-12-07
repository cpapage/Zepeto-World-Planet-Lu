import { GameObject, Quaternion, Resources, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Entity from './Entity';
import LevelComponent from './Level';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import Main from './Main';
import Health from './Health'
import UIManager from './UIManager'
import { EnemyType, EntityType, GameState, PLAYER_HEALTH } from './Config';

/**
 * This class manages the Level.
 * @author Chris Papageorge
 */
export default class LevelManager extends ZepetoScriptBehaviour {
    public GameLevelObject: GameObject;

    /**The list of entities in the level. */
    @HideInInspector() EntityComponents: Map<number, Entity> = null;

    private LevelComponent : LevelComponent = null;
    private hasKilledAllEnemies : boolean = false;

    /**The last index of the table of entity components. */
    @HideInInspector() lastIndex : number = -1;
    @HideInInspector() defeatedLordKren : boolean = false;

    /** This method starts up the game */
    CustomStart() {    
        this.hasKilledAllEnemies = false;
        this.LevelComponent = this.GameLevelObject.GetComponent<LevelComponent>();
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.Teleport(this.LevelComponent.PlayerSpawnPoint.position, Quaternion.identity);
        this.EntityComponents = new Map<number, Entity>();
        this.InstantiateEnemies();
    }

    /**A customized update for the game that's only called while the game is playing. */
    CustomUpdate()
    {
        //Check if all enemies have been killed
        if(!this.hasKilledAllEnemies)
            this.CheckIfAllEnemiesKilled();

        //If Lord Kren is defeated, show the win text, and set the game state to complete.
        if(this.defeatedLordKren)
        {
            Main.instance.SetGameState(GameState.COMPLETE_GAME);
            UIManager.GetInstance().ShowTmpText(UIManager.GetInstance().WinText, 5);
        }
    }

    /**
     * This method checks if all the enemies have been defeated.
     * If No enemy is alive, set hasKilledAllEnemies to true and spawn Lord Kren.
     */
    CheckIfAllEnemiesKilled() {
        let enemyAlive : boolean = false;

        //Iterate through the list of entity components. If an entity type is an enemy, set enemyAlive to true.
        this.EntityComponents.forEach(element => {
            if (element !== null && element.EntityType == EntityType.ENEMY) {
                enemyAlive = true;
            }           
        });

        //If there are no enemies alive, then display the "Kren's appeared" text,
        //but this text cannot be displayed if Lord Kren is defeated.
        if (!enemyAlive && !this.defeatedLordKren)
        {
            UIManager.GetInstance().ShowTmpText(UIManager.GetInstance().KrenText, 5);
            this.hasKilledAllEnemies = true;
            this.SpawnLordKren();
        }
    }

    /**This method resets the game. */
    RestartGame() {
        //clear enemy game objects
        this.EntityComponents.forEach(element => {
            if (element !== null) {
                GameObject.Destroy(element.gameObject);
            }
        });

        //reset player health
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<Health>().health = PLAYER_HEALTH;

        //Reactivate the Controls game objects
        UIManager.GetInstance().UpdateUI();
        Main.instance.ControlsGO.SetActive(true);
        Main.instance.UIZepetoControlsGO.SetActive(true);

        //Deactivate the texts and stop all coroutines.
        UIManager.GetInstance().WinText.gameObject.SetActive(false);
        UIManager.GetInstance().KrenText.gameObject.SetActive(false);
        UIManager.GetInstance().StopAllCoroutines();

        //Set the game state to start.
        Main.instance.SetGameState(GameState.START);
    }

    /**This method instantiates the enemies based on the enums in Configs. */
    private InstantiateEnemies()
    {
        //Iterate through all the enemy types in the configs
        for(let i : number = 0; i < Main.instance.Configs.Level.EnemyTypes.length; i++)
        {
            //Get the enemy type enum as well as the position and rotation.
            const enemyType : EnemyType = Main.instance.Configs.Level.EnemyTypes[i];
            let enemyGO : GameObject = null;
            const spawnPosition : Vector3 = this.LevelComponent.NPCSpawnPoints[i].position;
            const rotation : Quaternion = this.LevelComponent.NPCSpawnPoints[i].rotation;
            switch(enemyType)
            {
                case EnemyType.NONE:
                    break;
                case EnemyType.HENCH:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("Henchman with rifle"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.FISH_BOAT:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("fishing boat"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.TREE_CUT:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("tree cutter"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.TRI_CAGE:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("triceratops cage"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.T_CAGE:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("caged tiger"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.EL_CAGE:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("elephant cage"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.ALND_CAGE:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("alnd cage"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.CLND_CAGE:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("clnd cage"), spawnPosition, rotation) as GameObject;
                    break;
                case EnemyType.KREN:
                    enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("Lord Kren"), spawnPosition, rotation) as GameObject;
                    break;

            }

            //If successful, add the entity component to the table of entity components.
            if(enemyGO != null)
            {
                const enemyComponent : Entity = enemyGO.GetComponent<Entity>();
                enemyComponent.Id = i;
                this.EntityComponents.set(i, enemyComponent);
                this.lastIndex = i;
            }
        }
    }

    /**This method spawns Lord Kren */
    SpawnLordKren()
    {
        let enemyGO : GameObject = null;

        //Get the position and rotation of Kren's spawn point.
        const spawnPosition : Vector3 = this.LevelComponent.KrenSpawn.position;
        const rotation : Quaternion = this.LevelComponent.KrenSpawn.rotation; 

        //Instantiate Lord Kren and add him to the next open table entry.
        enemyGO = GameObject.Instantiate(Resources.Load<GameObject>("Lord Kren"), spawnPosition, rotation) as GameObject;
        const enemyComponent : Entity = enemyGO.GetComponent<Entity>();
        enemyComponent.Id = ++this.lastIndex;
        this.EntityComponents.set(enemyComponent.Id, enemyComponent);
    }

}