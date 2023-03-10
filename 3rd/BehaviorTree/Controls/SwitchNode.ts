import { RUNNING } from "behaviortree";
import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode";

/**
 * @brief The SwitchNode is equivalent to a switch statement, where a certain
 * branch (child) is executed according to the value of a blackboard entry.
 *
 * Note that the same behaviour can be achieved with multiple Sequences, Fallbacks and
 * Conditions reading the blackboard, but switch is shorter and more readable.
 *
 * Example usage:
 *

<Switch3 variable="{var}"  case_1="1" case_2="42" case_3="666" >
   <ActionA name="action_when_var_eq_1" />
   <ActionB name="action_when_var_eq_42" />
   <ActionC name="action_when_var_eq_666" />
   <ActionD name="default_action" />
 </Switch3>

When the SwitchNode is executed (Switch3 is a node with 3 cases)
the "variable" will be compared to the cases and execute the correct child
or the default one (last).
 *
 */
export class SwitchNode extends ControlNode{
    public mRunningChild:number = -1;
    public mCount:number = 6;
    constructor(name:string){
        super(name);
        //this.mCount = count;
        this.SetRegistrationID("Switch");
    }

    public Halt(): void {
        this.mRunningChild = -1;
        super.Halt();
    } 

    public Tick(): NodeStatus {
        let case_port_names:Array<string> = new Array<string>("case_1", "case_2", "case_3", "case_4", "case_5", "case_6", "case_7", "case_8", "case_9");
        let variable:string;
        let value:string;
        let child_index:number = this.mCount; // default index;
        if( this.ChildrenCount() != this.mCount +1)
            throw "Wrong number of children in SwitchNode; must be (num_cases + default)";
        return NodeStatus.FAILURE;
    }
}   