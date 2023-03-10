import { NodeStatus, NodeType } from "./BasicTypes";
import { TreeNode } from "./TreeNode";

export abstract class ActionNodeBase extends TreeNode {
    public Type(): NodeType { return NodeType.ACTION; }
}
/**
 * @brief The SyncActionNode is an ActionNode that
 * explicitly prevents the status RUNNING and doesn't require
 * an implementation of halt().
 */
export abstract class SyncActionNode extends ActionNodeBase
{
    public Halt(): void {
        this.SetStatus(NodeStatus.IDLE);

    }
    /// throws if the derived class return RUNNING.
    public ExecuteTick():NodeStatus{
        let stat:NodeStatus = super.ExecuteTick();
        if( stat == NodeStatus.RUNNING) {
          console.log("SyncActionNode MUST never return RUNNING");
        }
        return stat;
    } 
};


/**
 * @brief The AsyncActionNode uses a different thread, where the action will be
 * executed.
 *
 * IMPORTANT: this action is quite hard to implement correctly. Please be sure that you know what you are doing.
 *
 * - In your overriden tick() method, you must check periodically
 *   the result of the method isHaltRequested() and stop your execution accordingly.
 *
 * - in the overriden halt() method, you can do some cleanup, but do not forget to
 *   invoke the base class method AsyncActionNode::halt();
 *
 * - remember, with few exceptions, a halted AsyncAction must return NodeStatus::IDLE.
 *
 * For a complete example, look at __AsyncActionTest__ in action_test_node.h in the folder test.
 *
 * NOTE: when the thread is completed, i.e. the tick() returns its status,
 * a TreeNode::emitStateChanged() will be called.
 */

export abstract class AsyncActionNode extends ActionNodeBase{ 
    protected mAsyncObj:Promise<unknown> | undefined;

    public IsHaltRequested():boolean{
        return this.mAsyncObj != undefined;
    }

    // This method spawn a new thread. Do NOT remove the "final" keyword.
    public ExecuteTick(): NodeStatus {
        if ( this.Status() == NodeStatus.IDLE ){
            this.SetStatus( NodeStatus.RUNNING );
            try{
                this.SetStatus(this.Tick());
            }catch(data:any){
                console.log(data);
                this.SetStatus(NodeStatus.IDLE);
            }
        }
        return this.Status();
    }
    public Halt(): void {
        
    }

}
/**
 * @brief The ActionNode is the prefered way to implement asynchronous Actions.
 * It is actually easier to use correctly, when compared with AsyncAction
 *
 * It is particularly useful when your code contains a request-reply pattern,
 * i.e. when the actions sends an asychronous request, then checks periodically
 * if the reply has been received and, eventually, analyze the reply to determine
 * if the result is SUCCESS or FAILURE.
 *
 * -) an action that was in IDLE state will call onStart()
 *
 * -) A RUNNING action will call onRunning()
 *
 * -) if halted, method onHalted() is invoked
 */
export abstract class StatefulActionNode extends ActionNodeBase {
    public Tick(): NodeStatus{
        let initial_status:NodeStatus = this.Status();
        if( initial_status == NodeStatus.IDLE ){
            let new_status:NodeStatus = this.OnStart();
            if(new_status == NodeStatus.IDLE)
                throw "StatefulActionNode::onStart() must not return IDLE";
            return new_status;
        }
        if(initial_status == NodeStatus.RUNNING){
            let new_status:NodeStatus = this.OnRunning();
            if( new_status == NodeStatus.IDLE)
                throw "StatefulActionNode::onRunning() must not return IDLE";
            return new_status;
        }
        return initial_status;
    } 
    
    public Halt(): void {
        if( this.Status() == NodeStatus.RUNNING)
          this.OnHalted();
        this.SetStatus(NodeStatus.IDLE);
    }

    // method to be called at the beginning.
    // If it returns RUNNING, this becomes an asychronous node.
    protected abstract OnStart():NodeStatus;
    // method invoked by a RUNNING action.
    protected abstract OnRunning():NodeStatus;
    // when the method halt() is called and the action is RUNNING, this method is invoked.
    // This is a convenient place todo a cleanup, if needed.
    protected abstract OnHalted():NodeStatus; 
};

/**
 * @brief The SimpleActionNode provides an easy to use SyncActionNode.
 * The user should simply provide a callback with this signature
 *
 *    BT::NodeStatus functionName(TreeNode&)
 *
 * This avoids the hassle of inheriting from a ActionNode.
 *
 * Using lambdas or std::bind it is easy to pass a pointer to a method.
 * SimpleActionNode is executed synchronously and does not support halting.
 * NodeParameters aren't supported.
 */ 
export type TickFunctorAction = (node:TreeNode)=>NodeStatus;
export class SimpleActionNode extends SyncActionNode{
    private mTickFunction:TickFunctorAction;
    public constructor(name:string,func:TickFunctorAction){
        super(name);
        this.mTickFunction = func;
    } 
    public Tick(): NodeStatus {
        let prev_status:NodeStatus = this.Status();
        if (prev_status == NodeStatus.IDLE){
            this.SetStatus(NodeStatus.RUNNING);
            prev_status = NodeStatus.RUNNING;
        }
        let status:NodeStatus = this.mTickFunction(this);
        if(status != prev_status)
            this.SetStatus(status);
        return status;
    }
};