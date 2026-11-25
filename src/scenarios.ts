// Scenario scripts. Prices come from src/data/prices.json (real weekly closes);
// headlines describe what was actually in the news around each decision date,
// with names blurred so the era isn't obvious until the reveal.

export type L = { en: string; zh: string };
export type Step = {
  date: string;
  headline: L;
  feed: L;
  pro: L;
  mark?: "top" | "bottom";
  /** Assets the mark applies to (default: all). Hot stocks often peak or bottom at other times. */
  markSlots?: ("index" | "tech" | "spicy")[];
  hindsight?: L;
};
export type AssetText = { hidden: L; reveal: L };
export type Scenario = {
  id: string;
  code: number; // public scenario number used in share links
  title: L;
  period: L;
  rarity: L;
  assets: { index: AssetText; tech: AssetText; spicy: AssetText };
  steps: Step[];
  lessons: L[];
};

const INDEX_HIDDEN: L = { en: "The Index: 500 big US companies", zh: "大盘指数：美国 500 家大公司" };
const TECH_HIDDEN: L = { en: "Big Tech basket: the 100 biggest tech-heavy stocks", zh: "科技巨头篮子：100 只科技龙头" };
const INDEX_REVEAL: L = { en: "S&P 500", zh: "标普 500" };
const TECH_REVEAL: L = { en: "Nasdaq-100 (QQQ)", zh: "纳斯达克 100（QQQ）" };

