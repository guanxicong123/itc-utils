
/**
 * 
 * @param file 文件，input change事件返回的参数，入参只能为一个音频文件
 * @returns promise {singer, base64String} 歌手，base64格式的专辑图片
 * @description 解析音频文件的详情（专辑名称，歌手名称，专辑图片...）
 * @author gxc
 */
const parseAudioInfo = (file:{raw:any})=>{
  return new Promise((resolve:any,reject:any)=>{
    const content = file.raw
    let album = ''
    let name = ''
    let singer =''
    let imageBase64 = ''
    if(!content) resolve({
      name, // 歌曲名称
      album, // 专辑名称
      singer, // 歌手名称
      imageBase64, // 专辑图片
    })
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsmediatags = require('./jsmediatags.min.js')
    jsmediatags.read(file.raw, {
      onSuccess: function(result:any) {
        album = result.tags.album
        name = result.tags.title
        singer = result.tags.artist
        if(result.tags.picture){
          const { data, format } = result.tags.picture;
          let base64String = "";
          for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
          }
          imageBase64 = `data:${format};base64,${window.btoa(base64String)}`;
        }
        resolve({
          name, // 歌曲名称
          album, // 专辑名称
          singer, // 歌手名称
          imageBase64, // 专辑图片
        })
      },
      onError: function(error:any) {
        resolve({
          name, // 歌曲名称
          album, // 专辑名称
          singer, // 歌手名称
          imageBase64, // 专辑图片
        })
        console.log(':(', error.type, error.info);
      }
    });
  })
}

/**
 * 
 * @param file 文件 input change事件返回的参数，入参只能为一个音频文件
 * @returns promise {duration:number} 时长
 * @description 解析音频文件时长
 * @author gxc
 */
const parseAudioDuration = (file:{raw:any})=>{
  // 使用new Audio解析音频文件，会比较快，但是对aac格式的文件解析不准确，相差还挺大
  // 使用new AudioContext解析音频文件，速度比较慢，但是对aac格式的文件解析准确。

  // 速度对比：
  // 一次解析1首MP3文件：Audio：5ms、AudioContext：1000ms
  // 一次解析3首MP3文件：Audio：50ms、AudioContext：1600ms
  // 一次解析10首MP3文件：Audio：1000ms、AudioContext：3500ms
  // 一次解析50首MP3文件：Audio：3800ms、AudioContext：15000ms
  return new Promise((resolve:any)=>{
    const content = file.raw
    if(!content) resolve({
      duration:0
    })
    let duration = 0
    // 解析.aac文件
    if (content.type === "audio/vnd.dlna.adts") {
      // 这种方式慢，但是可以对所有文件都能准确获取音频时长
      const audioCtx = new AudioContext();
      let reader: any = new FileReader();
      let arrBuffer: any;
      reader.onload = function (event: any) {
        arrBuffer = event.target.result;
        // arrBuffer就是包含音频数据的ArrayBuffer对象
        audioCtx.decodeAudioData(arrBuffer, function (audioBuffer) {
          // audioBuffer就是AudioBuffer
          const data = audioBuffer.duration;
          duration = Math.floor(parseFloat(data.toString()));
          resolve({
            duration
          })
          reader = null;
        });
      };
      reader.readAsArrayBuffer(content);
    } else {
      //经测试，发现audio也可获取视频的时长,这种方式比较快，但是无法准确解析出 aac 格式的时长
      const url = URL.createObjectURL(content);
      const audioElement: any = new Audio(url);
      audioElement.addEventListener("durationchange", () => {
        const data = audioElement.duration;
        duration = Math.floor(parseFloat(data.toString()));
        resolve({
          duration
        })
      });
      audioElement.addEventListener("error", function () {   //请求数据时遇到错误
        duration = 0;
        resolve({
          duration
        })
    });
    }
  })
}

/**
 * @description 获取音频文件的内部信息（专辑名称，专辑图片，歌手，歌名等）与 音频文件的播放时长
 * @param file 通过 input change事件返回的参数，入参只能为一个音频文件
 * @param {function} 回调
 * @return {file} 把入参的file返回出去，把
 * @author gxc
 */
