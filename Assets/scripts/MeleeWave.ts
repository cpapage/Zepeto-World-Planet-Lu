import { Collider, ForceMode, GameObject, Rigidbody, Time, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

/**
 * This class implements a melee wave
 * @author Chris Papageorge
 */
export default class MeleeWave extends ZepetoScriptBehaviour {

    public ForceAmount : number = 0;
    public lifeTimeInSeconds : number;
    private _ridgidBody: Rigidbody = null;
    private _timer: number = 0;

    Start() {    
        this._ridgidBody = this.GetComponent<Rigidbody>();
        this._ridgidBody.AddForce(new Vector3(this.transform.forward.x * this.ForceAmount, this.transform.forward.y * this.ForceAmount, this.transform.forward.z * this.ForceAmount), ForceMode.Impulse);
    }

    Update()
    {
        this._timer += Time.deltaTime;
        if(this._timer >= this.lifeTimeInSeconds)
            GameObject.Destroy(this.gameObject);
    }
}