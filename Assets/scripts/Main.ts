import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Config, { EntityType, GameState, PLAYER_HEALTH } from './Config';
import LevelManager from './LevelManager';
import { Camera, CapsuleCollider, GameObject, RuntimeAnimatorController } from 'UnityEngine';
import { LocalPlayer, SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import Health from './Health';
import Entity from './Entity';
import AnimationController from './AnimationController';

/**
 * This class is the main manager.
 * @author Chris Papageorge
 */
export default class Main extends ZepetoScriptBehaviour {

    /** A static instance of itself for other classes to access */
    public static instance : Main = null;
    public Configs : Config = null;
    public LevelManager : LevelManager = null;
    public LocalPlayer : LocalPlayer = null;
    public ZepetoCamera : Camera = null;
    public playerSpawnPoint : GameObject = null;
    public swimAnimatorController: RuntimeAnimatorController;
    public defaultAnimatorController: RuntimeAnimatorController;
    public DeathAnimatorController: RuntimeAnimatorController;
    public ControlsGO : GameObject;
    public UIZepetoControlsGO : GameObject;
    private _gameState : GameState = null;

    /**
     * This methods returns a static instance of itself so that any class can access it.
     * @returns Main.instance
     */
    public static GetInstance() : Main
    {
        if(Main.instance == undefined)
        {
            Main.instance = GameObject.Find("Main").GetComponent<Main>();
        }

        return this.instance;
    }

    Awake()
    {
        Main.instance = this;
    }

    Start() {    
        this._gameState = GameState.LOADING;
        this.Configs = new Config();
        this.LevelManager = GameObject.Find("LevelManager").GetComponent<LevelManager>();
        this.LoadLocalPlayer();
    }

    Update()
    {
        this.RunStateMachine();
    }

    /**
     * This method gets the current game state and runs the state machine.
     */
    RunStateMachine()
    {
        switch(this._gameState)
        {
            case GameState.NONE:
                this._gameState = GameState.LOADING;
                break;
            case GameState.LOADING:
                break;
            case GameState.START:
                this.LevelManager.CustomStart();
                this._gameState = GameState.CONTINUE;
                break;
            case GameState.CONTINUE:
                this.LevelManager.CustomUpdate();
                break;
            case GameState.COMPLETE_GAME:
                const playerHP : Health = this.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<Health>();

                //If the player's health reaches 0, disable the controllers so that the player cannot move.
                if(playerHP.health <= 0)
                {
                    this.LocalPlayer.zepetoPlayer.character.StopMoving();
                    const animator : AnimationController = this.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<AnimationController>();
                    animator.ApplyDeathAnimation();
                    this.ControlsGO.SetActive(false);
                    this.UIZepetoControlsGO.SetActive(false);
                }
                break;
        }
    }

    /**
     * This Method sets the game state enum.
     * @param gameState The new Game state.
     */
    SetGameState(gameState : GameState)
    {
        this._gameState = gameState;
    }

    /**
     * This method loads in a local player.
     */
    LoadLocalPlayer()
    {
        //Get the position of the player's spawn point, and create the player.
        let info : SpawnInfo = new SpawnInfo();
        info.position = this.playerSpawnPoint.transform.position;
        info.rotation = this.playerSpawnPoint.transform.rotation;
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, info, true);

        //Add a listener on adding the local player.
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Set the local playe to this player, and add the "PLAYER" tag to the player.
            this.LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            this.LocalPlayer.zepetoPlayer.character.gameObject.tag = "PLAYER";
            const collider : CapsuleCollider = this.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<CapsuleCollider>();
            collider.isTrigger = true;
            collider.height = 2;

            //Add an entity component to the player, and assign the type to PLAYER.
            const PEntityComponent = this.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<Entity>();
            PEntityComponent.EntityType = EntityType.PLAYER;

            //Add the health component to the player, and initialize the health to max.
            const hp : Health = this.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<Health>();
            hp.maxHealth = PLAYER_HEALTH;
            hp.health = hp.maxHealth;

            //Add the animation controller component.
            this.LocalPlayer.zepetoPlayer.character.gameObject.AddComponent<AnimationController>();

            //Assign the addresses of the controls and the UIZepetoControls Game objects as well as the camera.
            this.ControlsGO = GameObject.Find("Controls");
            this.UIZepetoControlsGO = GameObject.Find("UIZepetoPlayerControl");
            this.ZepetoCamera = ZepetoPlayers.instance.GetComponentInChildren<Camera>();

            //Finally, set the game state to start.
            this.SetGameState(GameState.START);
        })
    }

}