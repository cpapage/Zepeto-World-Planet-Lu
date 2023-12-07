import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button } from 'UnityEngine.UI';
import Main from './Main'
import { GameState } from './Config'
import AnimationController from './AnimationController'
import { ZepetoPlayers} from 'ZEPETO.Character.Controller'

/**
 * This script is for the Game Over Window.
 * @author Chris Papageorge
 */
export default class GameOverWindow extends ZepetoScriptBehaviour {
    /**The button that resets the game */
    public ReplayButton : Button;

    Start() {    
        //Add the listener to the button that restarts the game.
        this.ReplayButton.onClick.AddListener(() => {this.RestartGame()});
    }

    /**This method dispays the window by activating it. */
    public ShowWindow() {
        this.gameObject.SetActive(true);
    }

    /**This method hides the window by deactivating it. */
    public HideWindow() {
        this.gameObject.SetActive(false);
    }

    /**This method restarts the game. */
    public RestartGame() {
        this.HideWindow();
        Main.instance.SetGameState(GameState.START);
        const animator : AnimationController = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<AnimationController>();
        animator.ResetOverrides();
        Main.instance.LevelManager.RestartGame();
    }

}