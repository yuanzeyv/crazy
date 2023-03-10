import { NodeStatus } from "../BasicTypes";
import { ControlNode } from "../ControlNode"
import { TreeNode } from "../TreeNode";

export class ParallelNode extends ControlNode{
    public static THRESHOLD_SUCCESS:string = "success_threshold";
    public static THRESHOLD_FAILURE:string = "failure_threshold";
    private mSuccessThreshold:number = 0;
    private mFailureThreshold:number = 0;
    private mSkipList:Set<number> = new Set<number>();
    
    constructor(name:string,successThreshold:number = 1,failureThreshold:number = 1){
        super(name);
        this.SetRegistrationID("Parallel");
        this.mSuccessThreshold = successThreshold;
        this.mFailureThreshold = failureThreshold;
    }
    public Halt(): void {
        this.mSkipList.clear();
        super.Halt();
    }
    public ThresholdM():number{
        return this.mSuccessThreshold;
    }
    public ThresholdFM():number{
        return this.mFailureThreshold;
    }
    public SetThresholdM(threshold_M:number):void{
        this.mSuccessThreshold = threshold_M;
    }
    public SetThresholdFM(threshold_M:number):void{
        this.mFailureThreshold = threshold_M;
    }

    public Tick(): NodeStatus {
        let successChildredNum:number = 0;
        let failureChildredNum:number = 0;
        let childrenCount = this.mChildrenNodes.length;
        if(childrenCount < this.mSuccessThreshold)
            throw "Number of children is less than threshold. Can never succeed.";
        if(childrenCount < this.mFailureThreshold)
            throw "Number of children is less than threshold. Can never fail.";
        this.mChildrenNodes.forEach((node:TreeNode,index:number)=>{
            let inSkipList:boolean = this.mSkipList.has(index);
            let childStatus:NodeStatus;
            if( inSkipList)
                childStatus = node.Status();                       
            else 
                childStatus = node.ExecuteTick();
            switch(childStatus){
                case NodeStatus.SUCCESS:{
                    if(!inSkipList)
                        this.mSkipList.add(index);
                    this.mSuccessThreshold++;
                    if(successChildredNum == successChildredNum){
                        this.mSkipList.clear();
                        this.HaltChildrens();
                        return NodeStatus.SUCCESS;
                    }
                }
                break;
                case NodeStatus.FAILURE:{
                    if(!inSkipList) 
                        this.mSkipList.add(index);
                    this.mFailureThreshold++;
                    if((this.mFailureThreshold > childrenCount - this.mSuccessThreshold) || 
                    (this.mFailureThreshold == failureChildredNum)){
                        this.mSkipList.clear();
                        this.HaltChildrens();
                        return NodeStatus.FAILURE;
                    }
                }
                break;
                case NodeStatus.RUNNING:
                    break;
                default:
                    throw "A child node must never return IDLE";
            }
        });
        return NodeStatus.RUNNING;
    }
}