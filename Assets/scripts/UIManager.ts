import { TextMeshProUGUI } from 'TMPro';
import { Color, GameObject, Resources, Time, WaitForSeconds } from 'UnityEngine';
import { LocalPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Health from './Health';
import GameOverWindow from './GameOverWindow'

/**
 * This script manages the player's UI.
 * @author Chris Papageorge.
 */
export default class UIManager extends ZepetoScriptBehaviour {

    /**
     * This method gets a static instance of itself for other classes to access.
     * @returns UIManager.instance
     */
    public static GetInstance() : UIManager
    {
        if(UIManager.instance == undefined)
        {
            UIManager.instance = GameObject.Find("UIManager").GetComponent<UIManager>();
        }

        return UIManager.instance;
    }
    public PlayerHealth : TextMeshProUGUI;
    public KrenText : TextMeshProUGUI;
    public WinText : TextMeshProUGUI;

    /**The game over screen game object. */
    GameOverScreenGO : GameObject;

    private static instance : UIManager;

    /**The game over screen window. */
    private _gameOverScreen : GameOverWindow;

    Awake()
    {
        this.gameObject.name = "UIManager";
    }

    Start() {    
        this._gameOverScreen = this.GameOverScreenGO.GetComponent<GameOverWindow>();
        this.WinText.gameObject.SetActive(false);
        this.KrenText.gameObject.SetActive(false);
        this._gameOverScreen.HideWindow();
    }

    /**This method returns the game over screen window. */
    public get GameOverScreen() : GameOverWindow
    {
        if(this._gameOverScreen = undefined)
            this._gameOverScreen = this.GameOverScreenGO.GetComponent<GameOverWindow>();
        return this._gameOverScreen;
    }

    /**This method updates the health UI, and if the health is <= 0, then it shows the game over window. */
    public UpdateUI()
    {
        let player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        let playerHealth : Health = player.zepetoPlayer.character.gameObject.GetComponent<Health>();
        this.PlayerHealth.text = playerHealth.health.toString();
        if(playerHealth.health <= 0)
        {
            this._gameOverScreen.ShowWindow();
        }
    }

    /**
     * This method shows a text on screen for a certain amount of time.
     * @param Text The text to display
     * @param Timer The duration of the text
     */
    public ShowTmpText(Text : TextMeshProUGUI, Timer : number)
    {
        Text.gameObject.SetActive(true);
        Text.color.a = 1;
        this.StartCoroutine(this.fadeText(Text, Timer));
    }

    /**
     * This method waits a certain amount of time, and then it fades the text away.
     * @param Text The text to display
     * @param Timer The duration of the text
     */
    *fadeText(Text : TextMeshProUGUI, Timer : number)
    {
        let c : Color = new Color(0,0,0,1);
        let _timer : number = 0;
        while (c.a >= 0)
        {
            _timer += Time.deltaTime;
            if(_timer >= Timer)
            {
                c.a -= Time.deltaTime;
                Text.color = c;
            }
            yield;
        }
    }

}