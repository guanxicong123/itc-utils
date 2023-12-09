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



## 3. 判断基础类型 is

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



## 4. 判断是否为undefined isDef

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isDef(val:unknown):boolean
```

## 5. 判断是否为对象 isObject 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isObject(val:any):boolean
```

## 6. 判断是否没有值 isEmpty 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isEmpty(val:unknown):boolean
```

## 7. 判断是否为Null或者undefined isNullAndUnDef 

### 使用方法：

```ts
/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
isNullAndUnDef(val:unknown):boolean
```

## 8. 判断是否为url isUrl 

### 使用方法：

```ts
/**
 * 
 * @param path 待判断的路径
 * @returns boolean
 */
isUrl(path:string):boolean
```