export const getAudioFileTime = async (
  file: {raw: any},
  callback?: any
) => {
  const newFile:any = {...file}
  // 解析媒体的信息（专辑名称，歌手名称，专辑图片...）
  const content: any = file.raw;
  const audioInfo:any = await parseAudioInfo(content)
  newFile.album = audioInfo?.album
  newFile.songName = audioInfo?.name
  newFile.singer = audioInfo?.singer
  newFile.imageBase64 = audioInfo?.imageBase64
  const audioDuration:any = await parseAudioDuration(content)
  newFile.time = audioDuration.duration;
  callback?.()
  return newFile;
};

/**
 * 
 * @param second number 多少秒
 * @param isLimit 是否存在24小时的上限
 * @returns 返回 string 00:00:00
 * @description 把秒钟转换成时分秒格式,为了尽量在切换npm包后不影响原项目的代码而保留该名称方法
 */
export const convertSongDuration = (second: number, isLimit?: boolean)=> {
  if (!second || second === 0) {
    return "00:00:00";
  }
  const h = Math.floor(second / 3600) < 10 ? "0" + Math.floor(second / 3600) : Math.floor(second / 3600);
  let m = Math.floor((second / 60) % 60) < 10 ? "0" + Math.floor((second / 60) % 60) : Math.floor((second / 60) % 60);
  let s = Math.floor(second % 60) < 10 ? "0" + Math.floor(second % 60) : Math.floor(second % 60);

  if (isLimit && Number(h) > 23) return "23:59:59";

  if (Number(m) > 59) m = 59;

  if (Number(s) > 59) s = 59;

  return h + ":" + m + ":" + s;
}
/**
 * 
 * @param second number 多少秒
 * @param isLimit 是否存在24小时的上限
 * @returns 返回 string 00:00:00
 * @description 把秒钟转换成时分秒格式
 */
export const secondToTime = (second: number, isLimit?: boolean)=> {
  if (!second || second === 0) {
    return "00:00:00";
  }
  const h = Math.floor(second / 3600) < 10 ? "0" + Math.floor(second / 3600) : Math.floor(second / 3600);
  let m = Math.floor((second / 60) % 60) < 10 ? "0" + Math.floor((second / 60) % 60) : Math.floor((second / 60) % 60);
  let s = Math.floor(second % 60) < 10 ? "0" + Math.floor(second % 60) : Math.floor(second % 60);

  if (isLimit && Number(h) > 23) return "23:59:59";

  if (Number(m) > 59) m = 59;

  if (Number(s) > 59) s = 59;

  return h + ":" + m + ":" + s;
}
/**
 * 
 * @param time 00:00:00 格式的时间
 * @param num 返回的秒钟值是传入的格式时间的多少倍数，默认 1
 * @returns number 返回转换后的秒钟
 * @description 把时间(00:00:00)转成秒钟，为了尽量在切换npm包后不影响原项目的代码而保留该名称方法
 */
export const timeToSec = (time: string, num = 1)=> {
  if(!time) return 0
  const hour = Number(time.split(":")[0]);
  const min = Number(time.split(":")[1]);
  const sec = Number(time.split(":")[2]);
  const s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s * num;
}
/**
 * 
 * @param time 00:00:00 格式的时间
 * @param num 返回的秒钟值是传入的格式时间的多少倍数，默认 1
 * @returns number 返回转换后的秒钟
 * @description 把时间(00:00:00)转成秒钟
 */
export const timeToSecond = (time: string, num = 1)=> {
  if(!time) return 0
  const hour = Number(time.split(":")[0]);
  const min = Number(time.split(":")[1]);
  const sec = Number(time.split(":")[2]);
  const s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s * num;
}


// 各种类型判断

const toString = Object.prototype.toString;

/**
 * 
 * @param val 待判断的值
 * @param type 判断的类型
 * @returns 返回 true or false
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * 
 * @param val 待判断的值
 * @returns boolean
 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\\+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\w-_]*)?\??(?:[-\\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}
