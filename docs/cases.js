"use strict";

// Each step uses the pre-action frame for its source ID and the next recorded frame.
// Bilingual strings are ordered English, then Simplified Chinese.
const gameCases = [
  {
    id: "darkside",
    steamAppId: 368390,
    game: ["The Darkside Detective", "暗面侦探"],
    title: ["The door in the attic", "阁楼里的暗门"],
    goal: ["Find the route Alice could have taken out of the house.", "找出 Alice 可能是从哪里离开房子的。"],
    steps: [
      {
        id: 66, after: 67,
        observation: ["The attic is dark. There is a broken lamp on the left and a mostly bare wall between the detectives.", "阁楼很暗，左侧有一盏坏灯。两位侦探之间的墙上看不出什么。"],
        memory: ["Alice left no trace at the ordinary exits. The detectives picked up a blacklight bulb and found a page with a doorway drawing.", "普通出口没有 Alice 离开的痕迹。此前拿到了一枚黑光灯泡，还找到一张画着门的纸。"],
        options: [
          ["Use the paint thinner on the wall", "用稀释剂擦拭墙面"],
          ["Fit the blacklight bulb into the broken lamp", "把黑光灯泡装进坏灯"],
          ["Go back downstairs to check the front door", "下楼再查一次正门"],
        ],
        answer: 1,
        result: ["The blacklight reveals a glowing doorway and symbols on the wall.", "黑光照亮了墙上原本看不见的门形轮廓和符号。"],
      },
      {
        id: 70, after: 71,
        observation: ["The door is visible, but several marks are missing. The first empty position is at the lower left.", "门已经显形，但周围有几处符号缺失。先看左下角的空位。"],
        memory: ["The Strange Page from under the bed shows the intact layout. The lower-left mark is a square spiral.", "床底找到的神秘纸页上有完整图案，左下角画的是方形回旋符号。"],
        options: [
          ["Put the upper-right zigzag in the lower-left gap", "把右上角的折线符号放进左下角"],
          ["Try walking through the incomplete door", "试着直接走进尚未补完的门"],
          ["Drag the square spiral into the lower-left gap", "把方形回旋符号拖到门的左下空位"],
        ],
        answer: 2,
        result: ["The lower-left mark slots into place. Other missing symbols still need to be filled.", "左下角的符号补上了。门上仍有其他空位需要修复。"],
      },
    ],
  },
  {
    id: "planet",
    steamAppId: 2014470,
    game: ["The Abandoned Planet", "被遗忘的星球"],
    title: ["Offerings in the ruins", "遗迹里的供物机关"],
    goal: ["Use the carvings and the mechanism’s feedback to find a way through the ruins.", "用刻纹和机关的反馈判断如何穿过遗迹。"],
    steps: [
      {
        id: 350, after: 351,
        observation: ["A red flower is selected. The stone basin in front of you has a flower carved into it.", "红花已选中，面前的空石盆刻着一朵花。"],
        memory: ["The basin marked with waves lit up after receiving liquid from the cactus.", "此前把仙人掌汁液倒进刻着波纹的石盆后，那只盆亮了。"],
        options: [
          ["Use the red flower on the carved basin", "把红花放进这只刻花石盆"],
          ["Save the flower and reuse cactus juice", "留着红花，再用一次仙人掌汁"],
          ["Put the flower into the basin with a flame symbol", "把红花放进刻着火焰的石盆"],
        ],
        answer: 0,
        result: ["The flower basin lights up. The next recorded view moves on to the basin with the flame carving.", "花纹石盆亮起。下一张记录画面已经转向火焰石盆。"],
      },
      {
        id: 354, after: 355,
        observation: ["The empty basin bears a flame symbol. A pine cone is selected.", "空石盆刻着火焰符号，当前选中的是松果。"],
        memory: ["Offerings matched the first two carvings. Here the carving describes a state to create, and the cone can serve as fuel.", "前两只石盆都接受与图案相符的供物。这里的图案指向要实现的状态，松果可作燃料。"],
        options: [
          ["Use the flint on the empty basin", "直接用燧石敲击空盆"],
          ["Place the pine cone in the flame basin", "把松果放进刻着火焰的石盆"],
          ["Add another red flower", "再放一朵红花"],
        ],
        answer: 1,
        result: ["The cone remains in the basin. The fuel is in place, but there is still no fire.", "松果留在了盆里。燃料已经放好，火还没有点着。"],
      },
      {
        id: 361, after: 362,
        observation: ["Beyond the basin chamber, a metal door has a circular recess with one raised node.", "穿过石盆大厅后，金属门中央有一个带单个凸点的圆形凹槽。"],
        memory: ["The inventory item selected just before this frame is the one-node circular object.", "当前选中的道具是物品栏里的单节点圆形物。"],
        options: [
          ["Use the flint on the door panel", "对门板使用燧石"],
          ["Return to the basins to look for another key", "返回石盆大厅寻找另一把钥匙"],
          ["Use the one-node object on the matching recess", "把单节点圆形物嵌进匹配的凹槽"],
        ],
        answer: 2,
        result: ["The fitting seats in the lock, the door rises, and the passage opens.", "圆形物嵌入锁具，门板升起，露出后方的通路。"],
      },
    ],
  },
  {
    id: "orwell",
    steamAppId: 491950,
    game: ["Orwell: Keeping an Eye On You", "奥威尔：监视你"],
    title: ["Who is Goldfels?", "Goldfels 是谁？"],
    goal: ["Build an identity profile using evidence from two independent sources.", "从两个不同来源取证，补全人物身份档案。"],
    steps: [
      {
        id: 75, after: 76,
        observation: ["The profile on the left has no portrait. The Thought’s administrator page displays a photo next to the account name goldfels.", "左侧档案没有头像。The Thought 的管理员资料页把照片与 goldfels 账号并列显示。"],
        memory: ["The investigation has already linked Goldfels to the creation of The Thought. A full first name has yet to be confirmed.", "此前的调查把 Goldfels 和 The Thought 的创立联系在一起。他的名字还有待确认。"],
        options: [
          ["Submit the administrator photo to Goldfels’s profile", "把管理员照片提交到 Goldfels 档案"],
          ["Record Administrator as Goldfels’s first name", "把 Administrator 记为 Goldfels 的名字"],
          ["Attach the photo to Cassandra’s profile", "把照片关联到 Cassandra 的档案"],
        ],
        answer: 0,
        result: ["The system accepts the photo and replaces the placeholder portrait.", "系统接受照片，并替换了档案里的占位头像。"],
      },
      {
        id: 78, after: 79,
        observation: ["The university biography is headed “Prof. A. Goldfels.” The body spells out Abraham Goldfels.", "大学简介标题写着“Prof. A. Goldfels”，正文给出了全名 Abraham Goldfels。"],
        memory: ["A text signed by A. Goldfels refers to students from Stelligan. The profile still contains only a surname.", "一篇 A. Goldfels 署名的文章提过 Stelligan 的学生。当前档案里仍只有姓氏。"],
        options: [
          ["Enter A as the full first name", "把 A 当作完整名字录入"],
          ["Submit the full name from the university biography", "提交大学简介正文里的全名"],
          ["Submit the university’s name as the person’s name", "把大学的名字提交为人物姓名"],
        ],
        answer: 1,
        result: ["The profile updates from GOLDFELS to ABRAHAM GOLDFELS.", "档案标题从 GOLDFELS 更新为 ABRAHAM GOLDFELS。"],
      },
    ],
  },
  {
    id: "skye",
    steamAppId: 2314850,
    game: ["The Legend of Skye", "斯凯传说"],
    title: ["Two rings, one bubble", "一个气泡，两个圆环"],
    goal: ["Win the hilltop contest and earn a trophy that can prove Skye’s result.", "赢下山顶比赛，拿到能证明成绩的奖杯。"],
    steps: [
      {
        id: 483, after: 484,
        observation: ["Skye is in the pipe menu. The options cover breathing, exhaling, and putting the pipe down.", "Skye 正在烟斗对话里，可选动作是吸气、吐气，或者暂时放下烟斗。"],
        memory: ["The contest requires passing through two rings. Skye has prepared a striped straw with soapy water and carries a blowgun.", "比赛要求连续穿过两个圆环。Skye 此前用肥皂水处理了条纹吸管，还带着吹管。"],
        options: [
          ["Take another breath with the pipe", "继续用烟斗再吸一口"],
          ["Exhale as quickly as possible", "尽可能快地吐气"],
          ["Put the pipe down to switch to the inventory", "放下烟斗，切回道具栏"],
        ],
        answer: 2,
        result: ["The breathing menu closes. By the next recorded decision, Skye has his bubble ready.", "呼吸菜单关闭。到下一张记录画面时，Skye 已经吹出了肥皂泡。"],
      },
      {
        id: 484, after: 485,
        observation: ["A soap bubble is beside the rings and the inventory actions are available again.", "肥皂泡就在圆环附近，界面已恢复道具操作。"],
        memory: ["The soapy straw supplied the bubble. The remaining problem is directing it through the rings.", "吸管和肥皂水已经做出了气泡。剩下的问题是怎样让气泡穿过圆环。"],
        options: [
          ["Use the blowgun on the soap bubble", "对肥皂泡使用吹管"],
          ["Return to the pipe and try another smoke ring", "重新拿起烟斗再试一个烟圈"],
          ["Ask to collect the prize before attempting the rings", "先去找主持人领奖"],
        ],
        answer: 0,
        result: ["The blowgun sends the bubble through the rings. The host declares Skye the winner.", "吹管推动气泡穿环，主持人宣布 Skye 获胜。"],
      },
    ],
  },
  {
    id: "lucy",
    steamAppId: 1532710,
    game: ["Lucy Dreaming", "露西之梦"],
    title: ["A recipe for better dreams", "好梦配方"],
    goal: ["Use three remembered recipe requirements to prepare Lucy’s dream box.", "回顾做梦盒的三项配方要求，帮 Lucy 准备好它。"],
    steps: [
      {
        id: 148, after: 149,
        observation: ["Lucy is in her bedroom. The camouflage lip balm is selected and the small box is still in the inventory.", "Lucy 在卧室，迷彩润唇膏已选中，小箱子还在物品栏里。"],
        memory: ["A positive dream box calls for a calming rune drawn on the box.", "好梦配方要求在梦境盒上画一个让人平静的符文。"],
        options: [
          ["Use the lip balm on the pillow", "把润唇膏用在枕头上"],
          ["Use the lip balm on the small box", "用润唇膏在小箱子上画符文"],
          ["Put the undecorated box on the windowsill", "把还没装饰的小箱子放到窗台上"],
        ],
        answer: 1,
        result: ["Lucy draws a calming rune on the box. It becomes the decorated dream box.", "Lucy 在小箱子上画出了平和符文，得到了装饰好的梦境盒。"],
      },
      {
        id: 154, after: 155,
        observation: ["The box is now by the bed. Lucy has selected the repaired bear, Mr. Fumble.", "梦境盒已经放在床边，Lucy 选中了修好的小熊 Mr. Fumble。"],
        memory: ["The recipe needs a comfort item in addition to the rune. The repaired bear is that item.", "除了符文，配方还需要一件能给人安慰的物品。修好的小熊符合要求。"],
        options: [
          ["Put the repaired bear into the box by the bed", "把修好的小熊放进床边的梦境盒"],
          ["Set the bear on the bookshelf", "把小熊放上书架"],
          ["Pick up the box and erase the rune", "拿起盒子擦掉符文"],
        ],
        answer: 0,
        result: ["Lucy puts Mr. Fumble into the box. The recipe still needs inspiration.", "Lucy 把 Mr. Fumble 放进梦境盒。配方还缺灵感。"],
      },
      {
        id: 157, after: 158,
        observation: ["The joke book is selected. The dream box already holds the bear and has its rune.", "笑话书已选中，梦境盒上已经有符文，里面也放好了小熊。"],
        memory: ["The unfinished requirement is a source of inspiration. The joke book gives Lucy something to draw on.", "还没满足的是灵感这一项，笑话书里的内容可以提供灵感。"],
        options: [
          ["Take the bear back out and start over", "把小熊取出，重新准备梦境盒"],
          ["Go to sleep before finishing the box", "不继续准备梦境盒，直接睡觉"],
          ["Use the joke book on the dream box", "对梦境盒使用笑话书"],
        ],
        answer: 2,
        result: ["The joke book counts as inspiration, completing the positive dream box.", "笑话书提供了灵感，好梦配方完成。"],
      },
    ],
  },
];
