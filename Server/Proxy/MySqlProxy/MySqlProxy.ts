import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { _Facade, _Log4JS, } from "../../../Global";
import { Connection, createConnection, FieldInfo, MysqlError, queryCallback, QueryOptions } from "mysql";
export type SQLSuccessCallBack = ( results?: any, fields?: FieldInfo[])=>void;
export type SQLFailCallBack = ( err?:MysqlError)=>void;
  
export class MySqlProxy extends BaseProxy{
    private m_SQL:Connection;//网络 
    public get SQL():Connection{
        return this.m_SQL;
    } 
    constructor(proxyName:string){
        super(proxyName);
        this.m_SQL =  this.CreateMySQL();
    }
    private CreateMySQL():Connection{
        return createConnection({     
            host     : '39.103.201.92',       
            user     : 'root',              
            password : 'Yuan980520',       
            port: 3306,                   
            database: 'Game' 
          }); 
    }
    private ConnectMySQL(){
        this.m_SQL.connect((err:any)=>{
            if (err) {
               _Log4JS.error('MySQL Connect Fail' + err.stack);
              return;
            }
            _Log4JS.info('MySQL Connect Success' );
        });
    }
    public onLoad(): void {
        this.ConnectMySQL();
    }
    private QueryFuncCallBack(sql:string,signal:boolean,resolve: (value: unknown) => void, reject: (reason?: any) => void){
        this.m_SQL.query(sql,(err: MysqlError | null, results?: any, fields?: FieldInfo[])=>{
            if(err != null || fields == undefined){
                reject(err);//查询失败了
                return;
            }
            if(signal == true && results.length == 0){
                reject("查询数据失败了");
                return;
            }
            resolve(results);
         });
    }
    Execute(sql:string,successFunc:(value:Array<any>)=>void,failFunc?:(error:string)=>void,signal:boolean = true){
        new Promise(this.QueryFuncCallBack.bind(this,sql,signal))
        .then((data:any)=>{successFunc(data); })
        .catch((error:any)=>{ failFunc && failFunc(error)});
    }
} 