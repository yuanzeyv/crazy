import { Tree } from "../../Util/RBTree";
import { NodeStatus, NodeType, PortsList } from "./BasicTypes";
import { Blackboard } from "./BlackBoard";

/// This information is used mostly by the XMLParser.
export interface TreeNodeManifest{
    Type:NodeType;
    RegistrationID:string;
    Ports:PortsList;
};

export type PortsRemapping = Map<string,string>;

export interface NodeConfiguration{
  blackboard:Blackboard ;
  input_ports:PortsRemapping ;
  output_ports:PortsRemapping ;
};

export abstract class TreeNode{
  private static sUIDAlloc = 1; 
  private static GetUID(){ return this.sUIDAlloc++;}

  protected mUID:number;
  protected mName:string = "";
  protected mNodeStatus:NodeStatus;
  protected mRegisterationID:string;
  public constructor(name:string){
    this.mName = name;
    this.mNodeStatus = NodeStatus.IDLE;
    this.mUID = TreeNode.GetUID();
    this.mRegisterationID ="";
  }
  //节点的类型
  public abstract Tick():NodeStatus;
  // The method used to interrupt the execution of a RUNNING node.
  // Only Async nodes that may return RUNNING should implement it.
  public abstract Halt():void;
  public IsHalted():boolean{
    return this.mNodeStatus == NodeStatus.IDLE;
  }
  public Status():NodeStatus{
    return this.mNodeStatus;
  }
  public Name():string{
    return this.mName;
  }

  //public WaitVaildStatus():NodeStatus{}

  public abstract Type():NodeType;
  
  public UID(){
    return this.mUID;
  }

  public RegistrationID():string{
    return this.mRegisterationID;
  }

  public SetRegistrationID(id:string):void{
    this.mRegisterationID = id;
  }
 
  public SetStatus(status:NodeStatus) {
    this.mNodeStatus = status;
  }
  public ExecuteTick():NodeStatus {
    let new_status:NodeStatus = this.mNodeStatus;
    // a pre-condition may return the new status.
    // In this case it override the actual tick()
    //if( pre_condition_callback_ ){
    //    if(auto res = pre_condition_callback_(*this, status_)){
    //        new_status = res.value();
    //    }
    //} else {
        new_status = this.Tick();
    //}

    // a post-condition may overwrite the result of the tick
    // with its own result.
    //if( post_condition_callback_ ) {
    //    if(auto res = post_condition_callback_(*this, status_, new_status))  {
    //       new_status = res.value();
    //    }
    //}
    this.SetStatus(new_status);
    return new_status;
  }  
};