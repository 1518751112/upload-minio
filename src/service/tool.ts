// 获取当前命令行 后面的参数
import * as path from 'path'
import {join} from 'path'
import * as fs from 'fs-extra'
import * as fs2 from 'fs'
import * as Minio from 'minio'
import * as mime from 'mime'

export interface MinioInfo {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucket: string;
    url?: string;
    enableLog?: boolean;
    srcPath?: string;
    prefix?: string;
    exclude?: string|RegExp;
}
export class Tool {

    options: MinioInfo;
    cosRun: Minio.Client;
    constructor(options:MinioInfo) {
        this.options = options;
        if(this.options.url)this.options.url=this.options.url.replace(/\/$/,'')
        this.cosRun = new Minio.Client(options);
    }

    async start() {
        const {srcPath} = this.options
        let folder
        if (srcPath && (srcPath.indexOf(':/') != -1 || srcPath.indexOf(':\\') != -1)) {
            folder = srcPath
        } else {
            folder = join(process.cwd(), srcPath || '')
        }
        let outputPath = folder

        this.log('---UPLOAD START---')
        let list = this.browserFiles(outputPath)
        if (this.options.exclude) {
            this.options.exclude = new RegExp(this.options.exclude)
            // @ts-ignore
            list = list.filter((vo) => this.options.exclude.test(vo))
        }
        let prefix = this.options.prefix || ''
        for (let i = 0; i < list.length; i++) {
            const filePath = list[i];
            const key = path.join(prefix, filePath.slice(outputPath.length)).replace(/\\/g, '/')
            this.log(i, key, filePath)
            //获取文件信息
            await this.cosRun.putObject(this.options.bucket,key,fs2.readFileSync(filePath),{
                'Content-Type': mime.getType(filePath),
            })
        }
        this.log(`---UPLOAD END---`)
    }

    log(...rest) {
        if (this.options.enableLog) {
            console.log.apply(this, rest)
        }
    }
    browserFiles(folder:string, list?:string[]):string[]{
        list = list || []
        fs.readdirSync(folder).forEach(file=>{
            let filePath = path.join(folder, file)
            let stat = fs.statSync(filePath)
            if (stat.isDirectory()){
                this.browserFiles(filePath, list)
            }else if (file !== '.DS_Store' && file !== 'Thumbs.db'){
                list.push(filePath)
            }
        })
        return list
    }

}

