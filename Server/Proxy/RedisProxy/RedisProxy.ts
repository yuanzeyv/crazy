import { WebSocketServer,WebSocket } from "ws"; 
import { GlobalConfig } from "../../../Config/config";
import { BaseProxy } from "../../../Frame/BaseProxy/BaseProxy";
import { UserAuthProxy } from "../UserAuthProxy/UserAuthProxy";
import { _Facade, _Log4JS } from "../../../Global";
import Redis from "ioredis";
export class RedisProxy extends BaseProxy{
    static NAME: string ="QQQQQQQQQQ";
    m_Redis:Redis;//网络
    public get Redis():Redis{
        return this.Redis;
    } 
    constructor(proxyName:string){
        super(proxyName);
        this.m_Redis = this.CreateRedis();
    }
    public CreateRedis():Redis{
        return  new Redis({
            host: GlobalConfig.RedisAddr, // Redis host
            password: "Yuanzeyv980520",    
            lazyConnect:true,
            port: GlobalConfig.RedisPort, // Redis port
        });
    } 
    public ConnectRedis(){
        this.m_Redis.connect((err:any)=>{
            if (err) { 
                console.error('Redis Connect Fail:' + err.stack);
              return;
            }
            _Log4JS.info("Redis Connect Success");
        });
    } 
    public onRegister(): void {
        this.ConnectRedis();
    }
}