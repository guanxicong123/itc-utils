
/**
 * 
 * @param content 文件，form-data
 * @returns promise {singer, base64String} 歌手，base64格式的专辑图片
 * @description 解析音频文件的详情（专辑名称，歌手名称，专辑图片...）
 */
const parseAudioInfo = (content:any)=>{
  return new Promise((resolve:any,reject:any)=>{
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsmediatags = require('./jsmediatags.min.js')
    let singer =''
    let imageBase64 = ''
    jsmediatags.read(content, {
      onSuccess: function(result:any) {
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
          singer,
          imageBase64,
        })
      },
      onError: function(error:any) {
        resolve({
          singer,
          imageBase64,
        })
        console.log(':(', error.type, error.info);
      }
    });
  })
}

/**
 * 
 * @param content 文件 form-data
 * @returns promise {duration:number} 时长
 * @description 解析音频文件时长
 */
const parseAudioDuration = (content:any)=>{
  // 使用new Audio解析音频文件，会比较快，但是对aac格式的文件解析不准确，相差还挺大
  // 使用new AudioContext解析音频文件，速度比较慢，但是对aac格式的文件解析准确。

  // 速度对比：
  // 一次解析1首MP3文件：Audio：5ms、AudioContext：1000ms
  // 一次解析3首MP3文件：Audio：50ms、AudioContext：1600ms
  // 一次解析10首MP3文件：Audio：1000ms、AudioContext：3500ms
  // 一次解析50首MP3文件：Audio：3800ms、AudioContext：15000ms
  return new Promise((resolve:any)=>{
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
 * @description 获取音频文件的时长
 * @param {{time: number, raw: any}} 音频文件本地选中后的回调
 * @param {function} 回调
 * @return {file} 把入参的file返回出去
 * @author gxc
 */
export const getAudioFileTime = async (
  file: { time: number; raw: any,singer:string,imageBase64:any },
  callback?: any
) => {
  // 解析媒体的信息（专辑名称，歌手名称，专辑图片...）
  const content: any = file.raw;
  const audioInfo:any = await parseAudioInfo(content)
  file.singer = audioInfo?.singer
  file.imageBase64 = audioInfo?.imageBase64
  const audioDuration:any = await parseAudioDuration(content)
  file.time = audioDuration.duration;
  callback?.()
  return file;
};
// 是否为音乐播放任务
export const isMusicTask = (task: any) => {
  return (
    task.type === 10 ||
    task.type === 1 ||
    (task.type === 4 && task.fast_sound?.type == 1) ||
    (task.type === 4 && task.sound_source?.type == 1)
  );
};
// 是否为音源采集任务
export const isCollectSoundTask = (task: any) => {
  return (
    task.type === 2 ||
    task.type === 3 ||
    task.type === 12 ||
    task.type === 13 ||
    (task.type === 4 && task.fast_sound?.type == 2) ||
    (task.type === 4 && task.sound_source?.type == 2) ||
    (task.type === 4 && task.fast_sound?.type == 3) ||
    (task.type === 4 && task.sound_source?.type == 3)
  );
};