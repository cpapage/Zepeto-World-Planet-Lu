import { Collider, ForceMode, Rigidbody, Rigidbody2D, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

/**
 * An incomplete implementation of water.
 * @author Chris Papageorge
 */
export default class Water extends ZepetoScriptBehaviour {

    Start() {    

    }

    OnTriggerEnter(other : Collider)
    {
        const _ridgidBody : Rigidbody = other.GetComponent<Rigidbody>();
        if(_ridgidBody != null)
            _ridgidBody.AddForce(Vector3.up, ForceMode.Acceleration);
        else if(other.tag == "PLAYER"){}
    }

}