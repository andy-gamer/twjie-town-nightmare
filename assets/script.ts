
import { DialogueLine, Subtitle, GameScene } from '../types';

export const SCRIPT = {
  intro: [
    { speaker: '燕', text: '幹嘛啊，把我弄來這種地方是想幹嘛？', emotion: 'angry', effect: 'shake' },
    { speaker: '燕', text: '這裡到底是……算了，人都來了。往前走走看。', emotion: 'normal', effect: 'shake' },
    { speaker: '燕', text: '反正我也不想待在原地。', emotion: 'normal' },
  ] as DialogueLine[],
  
  meeting: [
    { speaker: '燕', text: '什麼聲音？', emotion: 'normal' },
    { speaker: '？？？', text: '♩~', emotion: 'normal' },
    { speaker: '燕', text: '幹嘛啦，出來！', emotion: 'confused', effect: 'shake' },
    { speaker: '？？？', text: '……', emotion: 'normal' },
    { speaker: '燕', text: '你是誰？想幹嘛？', emotion: 'confused', effect: 'shake' },
    { speaker: '？？？', text: '花盆裡的朋友不見了，要找回來。', emotion: 'normal' },
    { speaker: '？？？', text: '你肯定知道怎麽做吧？', emotion: 'normal' },
    { speaker: '燕', text: '我？爲什麽是我做？', emotion: 'confused' },
    { speaker: '？？？', text: '因爲是重要的客人。', emotion: 'normal' },
    { speaker: '燕', text: '可以不要嗎？', emotion: 'normal' },
    { speaker: '？？？', text: '其實很好奇吧？', emotion: 'normal' },
    { speaker: '？？？', text: '雖然很害怕，但一定很~想知道找到之後會發生什麽吧？', emotion: 'normal' },
    { speaker: '燕', text: '嘖……', emotion: 'angry' },
    { speaker: '燕', text: '（被説中了。）', emotion: 'confused' },
    { speaker: '燕', text: '（而且，雖然這麽説很討厭，我的直覺很清楚那東西在哪。）', emotion: 'confused' },
    { speaker: '燕', text: '（這種感覺……之前有過嗎？）', emotion: 'confused', effect: 'shake' },
  ] as DialogueLine[],

  foundSeed: [
    { speaker: '燕', text: '掏出了怪怪的東西，這就是種子？', emotion: 'confused' },
    { speaker: '燕', text: '不管了，丟到花盆裡。', emotion: 'confused' },
  ] as DialogueLine[],

  plantedSeed: [
    { speaker: '燕', text: '……這樣就可以了吧。', emotion: 'confused' },
    { speaker: '？？？', text: '嗯，走吧。大家都在等你。', emotion: 'normal' },
    { speaker: '燕', text: '去哪？', emotion: 'normal' },
    { speaker: '？？？', text: '你原本想去的地方，我帶你去，作爲謝禮。', emotion: 'normal' },
    { speaker: '燕', text: '（會這麽講話，看來她知道我想做什麽。）', emotion: 'normal' },
    { speaker: '燕', text: '（跟上去吧，説不定她還真的會帶我去土界鎮。）', emotion: 'normal' },
  ] as DialogueLine[],

  lilyEncounter: [
    { speaker: '燕', text: '好大的鹿子百合。', emotion: 'normal' },
    { speaker: '燕', text: '本地人都是種花大師嗎。', emotion: 'confused' },
  ] as DialogueLine[],

  beforeTemple: [
    { speaker: '？？？', text: '我們一起進去吧。', emotion: 'normal' },
    { speaker: '燕', text: '那個，我趕時間去別的地方……', emotion: 'confused' },
    { speaker: '？？？', text: '不跟我一起走，就把你永遠留在這。', emotion: 'normal' },
    { speaker: '燕', text: '好討厭的講話方式，進去就進去！', emotion: 'angry' },
    { speaker: '燕', text: '（不過，那邊的匾上寫的是「九姑娘廟」吧？）', emotion: 'confused' },
    { speaker: '燕', text: '（完全不想進去，但來都來了……）', emotion: 'scared' },
    { speaker: '燕', text: '（説不定也能找到我正在尋找的東西。)', emotion: 'normal', effect: 'shake' },
  ] as DialogueLine[],

  templeIntro: [
    { speaker: '？？？', text: '幫我的朋友最後一個忙吧。', emotion: 'normal' },
    { speaker: '？？？', text: '把她放在桌子上，點香……最後，你要喝下那杯酒。', emotion: 'normal' },
  ] as DialogueLine[],

  templeRepeat: [
    { speaker: '？？？', text: '時間不多了......', emotion: 'normal' },
  ] as DialogueLine[],

  shadows: [
    { speaker: '燕', text: '牆上的影子......好像在動？', emotion: 'scared', effect: 'shake' },
  ] as DialogueLine[],

  climax: [
    { speaker: '？？？', text: '幹什麽，別礙事！', emotion: 'angry', effect: 'shake' },
    { speaker: '？？？', text: '走開，走開走開走開走開！', emotion: 'angry', effect: 'shake' },
  ] as DialogueLine[]
};

export const SUBTITLES: Record<string, Subtitle[]> = {
  [GameScene.FOREST]: [
      { id: 'f1', triggerX: 10, text: '清水為體，惡水為心；\n九姑娘前，萬物歸陰。', speaker: '蒼老的聲音', duration: 4500 },
      { id: 'f2', triggerX: 25, text: '幽香浮水，醉生夢死；\n九姑娘笑，眾生皆痴。', speaker: '蒼老的聲音', duration: 4500 },
      { id: 'f3', triggerX: 45, text: '好可憐......', speaker: '女性的聲音', duration: 3000 },
      { id: 'f4', triggerX: 60, text: '祭祀......\n別無他法......', speaker: '男性的聲音', duration: 4000 },
      { id: 'f5', triggerX: 75, text: '對不起......', speaker: '女性的聲音', duration: 3000 },
      { id: 'f6', triggerX: 88, text: '祭祀......', speaker: '男性的聲音', duration: 3000 },
  ],
  [GameScene.SEARCH]: [
      { id: 's1', triggerX: 15, text: '看不見嗎...', speaker: '？？？' },
      { id: 's2', triggerX: 50, text: '就在這裡...', speaker: '？？？' },
  ]
};