export const SCENARIOS: Scenario[] = [
  {
    id: "dotcom",
    code: 1,
    title: { en: "The Dot-com Bubble", zh: "互联网泡沫" },
    period: { en: "Nov 1999 – Dec 2003", zh: "1999 年 11 月 – 2003 年 12 月" },
    rarity: {
      en: "A bubble bursting like this happens about once a generation. The Nasdaq needed 15 years to get back to its 2000 high.",
      zh: "这种级别的泡沫破裂，大约一代人遇到一次。纳斯达克花了 15 年才回到 2000 年的高点。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A hot online bookstore that wants to sell everything", zh: "🌶️ 一家想卖一切的网上书店" },
        reveal: {
          en: "Amazon. It fell about 94% from its 1999 peak. Anyone who held from the 2001 low to today made hundreds of times their money.",
          zh: "亚马逊。从 1999 年高点跌了约 94%。从 2001 年低点拿到今天的人，赚了几百倍。"
        }
      }
    },
    steps: [
      {
        date: "1999-11-01",
        headline: {
          en: "Internet stocks are on fire. Companies with no profits double on their first trading day. Your coworker made 300% this year.",
          zh: "互联网股票疯了。没有利润的公司上市首日就翻倍。你同事今年赚了 300%。"
        },
        feed: { en: "@daytrader_dave: P/E ratios are for boomers. This time is different 🚀", zh: "@炒股大卫：市盈率是老古董才看的，这次不一样 🚀" },
        pro: { en: "Tech index P/E above 100. The central bank has started raising rates. Margin debt at a record.", zh: "科技指数市盈率超过 100。央行已经开始加息。融资余额创历史新高。" }
      },
      {
        date: "2000-03-10",
        headline: {
          en: "The tech index crosses 5,000, double where it was a year ago. A dial-up internet company just bought a century-old media empire.",
          zh: "科技指数突破 5000 点，一年翻倍。一家拨号上网公司刚刚收购了百年传媒帝国。"
        },
        feed: { en: "Uncle Bob: 'Moved the college fund into tech. Easy money.'", zh: "鲍勃叔叔：「把孩子的大学基金都换成科技股了，稳赚。」" },
        pro: { en: "Rates raised 5 times since last summer. Tech IPOs priced at 50x sales.", zh: "去年夏天以来已经加息 5 次。科技新股按 50 倍市销率定价。" },
        mark: "top", markSlots: ["index", "tech"],
        hindsight: { en: "This was THE top of the bubble. The tech index wouldn't see this level again for 15 years.", zh: "这就是泡沫的最顶点。科技指数 15 年后才重新回到这里。" }
      },
      {
        date: "2000-05-12",
        headline: {
          en: "Tech plunges about 30% in a few weeks. TV pundits: 'Healthy correction. Buy the dip!'",
          zh: "科技股几周内暴跌约 30%。电视专家：「健康回调，抄底良机！」"
        },
        feed: { en: "@moonboi: Just shaking out the weak hands 💎🙌", zh: "@月亮男孩：洗盘而已，钻石手别慌 💎🙌" },
        pro: { en: "A 0.5% rate hike is expected next week, the biggest in five years.", zh: "市场预计下周加息 0.5%，五年来最大幅度。" }
      },
      {
        date: "2000-09-01",
        headline: {
          en: "Summer rally! Tech bounced back near its highs. 'The worst is behind us,' say analysts.",
          zh: "夏季反弹！科技股回到高点附近。分析师：「最坏的时候已经过去了。」"
        },
        feed: { en: "@daytrader_dave: Told you. 5,000 again by Christmas.", zh: "@炒股大卫：早说了吧，圣诞节前重回 5000。" },
        pro: { en: "Several dot-coms are running out of cash. Big chip makers hint at slowing PC demand.", zh: "多家互联网公司现金快烧完了。芯片巨头暗示电脑需求放缓。" }
      },
      {
        date: "2001-01-05",
        headline: {
          en: "The online pet store with the sock-puppet mascot has shut down. Then the central bank surprised everyone with an emergency rate cut, and stocks jumped in a day.",
          zh: "那家用袜子木偶当吉祥物的网上宠物店倒闭了。随后央行突然紧急降息，股市一天大涨。"
        },
        feed: { en: "@moonboi: Don't fight the Fed! Bottom is IN.", zh: "@月亮男孩：别和美联储作对！底部已现！" },
        pro: { en: "Emergency 0.5% cut between meetings. Recession risk is rising.", zh: "两次议息会议之间紧急降息 0.5%。衰退风险上升。" }
      },
      {
        date: "2001-04-06",
        headline: {
          en: "Tech is down more than 60% from the peak. Layoffs everywhere. Your coworker is now 'between jobs'.",
          zh: "科技股从高点跌了 60% 以上。到处在裁员。你同事现在「待业中」。"
        },
        feed: { en: "@daytrader_dave: I'm out. Stocks are a casino. Never again.", zh: "@炒股大卫：我割了。股市就是赌场，再也不碰了。" },
        pro: { en: "Rates cut 3 times this year. Valuations still above their long-run average.", zh: "今年已经降息 3 次。估值仍高于长期平均。" }
      },
      {
        date: "2001-09-21",
        headline: {
          en: "After a national tragedy, US markets closed for four days. They reopened sharply lower: the worst week since the 1930s.",
          zh: "一场国家悲剧后，美股休市四天。复市后大跌，创下 1930 年代以来最差的一周。"
        },
        feed: { en: "Everyone: 'Is it safe to own anything right now?'", zh: "所有人：「现在还有什么东西敢拿吗？」" },
        pro: { en: "More emergency rate cuts. The economy is in recession.", zh: "央行再次紧急降息。经济已陷入衰退。" }
      },
      {
        date: "2002-07-19",
        headline: {
          en: "Last winter a Wall Street-darling energy giant collapsed in fraud. Now a major telecom admits it faked billions in profits. Nobody trusts any earnings report.",
          zh: "去年冬天，华尔街宠儿能源巨头因造假倒闭。现在又一家电信巨头承认虚增了几十亿利润。没人再相信财报。"
        },
        feed: { en: "@moonboi: (this account has been deleted)", zh: "@月亮男孩：（该账号已注销）" },
        pro: { en: "The index is down over 40% from its peak. P/E is finally back near its historical average.", zh: "大盘从高点跌了 40% 以上。市盈率终于回到历史平均附近。" }
      },
      {
        date: "2002-10-11",
        headline: {
          en: "Magazine covers ask: 'Is the stock market dead?' Tech is down nearly 80% from its peak.",
          zh: "杂志封面问：「股市已死？」科技股从高点跌了近 80%。"
        },
        feed: { en: "The forum is silent. Nobody posts anymore. 🦗", zh: "论坛一片寂静，已经没人发帖了。🦗" },
        pro: { en: "Cheapest valuations in a decade. Central bank rate at 1.75%.", zh: "估值为十年来最低。央行利率 1.75%。" },
        mark: "bottom", markSlots: ["index", "tech"],
        hindsight: { en: "This was the bottom (October 9, 2002). The index rose about 30% over the next 14 months.", zh: "这就是底部（2002 年 10 月 9 日）。之后 14 个月大盘涨了约 30%。" }
      }
    ],
    lessons: [
      { en: "'This time is different' is the most expensive sentence in investing.", zh: "「这次不一样」是投资里最贵的一句话。" },
      { en: "A crash of 80% needs a 400% gain to break even. Position size matters more than picking.", zh: "跌 80% 需要涨 400% 才能回本。仓位管理比选股更重要。" },
      { en: "Great companies can fall 90%. Holding a winner through that is much harder than it looks.", zh: "伟大的公司也会跌 90%。拿住它，比看起来难得多。" }
    ]
  },
  {
    id: "gfc",
    code: 2,
    title: { en: "The 2008 Global Financial Crisis", zh: "2008 全球金融危机" },
    period: { en: "Oct 2007 – Apr 2010", zh: "2007 年 10 月 – 2010 年 4 月" },
    rarity: {
      en: "A crisis this deep happens maybe once in 80 years. The last comparable one was 1929.",
      zh: "这种深度的危机大约 80 年一遇。上一次可比的是 1929 年。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ One of the world's biggest banks: a 'too big to fail' blue chip", zh: "🌶️ 全球最大的银行之一，「大而不倒」的蓝筹" },
        reveal: {
          en: "Citigroup. It fell about 98% and needed three government rescues. It still trades far below its 2007 price.",
          zh: "花旗集团。跌了约 98%，政府救了三次。至今股价仍远低于 2007 年。"
        }
      }
    },
    steps: [
      {
        date: "2007-10-01",
        headline: {
          en: "Stocks at all-time highs. Home prices doubled in six years. A few subprime mortgage lenders went bust, but the central bank says the problem is 'contained'.",
          zh: "股市创历史新高。房价六年翻倍。几家次贷公司倒闭了，但央行说问题「可控」。"
        },
        feed: { en: "Your barber: 'Flipping my third condo. No money down!'", zh: "你的理发师：「我在炒第三套公寓了，零首付！」" },
        pro: { en: "Volatility index around 18. A 0.5% rate cut last month. Housing starts falling fast.", zh: "波动率指数约 18。上月刚降息 0.5%。新屋开工快速下滑。" },
        mark: "top",
        hindsight: { en: "Stocks peaked the following week (October 9, 2007).", zh: "股市在下一周见顶（2007 年 10 月 9 日）。" }
      },
      {
        date: "2008-01-25",
        headline: {
          en: "Stocks down about 15% from the top. The central bank slashes rates 0.75% in an emergency move. A rogue trader lost billions at a big European bank.",
          zh: "股市从高点跌了约 15%。央行紧急降息 0.75%。欧洲一家大银行的交易员亏了几十亿。"
        },
        feed: { en: "@finbro: Fed's got our back. Buying everything 🐂", zh: "@金融兄弟：美联储会兜底的，全仓买入 🐂" },
        pro: { en: "Banks writing down billions in mortgage bonds. Recession odds rising.", zh: "银行在大额减记抵押贷款债券。衰退概率上升。" }
      },
      {
        date: "2008-03-21",
        headline: {
          en: "An 85-year-old Wall Street investment bank collapsed over a weekend and was sold for $2 a share.",
          zh: "一家 85 年历史的华尔街投行一个周末就倒了，以每股 2 美元贱卖。"
        },
        feed: { en: "@finbro: Bottom is in. The government won't let anyone else fail.", zh: "@金融兄弟：底部到了，政府不会再让任何一家倒下。" },
        pro: { en: "The central bank is now lending directly to investment banks. Credit spreads at record highs.", zh: "央行开始直接借钱给投行。信用利差创纪录。" }
      },
      {
        date: "2008-05-16",
        headline: {
          en: "Relief rally! Stocks bounced back about 10%. The finance minister says the worst is 'likely behind us'.",
          zh: "反弹了！股市回升约 10%。财长说最坏的时候「可能已经过去」。"
        },
        feed: { en: "@finbro: Told ya. Never bet against America 🇺🇸", zh: "@金融兄弟：早说了吧，永远不要做空美国 🇺🇸" },
        pro: { en: "Oil at a record $125. Inflation rising. Home prices still falling.", zh: "油价创纪录到 125 美元。通胀上升。房价还在跌。" }
      },
      {
        date: "2008-09-19",
        headline: {
          en: "A 158-year-old investment bank files the biggest bankruptcy in history. The government rescues the world's largest insurer. A money-market fund 'breaks the buck'.",
          zh: "一家 158 年历史的投行申请了史上最大破产。政府救助全球最大保险公司。货币基金「跌破净值」。"
        },
        feed: { en: "Your barber: 'Should I take my cash out of the bank?!'", zh: "你的理发师：「我要不要把钱从银行取出来？！」" },
        pro: { en: "Volatility index above 30 and climbing. Banks have stopped lending to each other.", zh: "波动率指数超过 30 还在涨。银行之间互相不借钱了。" }
      },
      {
        date: "2008-10-10",
        headline: {
          en: "Worst week in 75 years: stocks fell 18% in five days. Congress just passed a $700 billion bank bailout.",
          zh: "75 年来最惨的一周：五天跌了 18%。国会刚通过 7000 亿美元银行救助计划。"
        },
        feed: { en: "@finbro: (has not posted in 3 weeks)", zh: "@金融兄弟：（已三周没有发帖）" },
        pro: { en: "Volatility index near 70, a record. Central banks worldwide cut rates together.", zh: "波动率指数接近 70，史上最高。全球央行联合降息。" }
      },
      {
        date: "2009-03-06",
        headline: {
          en: "Stocks down 55% from the top. Giant banks trade like penny stocks. Unemployment surging past 8%. TV says 'Dow 5,000 is next'.",
          zh: "股市从高点跌了 55%。大银行股价跌成仙股。失业率突破 8%。电视说「道指下看 5000 点」。"
        },
        feed: { en: "Your barber: 'Sold everything. Never touching stocks again.'", zh: "你的理发师：「全卖了，这辈子不碰股票了。」" },
        pro: { en: "Rates at 0%. Valuations on 10-year earnings are the lowest since the 1980s.", zh: "利率降到 0%。按十年平均盈利算的估值是 1980 年代以来最低。" },
        mark: "bottom",
        hindsight: { en: "March 9, 2009 was the exact bottom. The index rose about 68% over the next year.", zh: "2009 年 3 月 9 日就是最低点。之后一年大盘涨了约 68%。" }
      },
      {
        date: "2009-07-17",
        headline: {
          en: "Stocks are up about 35% from the March low. But unemployment is still rising toward 10%. 'Dead-cat bounce,' say the bears.",
          zh: "股市从三月低点涨了约 35%。但失业率还在涨向 10%。空头说：「死猫跳而已。」"
        },
        feed: { en: "@permabear: Sucker's rally. Shorting this.", zh: "@永远看空：骗炮反弹，我要做空。" },
        pro: { en: "Banks passed government 'stress tests'. Earnings are beating very low expectations.", zh: "银行通过了政府「压力测试」。财报在超越很低的预期。" }
      }
    ],
    lessons: [
      { en: "The bottom came when the news was the worst. It always feels like 'this time it really goes to zero'.", zh: "底部出现在新闻最坏的时候。每次都感觉「这次真的要归零了」。" },
      { en: "A 'safe' blue chip can go to nearly zero. Diversifying across the whole index saved index holders.", zh: "「安全」的蓝筹也能跌到接近零。持有整个指数的人靠分散活了下来。" },
      { en: "Leverage in a crash turns a bad year into a permanent loss.", zh: "崩盘时加杠杆，会把糟糕的一年变成永久的损失。" }
    ]
  },
  {
    id: "covid",
    code: 3,
    title: { en: "The 2020 COVID Crash", zh: "2020 新冠崩盘" },
    period: { en: "Jan 2020 – Dec 2020", zh: "2020 年 1 月 – 2020 年 12 月" },
    rarity: {
      en: "A 34% drop in 23 trading days was the fastest bear market ever recorded. A pandemic shock like this is roughly once a century.",
      zh: "23 个交易日跌 34%，是有记录以来最快的熊市。这种疫情冲击大约百年一遇。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A cheap-vacation cruise line, a steady dividend payer", zh: "🌶️ 一家平价邮轮公司，一直稳定分红" },
        reveal: {
          en: "Carnival. Its ships became floating quarantines. It fell about 80% and was still down more than half at year-end, while the index hit records.",
          zh: "嘉年华邮轮。船变成了漂浮的隔离点。股价跌了约 80%，年底仍跌一半以上，而大盘已经创新高。"
        }
      }
    },
    steps: [
      {
        date: "2020-01-13",
        headline: {
          en: "Stocks at record highs. A trade war just got a 'Phase One' truce. A new virus has been reported in a city on the other side of the world.",
          zh: "股市创新高。贸易战刚达成「第一阶段」协议。地球另一边的一个城市报告出现了一种新病毒。"
        },
        feed: { en: "@stonks4life: Stocks only go up 📈", zh: "@股票永远涨：股票只会涨 📈" },
        pro: { en: "Volatility index around 12 (very calm). Unemployment at a 50-year low.", zh: "波动率指数约 12（非常平静）。失业率 50 年最低。" }
      },
      {
        date: "2020-02-21",
        headline: {
          en: "Another record high. The virus is now in other countries, but officials say the risk to the public is low.",
          zh: "又创新高。病毒已经传到其他国家，但官员说对公众风险很低。"
        },
        feed: { en: "@stonks4life: Remember the bird flu panic? Nothing happened. BTFD.", zh: "@股票永远涨：还记得禽流感恐慌吗？啥事没有。逢跌就买。" },
        pro: { en: "Asian supply chains disrupted. Volatility index creeping up to 17.", zh: "亚洲供应链中断。波动率指数升到 17。" },
        mark: "top", markSlots: ["index", "tech"],
        hindsight: { en: "The index peaked two days earlier (February 19). It was about to fall 34% in a month.", zh: "大盘两天前刚见顶（2 月 19 日），接下来一个月要跌 34%。" }
      },
      {
        date: "2020-02-28",
        headline: {
          en: "The fastest 10% drop in history: stocks fell about 12% this week. Outbreaks in Italy, Iran and South Korea.",
          zh: "史上最快的 10% 下跌：本周跌了约 12%。意大利、伊朗、韩国都爆发了疫情。"
        },
        feed: { en: "Uncle Bob: 'Bought 200 rolls of toilet paper as a hedge.'", zh: "鲍勃叔叔：「买了 200 卷卫生纸对冲风险。」" },
        pro: { en: "Volatility index jumped to 40. The 10-year bond yield hit a record low.", zh: "波动率指数跳到 40。十年期国债收益率创历史新低。" }
      },
      {
        date: "2020-03-20",
        headline: {
          en: "Down 32% in a month. Sports cancelled, offices closed, trading halts keep tripping. Oil is collapsing.",
          zh: "一个月跌了 32%。体育赛事取消，办公室关门，熔断一次接一次。油价崩了。"
        },
        feed: { en: "@stonks4life: It's over. Going to cash and canned beans 🥫", zh: "@股票永远涨：完了。换成现金和罐头 🥫" },
        pro: { en: "Volatility index hit 82, an all-time record. Rates cut to 0%. The central bank promised unlimited bond buying.", zh: "波动率指数冲到 82，史上最高。利率降到 0%。央行承诺无限量买债。" },
        mark: "bottom",
        hindsight: { en: "March 23, 2020 was the bottom, one trading day later. The index was back at record highs by August.", zh: "最低点就在下一个交易日（2020 年 3 月 23 日）。8 月大盘就重回新高。" }
      },
      {
        date: "2020-04-17",
        headline: {
          en: "22 million people filed for unemployment in four weeks. Yet stocks rallied about 25% off the low. 'The market is disconnected from reality!'",
          zh: "四周内 2200 万人申请失业救济。但股市从低点反弹了约 25%。「股市和现实脱节了！」"
        },
        feed: { en: "@hedgefundguy: Worst economy since the Depression. Shorting everything.", zh: "@对冲基金哥：大萧条以来最差的经济，全部做空。" },
        pro: { en: "A $2.2 trillion relief bill passed. Oil futures are about to go negative.", zh: "2.2 万亿美元救助法案通过。原油期货即将跌成负数。" }
      },
      {
        date: "2020-06-12",
        headline: {
          en: "Bored at home with stimulus checks, millions open trading apps. A bankrupt car-rental company's stock soared 800%. Thursday: stocks fell 6% on second-wave fears.",
          zh: "拿着救济金宅家的人开始炒股。一家破产的租车公司股价暴涨 800%。周四因二次疫情担忧股市跌 6%。"
        },
        feed: { en: "@robinhoodie: Stocks only go up, bro 🚀🚀", zh: "@韭菜罗宾：兄弟，股票只会涨 🚀🚀" },
        pro: { en: "Unemployment 13%. The tech index is already above its February high.", zh: "失业率 13%。科技指数已经超过了二月的高点。" }
      },
      {
        date: "2020-09-04",
        headline: {
          en: "Record highs. Big tech is soaring as everyone works from home. But this week tech dropped 5% in two days.",
          zh: "创新高。大家居家办公，科技巨头飙升。但本周科技股两天跌了 5%。"
        },
        feed: { en: "@robinhoodie: Just bought more on margin. Dip = sale 🛒", zh: "@韭菜罗宾：刚融资加仓。下跌就是打折 🛒" },
        pro: { en: "Tech up about 70% from March. A national election in two months.", zh: "科技股从三月涨了约 70%。两个月后大选。" }
      },
      {
        date: "2020-10-30",
        headline: {
          en: "A second wave is rising, the election is next week, and stocks fell 6% this week. Vaccine trial results are 'weeks away'.",
          zh: "第二波疫情来了，下周就是大选，本周股市跌了 6%。疫苗试验结果「还要几周」。"
        },
        feed: { en: "@hedgefundguy: Election chaos incoming. Cash is king.", zh: "@对冲基金哥：大选要乱，现金为王。" },
        pro: { en: "Volatility index back up to 38.", zh: "波动率指数回升到 38。" }
      }
    ],
    lessons: [
      { en: "The market bottomed while the news was still getting worse. Prices move on the future, not today's headlines.", zh: "股市见底时，新闻还在变坏。价格反映的是未来，不是今天的头条。" },
      { en: "Buying the hardest-hit stock isn't 'buying the dip'. Some dips never come back.", zh: "抄跌得最惨的股票不等于「抄底」。有些坑永远填不回来。" },
      { en: "Missing the 10 best days often means missing most of the gains, and they cluster near the worst days.", zh: "错过最好的 10 天，往往就错过了大部分收益，而它们常常紧挨着最惨的日子。" }
    ]
  },
  {
    id: "hikes",
    code: 4,
    title: { en: "The 2022 Inflation & Rate-Hike Bear Market", zh: "2022 通胀加息熊市" },
    period: { en: "Nov 2021 – Jul 2023", zh: "2021 年 11 月 – 2023 年 7 月" },
    rarity: {
      en: "A 20%+ bear market happens roughly every 6 years on average. Fastest rate hikes in 40 years made this one brutal for growth stocks.",
      zh: "20% 以上的熊市平均约 6 年一次。40 年来最快的加息，让成长股格外惨烈。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A superstar 'disruptive innovation' fund that tripled last year", zh: "🌶️ 一只去年翻了三倍的明星「颠覆式创新」基金" },
        reveal: {
          en: "ARK Innovation ETF (ARKK). It fell about 78% from its peak. Many people bought it after the triple, near the top.",
          zh: "ARK 创新 ETF（ARKK）。从高点跌了约 78%。很多人是在它翻三倍之后、接近顶部时买入的。"
        }
      }
    },
    steps: [
      {
        date: "2021-11-15",
        headline: {
          en: "Stocks at record highs. Inflation is 6%, the highest in 30 years, but the central bank calls it 'transitory'. Interest rates are still zero.",
          zh: "股市创新高。通胀 6%，30 年来最高，但央行说是「暂时性的」。利率仍然是零。"
        },
        feed: { en: "@disruptor_fan: Innovation will 5x in 5 years. Buy every dip 🦄", zh: "@颠覆粉：创新股五年涨五倍，每次下跌都买 🦄" },
        pro: { en: "Rates at 0%. 10-year yield 1.6%. Unprofitable tech trading at 20x+ sales.", zh: "利率 0%。十年期收益率 1.6%。不赚钱的科技股市销率 20 倍以上。" },
        mark: "top",
        hindsight: { en: "Tech peaked days later. The index peaked on January 3, 2022.", zh: "科技股几天后见顶，大盘在 2022 年 1 月 3 日见顶。" }
      },
      {
        date: "2022-03-04",
        headline: {
          en: "The central bank dropped 'transitory' and promises rate hikes. Now war has broken out in Europe and oil jumped above $110.",
          zh: "央行不再说「暂时性」，承诺加息。现在欧洲爆发战争，油价冲上 110 美元。"
        },
        feed: { en: "@disruptor_fan: Long-term holders win. Doubling down.", zh: "@颠覆粉：长期持有者笑到最后，加倍买入。" },
        pro: { en: "First rate hike expected this month. Inflation 7.9%.", zh: "本月预计首次加息。通胀 7.9%。" }
      },
      {
        date: "2022-05-13",
        headline: {
          en: "Biggest rate hike since 2000. A $40 billion 'stablecoin' just collapsed to zero in a week.",
          zh: "2000 年以来最大幅度加息。一个 400 亿美元的「稳定币」一周内归零。"
        },
        feed: { en: "Your cousin: 'My crypto is down 80%. Should I buy stocks instead?'", zh: "你表哥：「我的币跌了 80%，要不要换成股票？」" },
        pro: { en: "Inflation 8.3%. Index down about 18% from the high.", zh: "通胀 8.3%。大盘从高点跌了约 18%。" }
      },
      {
        date: "2022-06-17",
        headline: {
          en: "Official bear market. Inflation hit 8.6%, a 40-year high. The central bank hiked 0.75%, the biggest jump since 1994.",
          zh: "正式进入熊市。通胀 8.6%，40 年最高。央行一次加息 0.75%，1994 年以来最大。"
        },
        feed: { en: "@permabear: Recession guaranteed. Another 30% down from here.", zh: "@永远看空：衰退板上钉钉，还要再跌 30%。" },
        pro: { en: "Volatility index about 33. 10-year yield 3.3%.", zh: "波动率指数约 33。十年期收益率 3.3%。" },
        hindsight: { en: "Close, but not the bottom: stocks rallied 17% into August, then made a lower low in October.", zh: "接近但还不是底：股市反弹 17% 到八月，十月又创了新低。" }
      },
      {
        date: "2022-08-19",
        headline: {
          en: "Summer rally! Stocks up 17% from June. 'Was that the bottom?' The central bank chair speaks next week.",
          zh: "夏季反弹！从六月低点涨了 17%。「底部是不是到了？」下周央行主席讲话。"
        },
        feed: { en: "@disruptor_fan: The bear market is over. Innovation is back 🚀", zh: "@颠覆粉：熊市结束了，创新回来了 🚀" },
        pro: { en: "Bond market still signals more hikes. Inflation 8.5%.", zh: "债市仍在预示继续加息。通胀 8.5%。" }
      },
      {
        date: "2022-10-14",
        headline: {
          en: "New lows. Inflation still above 8%. A pension-fund panic nearly broke the UK bond market. Everyone expects a recession next year.",
          zh: "再创新低。通胀仍超过 8%。养老金恐慌差点击垮英国债市。所有人都在等明年的衰退。"
        },
        feed: { en: "The star innovation fund is down 75% from its peak. Its fans have gone quiet.", zh: "那只明星创新基金从高点跌了 75%，粉丝们都沉默了。" },
        pro: { en: "Rates heading toward 4.5%. 2-year yield 4.5%.", zh: "利率将升到 4.5%。两年期收益率 4.5%。" },
        mark: "bottom", markSlots: ["index", "tech"],
        hindsight: { en: "October 12, 2022 was the bottom for the index.", zh: "2022 年 10 月 12 日是大盘的最低点。" }
      },
      {
        date: "2023-01-27",
        headline: {
          en: "Last year was the worst for stocks since 2008. Meanwhile, a chatbot from an AI lab got 100 million users in two months.",
          zh: "去年是 2008 年以来股市最差的一年。与此同时，一个 AI 聊天机器人两个月用户破亿。"
        },
        feed: { en: "@ai_maxi: AI changes everything. This is the iPhone moment.", zh: "@AI 信徒：AI 改变一切，这是 iPhone 时刻。" },
        pro: { en: "Inflation falling to 6.5%. Rate hikes slowing to 0.25%.", zh: "通胀回落到 6.5%。加息放缓到 0.25%。" }
      },
      {
        date: "2023-03-17",
        headline: {
          en: "Three US banks collapsed in a week, including the 16th largest. A 167-year-old Swiss bank is being sold off in a rush.",
          zh: "一周内三家美国银行倒闭，包括第 16 大银行。一家 167 年历史的瑞士银行被紧急贱卖。"
        },
        feed: { en: "Everyone: 'Is this 2008 again?!'", zh: "所有人：「又要 2008 了吗？！」" },
        pro: { en: "The central bank opened an emergency lending facility for banks.", zh: "央行为银行开设了紧急借贷工具。" }
      }
    ],
    lessons: [
      { en: "When interest rates rise fast, the most hyped stocks fall the hardest.", zh: "利率快速上升时，最被追捧的股票跌得最狠。" },
      { en: "Bear markets have fake-out rallies. A 17% bounce can still be followed by a new low.", zh: "熊市里有假反弹。涨了 17% 之后照样能创新低。" },
      { en: "The recovery started while 'everyone' was still waiting for the recession.", zh: "复苏开始时，「所有人」还在等衰退。" }
    ]
  },
  {
    id: "tradewar",
    code: 5,
    title: { en: "The 2018 Trade War & Christmas Crash", zh: "2018 贸易战与圣诞崩盘" },
    period: { en: "Sep 2018 – Jun 2019", zh: "2018 年 9 月 – 2019 年 6 月" },
    rarity: {
      en: "A roughly 20% drop that fully recovers within months happens every few years.",
      zh: "这种跌 20% 左右、几个月内收复的行情，每隔几年就会来一次。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A graphics-chip maker loved by gamers and crypto miners", zh: "🌶️ 一家游戏玩家和矿工都爱的显卡芯片公司" },
        reveal: {
          en: "Nvidia. It fell about 56% in three months on a 'crypto hangover'. Years later it became the most valuable company in the world.",
          zh: "英伟达。因为「加密货币宿醉」，三个月跌了约 56%。几年后它成了全球市值最高的公司。"
        }
      }
    },
    steps: [
      {
        date: "2018-09-17",
        headline: {
          en: "Stocks at record highs. Tax cuts boosted profits 20%+. The trade war is heating up with new tariffs on $200 billion of imports.",
          zh: "股市创新高。减税让企业利润增长 20% 以上。贸易战升温，2000 亿美元进口商品被加征关税。"
        },
        feed: { en: "@stonks4life: Tariffs are priced in. Party on 🥳", zh: "@股票永远涨：关税早就计价了，继续嗨 🥳" },
        pro: { en: "Rates hiked every quarter, now 2%. Unemployment 3.7%.", zh: "每个季度都在加息，现在 2%。失业率 3.7%。" },
        mark: "top",
        hindsight: { en: "The index peaked days later (September 20, 2018).", zh: "大盘几天后见顶（2018 年 9 月 20 日）。" }
      },
      {
        date: "2018-10-26",
        headline: {
          en: "'Rocktober': stocks fell about 9% this month. The central bank chair says rates are 'a long way from neutral'.",
          zh: "「崩盘十月」：本月股市跌了约 9%。央行主席说利率「离中性水平还很远」。"
        },
        feed: { en: "@stonks4life: Healthy pullback. Loading up.", zh: "@股票永远涨：健康回调，加仓。" },
        pro: { en: "10-year yield hit 3.2%, a 7-year high.", zh: "十年期收益率 3.2%，七年新高。" }
      },
      {
        date: "2018-11-16",
        headline: {
          en: "Tech is getting crushed. A popular chip maker just lost about 20% in a day, blaming leftover inventory from the crypto bust.",
          zh: "科技股被暴打。一家热门芯片公司一天跌了约 20%，说是加密货币崩盘留下的库存。"
        },
        feed: { en: "Your gamer friend: 'Graphics cards are finally cheap lol'", zh: "你的游戏宅朋友：「显卡终于便宜了哈哈」" },
        pro: { en: "The biggest tech names are in a bear market.", zh: "最大的几家科技公司已经进入熊市。" }
      },
      {
        date: "2018-12-21",
        headline: {
          en: "Worst December since 1931. The central bank hiked again anyway. A government shutdown starts tonight. Stocks down nearly 20% from the top.",
          zh: "1931 年以来最差的十二月。央行照样加息。政府今晚停摆。股市从高点跌了近 20%。"
        },
        feed: { en: "Uncle Bob: 'Sold it all. I want to enjoy Christmas.'", zh: "鲍勃叔叔：「全卖了，我想好好过个圣诞节。」" },
        pro: { en: "Volatility index above 30. Credit markets are freezing up.", zh: "波动率指数超过 30。信贷市场在冻结。" },
        mark: "bottom",
        hindsight: { en: "Christmas Eve 2018 was the bottom, one trading day later. The index regained everything by April.", zh: "下一个交易日，2018 年平安夜，就是最低点。四月大盘就收复了全部失地。" }
      },
      {
        date: "2019-01-18",
        headline: {
          en: "The central bank chair says 'we will be patient' with hikes. Stocks have bounced about 13% since Christmas Eve.",
          zh: "央行主席说加息会「保持耐心」。股市从平安夜反弹了约 13%。"
        },
        feed: { en: "@permabear: Bear-market rally. Lower lows coming.", zh: "@永远看空：熊市反弹，还会更低。" },
        pro: { en: "Market now expects no more hikes this year.", zh: "市场预计今年不再加息。" }
      },
      {
        date: "2019-04-26",
        headline: {
          en: "Back to record highs! Officials say a trade deal is 'very close'.",
          zh: "重回历史新高！官员说贸易协议「非常接近了」。"
        },
        feed: { en: "Uncle Bob: 'Wait, it's back already? I sold at the bottom...'", zh: "鲍勃叔叔：「等等，已经涨回来了？我在底部卖的……」" },
        pro: { en: "Central bank on hold. Earnings better than feared.", zh: "央行按兵不动。财报好于担心的程度。" }
      },
      {
        date: "2019-05-17",
        headline: {
          en: "Trade talks collapsed. Tariffs raised from 10% to 25% on $200 billion of goods. Stocks are falling again.",
          zh: "贸易谈判破裂。2000 亿美元商品关税从 10% 提到 25%。股市又跌了。"
        },
        feed: { en: "@permabear: See? Told you. Round two.", zh: "@永远看空：看吧，第二轮来了。" },
        pro: { en: "Bond market starting to price rate CUTS.", zh: "债市开始计价「降息」。" }
      }
    ],
    lessons: [
      { en: "Selling at the scariest moment, right before a holiday, is one of the most common retail mistakes.", zh: "在最恐慌的时候、节日前卖出，是散户最常犯的错误之一。" },
      { en: "Most corrections recover. The cost of panic-selling is missing the snap-back.", zh: "大部分回调都会修复。恐慌卖出的代价，是错过反弹。" },
      { en: "A hot stock can fall 50%+ even when the index only drops 20%.", zh: "大盘跌 20% 的时候，热门股可能跌 50% 以上。" }
    ]
  },
  {
    id: "meme",
    code: 6,
    title: { en: "The 2021 Meme-Stock Mania", zh: "2021 迷因股狂潮" },
    period: { en: "Dec 2020 – Aug 2021", zh: "2020 年 12 月 – 2021 年 8 月" },
    rarity: {
      en: "Short squeezes this big happen a few times a decade. Most people bought after it was already on the news.",
      zh: "这么大的逼空每十年也就几次。大多数人是在上了新闻之后才买的。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A struggling mall video-game retailer that hedge funds bet against", zh: "🌶️ 一家被对冲基金做空的、半死不活的商场游戏零售商" },
        reveal: {
          en: "GameStop. It went up about 1,700% in a month, crashed 90%, then squeezed again. Timing was everything.",
          zh: "游戏驿站（GameStop）。一个月涨了约 1700%，暴跌 90%，又再次逼空。时机就是一切。"
        }
      }
    },
    steps: [
      {
        date: "2020-12-01",
        headline: {
          en: "Vaccines are rolling out. Millions of new traders are on zero-commission apps. An online forum is hyping a mall video-game retailer that hedge funds are betting against.",
          zh: "疫苗开始接种。几百万新散户涌进零佣金 App。一个网络论坛正在炒一家被对冲基金做空的商场游戏零售商。"
        },
        feed: { en: "r/stonks: 'I just like the stock 🦍'", zh: "论坛网友：「我就是喜欢这只股票 🦍」" },
        pro: { en: "Short interest in that retailer is over 100% of its shares. Index near record highs.", zh: "那家零售商的做空比例超过总股本的 100%。大盘接近新高。" }
      },
      {
        date: "2021-01-15",
        headline: {
          en: "The video-game retailer more than doubled in a week. A famous e-commerce founder just joined its board.",
          zh: "那家游戏零售商一周内翻了一倍多。一位知名电商创始人刚加入了它的董事会。"
        },
        feed: { en: "r/stonks: '🚀🚀🚀 to the moon, apes'", zh: "论坛网友：「🚀🚀🚀 猿人们，冲向月球」" },
        pro: { en: "Options volume exploding. Short sellers still haven't covered.", zh: "期权成交量爆炸。空头还没平仓。" }
      },
      {
        date: "2021-01-29",
        headline: {
          en: "Mania! The retailer rose about 1,600% in a month. A hedge fund needed a $2.75 billion rescue. Trading apps restricted buying. It's on every TV channel.",
          zh: "疯了！那家零售商一个月涨了约 1600%。一家对冲基金需要 27.5 亿美元救命。交易 App 限制买入。每个电视台都在报道。"
        },
        feed: { en: "r/stonks: 'HOLD THE LINE 💎🙌 $1,000 is not a meme'", zh: "论坛网友：「守住防线 💎🙌 1000 美元不是梦」" },
        pro: { en: "Price is about 100x the company's estimated earnings power. Volatility is off the charts.", zh: "股价约是公司盈利能力的 100 倍。波动率爆表。" },
        mark: "top", markSlots: ["spicy"],
        hindsight: { en: "The retailer peaked this week. Two weeks later it was down about 85%.", zh: "那家零售商就在这一周见顶。两周后跌了约 85%。" }
      },
      {
        date: "2021-02-19",
        headline: {
          en: "The retailer crashed nearly 90% from its peak. Congress is holding hearings. The forum says 'buy the dip, apes'.",
          zh: "那家零售商从高点暴跌近 90%。国会在开听证会。论坛说「猿人们，抄底」。"
        },
        feed: { en: "r/stonks: 'Not selling. I can stay irrational longer than they can stay solvent 🦍'", zh: "论坛网友：「我不卖。我能比他们撑得更久」" },
        pro: { en: "Short interest has collapsed. The squeeze fuel is mostly gone.", zh: "做空比例大幅下降，逼空的燃料基本没了。" }
      },
      {
        date: "2021-03-12",
        headline: {
          en: "It's back! The retailer more than tripled again in two weeks. Nobody can explain why.",
          zh: "又来了！那家零售商两周内又涨了三倍多。没人能解释为什么。"
        },
        feed: { en: "'It's a gamma squeeze.' (a guy who learned the term yesterday)", zh: "「这是伽马挤压。」（一个昨天才学会这个词的人）" },
        pro: { en: "Index steady near records. Inflation starting to tick up.", zh: "大盘稳在新高附近。通胀开始抬头。" }
      },
      {
        date: "2021-05-14",
        headline: {
          en: "Inflation printed 4.2%, but it's 'transitory'. A meme coin with a dog on it is worth $90 billion.",
          zh: "通胀 4.2%，但「是暂时的」。一个印着狗头的迷因币市值 900 亿美元。"
        },
        feed: { en: "Your cousin: 'Should I sell my house and buy the dog coin?'", zh: "你表哥：「我要不要卖房买狗狗币？」" },
        pro: { en: "Index up about 12% since December. Retail trading volume near record.", zh: "大盘从十二月涨了约 12%。散户交易量接近纪录。" }
      },
      {
        date: "2021-06-11",
        headline: {
          en: "The retailer surged again and is now selling new shares to raise cash from its fans.",
          zh: "那家零售商又暴涨了，现在正在向粉丝增发股票融资。"
        },
        feed: { en: "r/stonks: 'They're using our money to fix the company. Bullish?'", zh: "论坛网友：「他们拿我们的钱救公司，利好？」" },
        pro: { en: "Company raised over $1 billion by selling stock to retail buyers.", zh: "公司通过向散户卖股票融了 10 亿美元以上。" }
      }
    ],
    lessons: [
      { en: "By the time it's on TV, the easy money is gone. Late buyers are the exit liquidity.", zh: "等到上电视了，容易赚的钱已经没了。后来的买家就是别人的「出货对象」。" },
      { en: "A stock that can go up 1,600% can also drop 85% in two weeks. Size positions so you can survive both.", zh: "能涨 1600% 的股票，两周也能跌 85%。仓位要小到两种情况你都扛得住。" },
      { en: "Holding paid off hugely here, but only for people who got in early. Anyone who bought the January peak was down about 85% two weeks later.", zh: "这次死拿的回报惊人，但只属于上车早的人。在一月顶部买入的人，两周后亏了约 85%。" }
    ]
  },
  {
    id: "grind",
    code: 7,
    title: { en: "The Calm Bull Market of 2017 (and a Coin Mania)", zh: "2017 平静牛市（和加密狂热）" },
    period: { en: "Jan 2017 – Feb 2018", zh: "2017 年 1 月 – 2018 年 2 月" },
    rarity: {
      en: "A year with no 3% drop at all, like 2017, is rare: maybe once a decade. The common mistake in calm years is selling early out of fear.",
      zh: "像 2017 年这样全年没有一次 3% 回调的年份很罕见，大约十年一次。平静年份最常见的错误是因为害怕提前卖出。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A magic internet coin your nephew won't stop talking about", zh: "🌶️ 你侄子天天念叨的神奇网络货币" },
        reveal: {
          en: "Bitcoin. It went from about $1,000 to nearly $20,000 in 2017, then lost about 65% within weeks.",
          zh: "比特币。2017 年从约 1000 美元涨到近 20000 美元，然后几周内跌了约 65%。"
        }
      }
    },
    steps: [
      {
        date: "2017-01-03",
        headline: {
          en: "A new administration is about to take office promising tax cuts. Many pundits predict a volatile year.",
          zh: "新政府即将上任，承诺减税。很多专家预测今年会剧烈波动。"
        },
        feed: { en: "@permabear: Crash incoming. Buying gold and canned food.", zh: "@永远看空：要崩盘了，买黄金和罐头。" },
        pro: { en: "Volatility index around 12. One rate hike in December.", zh: "波动率指数约 12。去年十二月加息一次。" }
      },
      {
        date: "2017-04-14",
        headline: {
          en: "Geopolitical scare: missile tests and threats exchanged. Stocks dip about 2%.",
          zh: "地缘政治恐慌：导弹试射，互相威胁。股市跌了约 2%。"
        },
        feed: { en: "@permabear: World War 3 starts this summer. Sell.", zh: "@永远看空：今年夏天三战爆发，快卖。" },
        pro: { en: "Earnings growing double digits. Volatility index briefly above 15.", zh: "企业盈利两位数增长。波动率指数短暂超过 15。" }
      },
      {
        date: "2017-06-09",
        headline: {
          en: "Record highs, again. The internet coin has tripled this year.",
          zh: "又创新高。那个网络货币今年翻了三倍。"
        },
        feed: { en: "Your nephew: 'Uncle, you're still buying boring stocks? 😂'", zh: "你侄子：「叔，你还在买那些无聊的股票？😂」" },
        pro: { en: "Volatility index near 10, among the lowest readings ever.", zh: "波动率指数接近 10，几乎是史上最低。" }
      },
      {
        date: "2017-08-11",
        headline: {
          en: "'Fire and fury': nuclear threats traded with a hermit kingdom. Stocks have their worst week since spring.",
          zh: "「火与怒」：与一个隐士王国互相进行核威胁。股市迎来春季以来最差的一周。"
        },
        feed: { en: "@permabear: THIS is the big one.", zh: "@永远看空：这次是真的要崩了。" },
        pro: { en: "Volatility index jumps to 16. Index only about 1.5% below its high.", zh: "波动率指数跳到 16。大盘只比高点低了约 1.5%。" }
      },
      {
        date: "2017-09-15",
        headline: {
          en: "A major country banned coin exchanges and the internet coin crashed about 35%. The stock index makes yet another record.",
          zh: "一个大国封禁了加密货币交易所，那个网络货币暴跌约 35%。股指又创新高。"
        },
        feed: { en: "Your nephew: 'Just a dip. HODL 💎'", zh: "你侄子：「小跌而已，死拿 💎」" },
        pro: { en: "Tax-cut bill being drafted. Volatility index back to 10.", zh: "减税法案正在起草。波动率指数回到 10。" }
      },
      {
        date: "2017-12-22",
        headline: {
          en: "Coin mania: the internet coin hit nearly $20,000 last weekend, up about 1,800% this year. An iced-tea company renamed itself 'Blockchain' and its stock tripled.",
          zh: "币圈狂热：那个网络货币上周末冲到近 20000 美元，今年涨了约 1800%。一家冰茶公司改名叫「区块链」，股价翻了三倍。"
        },
        feed: { en: "Your barber: 'I mortgaged my house for coins. Lambo soon 🏎️'", zh: "你的理发师：「我抵押了房子买币，马上开兰博基尼 🏎️」" },
        pro: { en: "Tax cut signed into law. Volatility index around 10.", zh: "减税法案签署生效。波动率指数约 10。" },
        mark: "top", markSlots: ["spicy"],
        hindsight: { en: "The coin had peaked days earlier and was about to lose about 65%.", zh: "那个币几天前就见顶了，接下来要跌约 65%。" }
      },
      {
        date: "2018-01-26",
        headline: {
          en: "Best January in 30 years! The index is up about 7% in a month. 'Melt-up' is the word of the day.",
          zh: "30 年来最好的一月！大盘一个月涨了约 7%。「融涨」成了热词。"
        },
        feed: { en: "@permabear: (deleted his account)", zh: "@永远看空：（已注销账号）" },
        pro: { en: "Volatility index 11. Bond yields rising quickly.", zh: "波动率指数 11。债券收益率快速上升。" },
        hindsight: { en: "This was the top for now. Over the next two weeks the index fell 10% and a popular volatility fund blew up.", zh: "这是阶段顶部。之后两周大盘跌了 10%，一只热门波动率基金爆仓。" }
      }
    ],
    lessons: [
      { en: "Most years are boring and up. Selling because 'something bad might happen' is the quiet way to lose.", zh: "大部分年份是无聊地上涨。因为「可能会出事」而卖出，是一种安静的亏法。" },
      { en: "Scary headlines (nuclear threats!) often barely move markets.", zh: "吓人的头条（核威胁！）往往对股市影响很小。" },
      { en: "When your barber is mortgaging his house for it, it's late.", zh: "当理发师都抵押房子去买的时候，已经晚了。" }
    ]
  },
  {
    id: "tariff",
    code: 8,
    title: { en: "The 2025 Tariff Shock", zh: "2025 关税冲击" },
    period: { en: "Jan 2025 – Sep 2025", zh: "2025 年 1 月 – 2025 年 9 月" },
    rarity: {
      en: "A roughly 19% drop on a policy shock happens every few years. Recovering all of it in under three months is much rarer.",
      zh: "因政策冲击跌 19% 左右，每隔几年会发生一次。三个月内全部收复要罕见得多。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ The hottest AI chip stock on the planet", zh: "🌶️ 全球最火的 AI 芯片股" },
        reveal: {
          en: "Nvidia. It lost a record $590 billion in one day in January, fell about 37% by April, then became the first $4 trillion company in July.",
          zh: "英伟达。一月份单日蒸发创纪录的 5900 亿美元，到四月跌了约 37%，七月成为首家市值 4 万亿美元的公司。"
        }
      }
    },
    steps: [
      {
        date: "2025-01-06",
        headline: {
          en: "Stocks just had two 20%+ years in a row. AI chip stocks are the new kings. The new administration promises big tariffs.",
          zh: "股市已经连续两年涨超 20%。AI 芯片股是新王者。新政府承诺加征大规模关税。"
        },
        feed: { en: "@ai_maxi: AI capex is infinite. Chips only go up 🤖", zh: "@AI 信徒：AI 投资无上限，芯片只会涨 🤖" },
        pro: { en: "Index forward P/E about 22, well above average. Rates cut 1% late last year.", zh: "大盘远期市盈率约 22，明显高于平均。去年底降息 1%。" }
      },
      {
        date: "2025-01-31",
        headline: {
          en: "A little-known Chinese AI lab released a model it says was trained for a fraction of the usual cost. The top AI chip stock lost about $590 billion in one day, a record.",
          zh: "一家不知名的中国 AI 实验室发布了一个模型，说训练成本只是别人的零头。头号 AI 芯片股一天蒸发约 5900 亿美元，创纪录。"
        },
        feed: { en: "@ai_maxi: Jevons paradox. Buying the dip with both hands.", zh: "@AI 信徒：杰文斯悖论。双手抄底。" },
        pro: { en: "Index barely moved. Tariff threats on neighbors are back and forth.", zh: "大盘几乎没动。对邻国的关税威胁反反复复。" }
      },
      {
        date: "2025-03-14",
        headline: {
          en: "Tariff whiplash: on, off, on again. Stocks are down 10% from the top: an official correction.",
          zh: "关税反复横跳：加、停、再加。股市从高点跌了 10%，正式进入回调。"
        },
        feed: { en: "Uncle Bob: 'I'm waiting for it to calm down before buying.'", zh: "鲍勃叔叔：「等稳定下来再买。」" },
        pro: { en: "Consumer confidence falling. Volatility index above 25.", zh: "消费者信心下滑。波动率指数超过 25。" }
      },
      {
        date: "2025-04-04",
        headline: {
          en: "'Liberation Day': sweeping tariffs on almost every country. Stocks crashed about 10% in two days, the worst since 2020.",
          zh: "「解放日」：对几乎所有国家征收全面关税。股市两天暴跌约 10%，2020 年以来最惨。"
        },
        feed: { en: "Everyone: 'Black Monday is coming.'", zh: "所有人：「黑色星期一要来了。」" },
        pro: { en: "Volatility index above 45. China retaliating with its own tariffs.", zh: "波动率指数超过 45。中国以关税反制。" },
        mark: "bottom",
        hindsight: { en: "The bottom was just days away (April 8). The index regained everything by late June.", zh: "底部就在几天后（4 月 8 日）。六月底大盘就收复了全部失地。" }
      },
      {
        date: "2025-04-11",
        headline: {
          en: "The wildest week in years: a 90-day tariff pause sent the index up about 9.5% in one day, one of its best days ever.",
          zh: "多年来最疯狂的一周：90 天关税暂停让大盘一天暴涨约 9.5%，史上最好的交易日之一。"
        },
        feed: { en: "Uncle Bob: 'Wait, I sold on Monday...'", zh: "鲍勃叔叔：「等等，我周一刚卖……」" },
        pro: { en: "Bond market turmoil. Tariffs on China at 145%.", zh: "债市动荡。对华关税达到 145%。" }
      },
      {
        date: "2025-05-16",
        headline: {
          en: "Trade truce with China: tariffs slashed for 90 days. Stocks erased all losses since 'Liberation Day'.",
          zh: "中美贸易休战：关税大幅下调 90 天。股市收复了「解放日」以来的全部跌幅。"
        },
        feed: { en: "@permabear: Dead-cat bounce. Recession in Q3.", zh: "@永远看空：死猫跳，第三季度衰退。" },
        pro: { en: "Index back near flat for the year. A credit agency just downgraded US debt.", zh: "大盘年内回到平盘附近。评级机构刚下调美国主权评级。" }
      },
      {
        date: "2025-07-18",
        headline: {
          en: "Record highs. The AI chip stock just became the first $4 trillion company.",
          zh: "创历史新高。那只 AI 芯片股刚成为首家 4 万亿美元市值的公司。"
        },
        feed: { en: "@ai_maxi: $10 trillion by Christmas 🚀", zh: "@AI 信徒：圣诞前 10 万亿 🚀" },
        pro: { en: "Index forward P/E back above 22.", zh: "大盘远期市盈率回到 22 以上。" }
      }
    ],
    lessons: [
      { en: "The best days come right after the worst days. Selling the panic often means missing the rebound.", zh: "最好的日子紧挨着最差的日子。恐慌时卖出，往往就错过了反弹。" },
      { en: "Policy headlines flip fast. Plans made in advance beat decisions made in a panic.", zh: "政策头条翻得很快。提前定好的计划，胜过恐慌时的决定。" },
      { en: "A $590 billion one-day loss didn't end the AI trade. Single headlines rarely decide the long run.", zh: "单日蒸发 5900 亿没有终结 AI 行情。单条新闻很少决定长期走势。" }
    ]
  },
  {
    id: "dip",
    code: 9,
    title: { en: "A Normal 10% Correction (2023)", zh: "一次普通的 10% 回调（2023）" },
    period: { en: "Jul 2023 – Feb 2024", zh: "2023 年 7 月 – 2024 年 2 月" },
    rarity: {
      en: "A 10% correction happens on average about once a year. Most recover within a few months.",
      zh: "10% 的回调平均大约每年一次。大部分几个月内就会修复。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A famous electric-car maker with a very online CEO", zh: "🌶️ 一家 CEO 特别爱上网的知名电动车公司" },
        reveal: {
          en: "Tesla. It lost about a quarter of its value in this window while the index made new highs. Hot stocks march to their own drum.",
          zh: "特斯拉。这段时间它跌了约四分之一，而大盘却创了新高。热门股有自己的节奏。"
        }
      }
    },
    steps: [
      {
        date: "2023-07-17",
        headline: {
          en: "Stocks are up about 25% from last October's low, driven by AI excitement. Inflation is cooling.",
          zh: "在 AI 热潮带动下，股市从去年十月低点涨了约 25%。通胀在降温。"
        },
        feed: { en: "@ai_maxi: AI summer is here ☀️", zh: "@AI 信徒：AI 的夏天来了 ☀️" },
        pro: { en: "Rates at 5.25%, the highest since 2001.", zh: "利率 5.25%，2001 年以来最高。" },
        mark: "top",
        hindsight: { en: "The index peaked at the end of July before a 10% pullback.", zh: "大盘在七月底见顶，随后回调 10%。" }
      },
      {
        date: "2023-08-18",
        headline: {
          en: "A credit agency downgraded the US government's credit rating. Bond yields rising. Stocks down about 5%.",
          zh: "一家评级机构下调了美国政府的信用评级。债券收益率上升。股市跌了约 5%。"
        },
        feed: { en: "@permabear: The debt bomb is going off.", zh: "@永远看空：债务炸弹要爆了。" },
        pro: { en: "10-year yield 4.3%, highest since 2007.", zh: "十年期收益率 4.3%，2007 年以来最高。" }
      },
      {
        date: "2023-09-22",
        headline: {
          en: "The central bank says rates will stay 'higher for longer'. The 10-year yield hit a 16-year high.",
          zh: "央行说利率将「更高更久」。十年期收益率创 16 年新高。"
        },
        feed: { en: "Your cousin: 'My savings account pays 5% now. Why own stocks?'", zh: "你表哥：「储蓄账户都有 5% 了，还买什么股票？」" },
        pro: { en: "Oil above $90. A government-shutdown deadline next week.", zh: "油价超过 90 美元。下周又是政府停摆的最后期限。" }
      },
      {
        date: "2023-10-27",
        headline: {
          en: "War in the Middle East. The 10-year yield touched 5%. Stocks are down 10% from July: an official correction.",
          zh: "中东爆发战争。十年期收益率触及 5%。股市从七月跌了 10%，正式回调。"
        },
        feed: { en: "@permabear: Next stop: minus 30%.", zh: "@永远看空：下一站，跌 30%。" },
        pro: { en: "Volatility index above 20. Earnings mostly beating estimates.", zh: "波动率指数超过 20。财报大多超预期。" },
        mark: "bottom",
        hindsight: { en: "This was the bottom. The next four months: about +20%.", zh: "这就是底部。之后四个月涨了约 20%。" }
      },
      {
        date: "2023-12-15",
        headline: {
          en: "The central bank signals rate cuts next year. Stocks surged about 15% in seven weeks, nearly back at record highs.",
          zh: "央行暗示明年降息。股市七周暴涨约 15%，几乎回到历史新高。"
        },
        feed: { en: "Your cousin: 'OK maybe I should buy some stocks now?'", zh: "你表哥：「好吧，也许我现在该买点股票了？」" },
        pro: { en: "Market pricing six rate cuts in 2024.", zh: "市场计价 2024 年降息六次。" }
      },
      {
        date: "2024-01-26",
        headline: {
          en: "Record highs! But the electric-car maker warned of slowing growth and fell 12% in a day.",
          zh: "创历史新高！但那家电动车公司预警增长放缓，一天跌了 12%。"
        },
        feed: { en: "@ev_bull: It's a robotaxi company now. Buying more.", zh: "@电车多头：它现在是自动驾驶出租车公司了，加仓。" },
        pro: { en: "AI chip stocks leading. Index up about 20% from October.", zh: "AI 芯片股领涨。大盘从十月涨了约 20%。" }
      }
    ],
    lessons: [
      { en: "A 10% dip is normal, about once a year. Treating each one like 2008 is expensive.", zh: "10% 的下跌很正常，大约一年一次。把每次都当 2008 来对待，代价很高。" },
      { en: "'Cash pays 5%' felt safe right before stocks jumped 20%.", zh: "「存款有 5%」感觉很安全，然后股市就涨了 20%。" },
      { en: "A single hot stock can fall while the index rises. The index is the default for a reason.", zh: "单只热门股可以在大盘上涨时下跌。指数是默认选择，是有原因的。" }
    ]
  },
  {
    id: "chop",
    code: 10,
    title: { en: "The Going-Nowhere Market of 2015–16", zh: "2015–16 原地踏步的震荡市" },
    period: { en: "May 2015 – Nov 2016", zh: "2015 年 5 月 – 2016 年 11 月" },
    rarity: {
      en: "Choppy, go-nowhere stretches like this happen every few years. Two 10%+ drops that both recover within months is pretty normal.",
      zh: "这种来回震荡、原地踏步的行情每隔几年就有一次。半年内两次跌超 10% 又都涨回来，相当正常。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ A pharma roll-up that Wall Street's star funds love", zh: "🌶️ 一家华尔街明星基金最爱的「并购型」药企" },
        reveal: {
          en: "Valeant Pharmaceuticals. Famous hedge funds owned it. It fell about 94% after questions about its drug pricing and a secret pharmacy.",
          zh: "威朗制药（Valeant）。著名对冲基金重仓持有。药品定价和一家秘密药房的问题曝光后，股价跌了约 94%。"
        }
      }
    },
    steps: [
      {
        date: "2015-05-01",
        headline: {
          en: "Stocks are at record highs but have barely moved in six months. The central bank says its first rate hike in nearly a decade is coming 'this year'.",
          zh: "股市在历史高位，但半年来几乎没动。央行说近十年来的首次加息「今年就会来」。"
        },
        feed: { en: "@stonks4life: Boring market = free money. Buy everything.", zh: "@股票永远涨：无聊的市场就是白送钱，全买。" },
        pro: { en: "Rates at 0% since 2008. Index P/E around 18. The strong dollar is squeezing exporters' profits.", zh: "利率从 2008 年起一直是 0%。大盘市盈率约 18。美元走强挤压出口企业利润。" }
      },
      {
        date: "2015-07-10",
        headline: {
          en: "Greece voted 'no' on a bailout and might leave the euro. China's stock market crashed 30% in a month even with the government buying.",
          zh: "希腊公投否决救助方案，可能退出欧元区。中国股市一个月暴跌 30%，政府救市也没用。"
        },
        feed: { en: "Uncle Bob: 'Is Greece a stock? Should I sell it?'", zh: "鲍勃叔叔：「希腊是一只股票吗？我要不要卖？」" },
        pro: { en: "US index only about 2% below its high. Volatility index up to 19.", zh: "美股大盘只比高点低约 2%。波动率指数升到 19。" }
      },
      {
        date: "2015-08-28",
        headline: {
          en: "China surprised everyone by devaluing its currency. Stocks fell 11% in a week. On Monday the Dow opened 1,000 points down and many funds briefly traded at crazy prices.",
          zh: "中国意外让人民币贬值。美股一周跌了 11%。周一道指开盘暴跌 1000 点，很多基金一度出现离谱的价格。"
        },
        feed: { en: "@permabear: 2008 all over again. Get out.", zh: "@永远看空：2008 重演，快跑。" },
        pro: { en: "Volatility index spiked above 50 for the first time since 2011.", zh: "波动率指数自 2011 年以来首次冲破 50。" },
        hindsight: { en: "The index bottomed that Tuesday, retested the low in late September, then rallied about 12% by early November.", zh: "大盘在那个周二见底，九月底二次探底，然后到十一月初反弹了约 12%。" }
      },
      {
        date: "2015-10-23",
        headline: {
          en: "Rebound: the index is up about 10% from its August low. Meanwhile Wall Street's favorite pharma stock crashed after a short seller questioned a secret pharmacy it controls.",
          zh: "反弹了：大盘从八月低点涨了约 10%。与此同时，华尔街最爱的那只药企股暴跌，因为做空机构质疑它暗中控制的一家药房。"
        },
        feed: { en: "@hedgefund_fan: The smartest funds own the pharma stock. Buying the dip.", zh: "@对冲基金粉：最聪明的基金都持有那只药企，抄底。" },
        pro: { en: "Rate hike delayed again. Big Tech earnings strong.", zh: "加息再次推迟。科技巨头财报强劲。" }
      },
      {
        date: "2015-12-18",
        headline: {
          en: "The central bank raised rates for the first time in nearly a decade. Oil fell below $35. A junk-bond fund froze withdrawals.",
          zh: "央行近十年来首次加息。油价跌破 35 美元。一只垃圾债基金暂停赎回。"
        },
        feed: { en: "Your cousin: 'My oil stocks are down 60%. Averaging down!'", zh: "你表哥：「我的石油股跌了 60%，补仓摊薄成本！」" },
        pro: { en: "Junk-bond spreads at 4-year highs. Energy earnings collapsing.", zh: "垃圾债利差创四年新高。能源公司盈利崩塌。" }
      },
      {
        date: "2016-02-12",
        headline: {
          en: "Worst start to a year ever: stocks down about 10% in six weeks. Oil hit $26. Big European banks are sliding. Recession talk everywhere.",
          zh: "史上最差的开年：六周跌了约 10%。油价跌到 26 美元。欧洲大银行股价下滑。到处都在说衰退。"
        },
        feed: { en: "@permabear: Told you. This is the big one.", zh: "@永远看空：早说了，这次是大的。" },
        pro: { en: "Volatility index about 28. Markets now expect no more rate hikes this year.", zh: "波动率指数约 28。市场预计今年不会再加息。" },
        mark: "bottom",
        markSlots: ["index", "tech"],
        hindsight: { en: "February 11, 2016 was the bottom. The index hit a new record high by July.", zh: "2016 年 2 月 11 日就是底部。七月大盘就创了历史新高。" }
      },
      {
        date: "2016-06-24",
        headline: {
          en: "Shock vote: the UK chose to leave the EU. Stocks fell 3.6% in a day and the British pound hit a 31-year low.",
          zh: "意外结果：英国公投脱欧。美股一天跌了 3.6%，英镑跌到 31 年最低。"
        },
        feed: { en: "Everyone: 'What is a Brexit and why is my retirement account down?'", zh: "所有人：「脱欧是啥？为什么我的养老金账户在跌？」" },
        pro: { en: "Volatility index jumped to 25. Bond yields at record lows.", zh: "波动率指数跳到 25。债券收益率创历史新低。" },
        hindsight: { en: "Stocks won back the whole drop in about two weeks and hit records in July.", zh: "大约两周就收复全部跌幅，七月创了新高。" }
      },
      {
        date: "2016-11-04",
        headline: {
          en: "The election is Tuesday. Stocks fell nine days in a row, the longest losing streak since 1980. Pundits say a surprise result would crash the market.",
          zh: "周二大选。股市连跌九天，1980 年以来最长的连跌。专家说如果爆冷，股市会崩。"
        },
        feed: { en: "@permabear: If the outsider wins, minus 10% overnight.", zh: "@永远看空：如果黑马赢了，一夜跌 10%。" },
        pro: { en: "Volatility index above 22. Betting markets heavily favor the front-runner.", zh: "波动率指数超过 22。博彩市场大幅押注领先者。" },
        hindsight: { en: "The surprise happened. Futures fell 5% on election night, then stocks rallied to records within days.", zh: "真的爆冷了。大选当夜期货跌了 5%，几天后股市却涨到了新高。" }
      }
    ],
    lessons: [
      { en: "A year and a half of scary headlines, and the index ended about where it started.", zh: "一年半的吓人头条，大盘最后基本回到原点。" },
      { en: "China, oil, Brexit, the election: each scare felt like the big one. None of them was.", zh: "中国、石油、脱欧、大选：每次恐慌都像「大的要来了」，结果一次都不是。" },
      { en: "A stock the 'smart money' loves can still go nearly to zero.", zh: "「聪明钱」最爱的股票，照样可以跌到几乎归零。" }
    ]
  },
  {
    id: "ai2024",
    code: 11,
    title: { en: "The 2024 AI Bull Year", zh: "2024 AI 牛市年" },
    period: { en: "Mar 2024 – Dec 2024", zh: "2024 年 3 月 – 2024 年 12 月" },
    rarity: {
      en: "A strong year (+20% or more) comes about one year in three or four. Even good years usually include one scary 5–10% drop.",
      zh: "涨 20% 以上的好年份，大约三四年一次。即使是好年份，通常也会有一次吓人的 5–10% 下跌。"
    },
    assets: {
      index: { hidden: INDEX_HIDDEN, reveal: INDEX_REVEAL },
      tech: { hidden: TECH_HIDDEN, reveal: TECH_REVEAL },
      spicy: {
        hidden: { en: "🌶️ An AI server maker that tripled this year", zh: "🌶️ 一家今年涨了三倍的 AI 服务器公司" },
        reveal: {
          en: "Super Micro Computer. It roughly quadrupled in early 2024 and joined the S&P 500. Then came a short-seller report, a delayed annual report and its auditor quitting, and it fell about 85% from the peak.",
          zh: "超微电脑（Super Micro）。2024 年初涨了约四倍并进入标普 500。随后做空报告、年报延迟、审计师辞职接连而来，股价从高点跌了约 85%。"
        }
      }
    },
    steps: [
      {
        date: "2024-03-01",
        headline: {
          en: "Stocks at record highs, driven by AI. An AI server maker has tripled this year and was just added to the 500-stock index. Rate cuts are expected soon.",
          zh: "AI 带动股市创新高。一家 AI 服务器公司今年涨了三倍，刚被纳入 500 指数。市场预计很快降息。"
        },
        feed: { en: "@ai_maxi: Every company will need AI servers. This is 1995 again.", zh: "@AI 信徒：每家公司都需要 AI 服务器。这就是 1995 年。" },
        pro: { en: "Rates at 5.25–5.5%. Market expects three cuts this year. Index P/E about 21.", zh: "利率 5.25–5.5%。市场预计今年降息三次。大盘市盈率约 21。" }
      },
      {
        date: "2024-04-19",
        headline: {
          en: "Inflation came in hot three months in a row and rate cuts are being pushed back. Tension in the Middle East. Stocks down about 5% from the high.",
          zh: "通胀连续三个月超预期，降息被推迟。中东局势紧张。股市从高点跌了约 5%。"
        },
        feed: { en: "@permabear: No cuts this year. Correction incoming.", zh: "@永远看空：今年不会降息了，回调要来了。" },
        pro: { en: "10-year yield back up to 4.6%.", zh: "十年期收益率回升到 4.6%。" }
      },
      {
        date: "2024-06-14",
        headline: {
          en: "Record highs again. The top AI chip maker is now worth over $3 trillion. The AI server maker is well below its March peak.",
          zh: "又创新高。头号 AI 芯片公司市值超过 3 万亿美元。那家 AI 服务器公司已经远低于三月的高点。"
        },
        feed: { en: "Your cousin: 'Should I buy the AI chip stock? It's the only thing going up.'", zh: "你表哥：「要不要买那只 AI 芯片股？就它在涨。」" },
        pro: { en: "Inflation finally cooling. Market now expects one or two cuts.", zh: "通胀终于降温。市场预计降息一到两次。" }
      },
      {
        date: "2024-08-02",
        headline: {
          en: "A weak jobs report sparked recession fears. Japan raised rates, and a popular trade (borrowing cheap yen to buy stocks) is unwinding fast. Tech is down 10% from its July high.",
          zh: "疲弱的就业数据引发衰退担忧。日本加息，一个热门交易（借便宜日元买股票）正在快速平仓。科技股从七月高点跌了 10%。"
        },
        feed: { en: "@permabear: The AI bubble is popping. Finally.", zh: "@永远看空：AI 泡沫终于破了。" },
        pro: { en: "Volatility index jumped to 23. Japanese stocks fell almost 6% on Friday.", zh: "波动率指数跳到 23。日本股市周五跌了近 6%。" },
        mark: "bottom",
        markSlots: ["index", "tech"],
        hindsight: { en: "The next Monday Japan's market fell 12% in a day, and that was the low. The index was back at record highs within about six weeks.", zh: "下周一日本股市单日暴跌 12%，那就是最低点。大约六周后大盘就重回新高。" }
      },
      {
        date: "2024-09-20",
        headline: {
          en: "The central bank cut rates by 0.5%, its first cut in four years. Stocks at record highs. Last month a short seller accused the AI server maker of accounting problems.",
          zh: "央行降息 0.5%，四年来首次降息。股市创新高。上个月一家做空机构指控那家 AI 服务器公司财务有问题。"
        },
        feed: { en: "@ai_maxi: Short sellers always lie. Buying the server stock dip.", zh: "@AI 信徒：做空机构都在撒谎，抄底服务器股。" },
        pro: { en: "More cuts signaled. Volatility index about 16.", zh: "央行暗示还会降息。波动率指数约 16。" }
      },
      {
        date: "2024-11-01",
        headline: {
          en: "The election is next week. The AI server maker's auditor just resigned, and the stock lost a third of its value in one day.",
          zh: "下周大选。那家 AI 服务器公司的审计师刚刚辞职，股价一天跌掉三分之一。"
        },
        feed: { en: "@ai_maxi: Accounting is a social construct. HODL 💎", zh: "@AI 信徒：会计只是一种社会建构，死拿 💎" },
        pro: { en: "Index about 2% below its record. Volatility index 22.", zh: "大盘比纪录高点低约 2%。波动率指数 22。" }
      },
      {
        date: "2024-11-15",
        headline: {
          en: "Post-election rally: the index topped 6,000 for the first time. Bitcoin hit $90,000.",
          zh: "大选后大涨：大盘首次突破 6000 点。比特币冲上 9 万美元。"
        },
        feed: { en: "Your cousin: 'Stocks only go up. I'm quitting my job to trade.'", zh: "你表哥：「股票只会涨，我要辞职全职炒股。」" },
        pro: { en: "Index up about 23% this year. P/E above 22.", zh: "大盘今年涨了约 23%。市盈率超过 22。" }
      }
    ],
    lessons: [
      { en: "Even a great year had a moment when 'the AI bubble is popping' felt true.", zh: "即使是大牛年，也有那么一刻让人觉得「AI 泡沫破了」。" },
      { en: "A hot theme doesn't protect a single stock: the hottest name fell about 85% while the index gained 20%+.", zh: "热门主题保护不了单只股票：最火的那只跌了约 85%，而大盘涨了 20% 以上。" },
      { en: "Sitting in cash through a strong year is the quietest way to fall behind.", zh: "牛市里一直拿着现金，是最安静的落后方式。" }
    ]
  }
];
