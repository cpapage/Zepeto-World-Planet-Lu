import { Button } from 'UnityEngine.UI';
import { SceneManager } from 'UnityEngine.SceneManagement';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject } from 'UnityEngine';

/**
 * This script implements the title screen
 * @author Chris Papageorge
 */
export default class TitleScreen extends ZepetoScriptBehaviour {
    public StartButton : Button;

    /**The How to Play button. */
    public HTP_Button : Button;
    public BackButton : Button;
    public Title_Panel : GameObject;
    public HTP_Panel : GameObject;

    Start() {    
        //Activate the title panel and add the listeners.
        this.ActivateTitlePanel();
        this.StartButton.onClick.AddListener(() => {
            SceneManager.LoadScene("World scene");
        })
        this.HTP_Button.onClick.AddListener(() => {
            this.Activate_HTP_Panel();
        })
        this.BackButton.onClick.AddListener(() => {
            this.ActivateTitlePanel();
        })

    }

    /**This activates the title panel and deactivates the How to Play panel. */
    ActivateTitlePanel()
    {
        this.Title_Panel.SetActive(true);
        this.HTP_Panel.SetActive(false);
    }

    /**This activates the How to Play panel and deactivates the Title Panel. */
    Activate_HTP_Panel()
    {
        this.Title_Panel.SetActive(false);
        this.HTP_Panel.SetActive(true);
    }

}