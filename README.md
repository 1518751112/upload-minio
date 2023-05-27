# upload-minio-cli

## 简介
使用本工具可以使用脚本命令将文件上传到minio文件存储服务器上

## 注意
需要配置好minio服务器的地址和api授权信息

## 安装

```
npm install -save upload-minio-cli
```

## 使用
### 在需要上传的文件夹下创建一个 uploadMinio.yml配置文件 然后执行命令
```
upload-minio
```
### 也可以指定配置文件
```
upload-minio ./uploadMinio.yml
```

### 配置文件
``` yaml
endPoint: "服务器地址"
port: 端口
useSSL: 是否使用ssl
accessKey: "key"
secretKey: "secret"
prefix: "上传到服务器的前缀/目录"
srcPath: "需要上传的文件目录"
bucket: "储存桶名称"
enableLog: true #是否打印日志
```
