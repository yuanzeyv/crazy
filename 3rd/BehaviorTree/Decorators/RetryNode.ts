import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode";
/**
 * @brief The RetryNode is used to execute a child several times if it fails.
 *
 * If the child returns SUCCESS, the loop is stopped and this node
 * returns SUCCESS.
 *
 * If the child returns FAILURE, this node will try again up to N times
 * (N is read from port "num_attempts").
 *
 * Example:
 *
 * <RetryUntilSuccessful num_attempts="3">
 *     <OpenDoor/>
 * </RetryUntilSuccessful>
 *
 * Note:
 * RetryNodeTypo is only included to support the depricated typo
 * "RetryUntilSuccesful" (note the single 's' in Succesful)
 */
export class RetryNode extends DecoratorNode{
    private mCyclesNum:number = 0;
    private mTryIndex:number= 0;
    constructor(name:string){
        super(name);
        //this.mCyclesNum =ntries;
        this.SetRegistrationID("Repeat");
    }
    public Tick(): NodeStatus {
        this.SetStatus(NodeStatus.RUNNING);
        while(this.mTryIndex < this.mCyclesNum || this.mCyclesNum == -1){
            let childState:NodeStatus = this.Child().ExecuteTick();
            switch(childState){
                case NodeStatus.SUCCESS:
                    this.mTryIndex = 0;
                    this.HaltChild();
                    return NodeStatus.SUCCESS;
                case NodeStatus.FAILURE:
                    this.mTryIndex++;
                    this.HaltChild();
                    return NodeStatus.FAILURE;
                case NodeStatus.RUNNING:    
                    return NodeStatus.RUNNING;
                case NodeStatus.IDLE:
                    throw "A child node must never return IDLE";
            } 
        }
        this.mTryIndex = 0;
        return NodeStatus.SUCCESS;
    }
    public Halt(): void {
        this.mTryIndex = 0;
        super.Halt();
    }
}