一个前端工具函数库

# 工具函数目录

## 1. 从音频文件中解析出（专辑名称，歌手名称，专辑图片，采样率...）等详情信息 parseAudioInfo

### 使用方法：

```ts
/**
 * 
 * @param content 文件，form-data --- 通过本地上传后返回的file 或者 通过说通过<input type="file">返回的file
 * @returns promise {singer, base64String} 歌手，base64格式的专辑图片
 * @description 解析音频文件的详情（专辑名称，歌手名称，专辑图片...）
 */
 parseAudioInfo(content:any):Promise 
 resolve({
	name, // 歌曲名称
    album, // 专辑名称
    singer, // 歌手名称
    imageBase64, // 专辑图片
 })
```

## 2. 解析音频文件时长 parseAudioDuration

### 使用方法：

```ts
/**
 * 
 * @param content 文件 form-data  --- 通过本地上传后返回的file 或者 通过说通过<input type="file">返回的file
 * @returns promise {duration:number} 时长
 * @description 解析音频文件时长
 */
  // 使用new Audio解析音频文件，会比较快，但是对aac格式的文件解析不准确，相差还挺大
  // 使用new AudioContext解析音频文件，速度比较慢，但是对aac格式的文件解析准确。
parseAudioDuration(content:any):Promise
resolve({
    duration
})
```

## 3. 获取音频文件的内部信息（专辑名称，专辑图片，歌手，歌名等）与 音频文件的播放时长都获取

```ts
/**
 * @description 把秒钟转换成时分秒格式,为了尽量在切换npm包后不影响原项目的代码而保留该名称方法
 * @param second number 多少秒
 * @param isLimit 是否存在24小时的上限
 * @returns 返回 string 00:00:00
 */
getAudioFileTime(file:{raw:any},cb:()=>{})
return {
	...file,// 入参的文件
	album, // 专辑名称
	songName, // 歌曲名称
	singer, // 歌手名称
	imageBase64, // 图片
	time // 歌曲时长
}
```

## 4. 把秒钟转换成时分秒格式

```ts
/**
 * 
 * @param second number 多少秒
 * @param isLimit 是否存在24小时的上限
 * @returns 返回 string 00:00:00
 * @description 把秒钟转换成时分秒格式
 */
secondToTime(second:number,isLimit?:boolean):string
```

## 5. 把时间(00:00:00)转成秒钟

```ts
/**
 * 
 * @param time 00:00:00 格式的时间
 * @param num 返回的秒钟值是传入的格式时间的多少倍数，默认 1
 * @returns number 返回转换后的秒钟
 * @description 把时间(00:00:00)转成秒钟
 */
 timeToSecond(time:stirng,num=1):number
```

## 6. 判断基础类型 is

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @param type 判断的类型
 * @returns 返回 true or false
 */
is(val:unknown, type:string):boolean
```



## 7. 判断是否为undefined isDef

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isDef(val:unknown):boolean
```

## 8. 判断是否为对象 isObject 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isObject(val:any):boolean
```

## 9. 判断是否没有值 isEmpty 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isEmpty(val:unknown):boolean
```

## 10. 判断是否为Null或者undefined isNullAndUnDef 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isNullAndUnDef(val:unknown):boolean
```

## 11. 判断是否为url isUrl 

### 使用方法：

```ts
/**
 * 
 * @param path 待判断的路径
 * @returns boolean
 */
isUrl(path:string):boolean
```



## 12. 把秒钟转换成时分秒格式,为了尽量在切换npm包后不影响原项目的代码而保留该名称方法 

```js
/**
 * 
 * @param second number 多少秒
 * @param isLimit 是否存在24小时的上限
 * @returns 返回 string 00:00:00
 * @description 把秒钟转换成时分秒格式
 */
convertSongDuration(second:number,isLimit?:boolean):string
```

## 12. 把时间(00:00:00)转成秒钟,为了尽量在切换npm包后不影响原项目的代码而保留该名称方法 

```js
/**
 * 
 * @param time 00:00:00 格式的时间
 * @param num 返回的秒钟值是传入的格式时间的多少倍数，默认 1
 * @returns number 返回转换后的秒钟
 * @description 把时间(00:00:00)转成秒钟
 */
 timeToSec(time:stirng,num=1):number
```

## 