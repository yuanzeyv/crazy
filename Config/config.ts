import { Configuration } from "log4js";

export class GlobalConfig{ 
    public static ServerPort:number = 8888;//服务器端口地址

    public static RedisAddr:string = "39.103.201.92";
    public static RedisPort:number = 6379;

    public static Log4:Configuration = {
        appenders: {
            console: { type: 'console' },
            Server: {
                type: "dateFile",
                filename: "logs/Server",
                pattern: "-yyyy-MM-dd.log",
                alwaysIncludePattern: true,
                category: "normal",
                maxLogSize: 1024 * 12,
            }
        },
        categories: {
            default: {
                appenders: ["Server","console"],
                /**
                 * 高于我们自己设置的都会输出到对应文件中去
                 */
                level: "trace"
            }
        }
    }
};
 