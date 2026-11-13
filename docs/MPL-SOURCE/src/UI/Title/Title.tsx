import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setMenuPanelTag, setVisibility } from '@/store/GUIReducer';
import { MenuPanelTag } from '@/store/guiInterface';
import { startGame, continueGame } from '@/Core/controller/gamePlay/startContinueGame';
import useConfigData from '@/hooks/useConfigData';
import './broadcast.scss';

export default function Title() {
  const gui = useSelector((s: RootState) => s.GUI);
  const fastSave = useSelector((s: RootState) => s.saveData.quickSaveData);
  const flags = useSelector((s: RootState) => s.userData.globalGameVar);
  const dispatch = useDispatch();
  const [panel, setPanel] = useState<'archive' | 'about' | null>(null);
  useConfigData();
  const menu = (tag: MenuPanelTag) => {
    dispatch(setMenuPanelTag(tag));
    dispatch(setVisibility({ component: 'showMenuPanel', visibility: true }));
  };
  return <>
    <div className="title__enter-game-target" onClick={() => dispatch(setVisibility({ component: 'isEnterGame', visibility: true }))} />
    {gui.showTitle && <main className="broadcast-title">
      <div className="broadcast-scene" style={{backgroundImage:"url('game/background/radio.webp')"}} />
      <img className="broadcast-girl" src="game/figure/linxia-neutral.webp" alt="林夏，等待最后一次晚间放送" />
      <div className="broadcast-paper" />
      <div className="broadcast-station"><span className="station-icon">◖</span><span>南川大学 · 校园广播站<small>NANCHUAN UNIVERSITY RADIO</small></span></div>
      <div className="broadcast-story">
        <div className="broadcast-eyebrow"><span /> A LETTER FROM TOMORROW</div>
        <h1>明日<span>放送<i>。</i></span></h1>
        <p className="broadcast-tagline">如果能听见明天，<br />你会把今天的话说完吗？</p>
        <div className="broadcast-divider"><span /> JUNE 17 · RAINY <span /></div>
        <nav className="broadcast-nav" aria-label="游戏主菜单">
          <button className="broadcast-start" onClick={() => startGame()}><span>开始收听</span><span className="button-en">START THE STORY</span><b>↗</b></button>
          <button disabled={!fastSave} onClick={() => continueGame()}><span>继续收听</span><span className="button-en">CONTINUE</span><b>→</b></button>
          <div className="broadcast-small-nav"><button onClick={() => menu(MenuPanelTag.Load)}>读取存档</button><span>·</span><button onClick={() => menu(MenuPanelTag.Option)}>播放设置</button><span>·</span><button onClick={() => setPanel('archive')}>回声档案</button></div>
        </nav>
      </div>
      <div className="broadcast-quote"><span>“</span>给此刻仍在收听的你。<small>愿所有没有抵达的声音，都能找到回响。</small></div>
      <footer className="broadcast-footer"><span>一段雨天的重逢 / 约 15—30 分钟 / 三种回响</span><button onClick={() => setPanel('about')}>游玩说明 & 制作手记 ↗</button></footer>
      <div className="broadcast-frequency"><span className="live-dot" /> FM 06.17 <span className="frequency-wave">▁▃▂▆▃▇▂▅▂▃▁</span> ON AIR TOMORROW</div>
      {panel && <div className="broadcast-modal-backdrop" onClick={() => setPanel(null)}>
        <section className="broadcast-modal" role="dialog" aria-modal="true" aria-label={panel === 'about' ? '游玩说明与制作手记' : '回声档案'} onClick={e => e.stopPropagation()}>
          <button className="broadcast-close" onClick={() => setPanel(null)} aria-label="关闭">×</button>
          <p className="broadcast-eyebrow">{panel === 'about' ? 'BEFORE YOU TUNE IN' : 'ECHOES WE KEPT'}</p>
          <h2>{panel === 'about' ? '留一点时间，听完。' : '回声档案'}</h2>
          {panel === 'about' ? <>
            <p>一部校园恋爱与轻悬疑短篇。所有主要角色均为成年人。</p>
            <p>点击画面或按空格推进；文字出现时再点一次可立即显示。下方工具栏可自动播放、已读快进、查看历史以及保存进度。遇到选项时，请亲自选择。</p>
            <p>手机推荐横屏游玩。存档保存在当前浏览器，更换设备、浏览器或清除网站数据后不会同步。重要进度请使用手动存档。</p>
            <p>剧本与配乐为本项目制作，插画由 AI 生成。引擎采用 WebGAL（MPL-2.0）。本作无配音，无实时 AI 对话。</p>
            <p className="broadcast-note">献给每一个曾把一句话留给“以后”的人。</p>
          </> : <>
            <p>每次完整收听，都会留下不同的回声。</p>
            <div className="broadcast-endings">{[['endingSame','01','同频','有些声音，终于抵达了彼此。'],['endingUnsent','02','未寄出的声音','有些留白，后来成了一封长信。'],['endingSeeYou','03','明天见','告别不是静音，而是下一次接通。']].map(([key,n,title,line]) => <article key={key} className={flags[key] ? 'unlocked' : ''}><small>ENDING {n} · {flags[key] ? '已收听' : '尚未收听'}</small><h3>{flags[key] ? title : '等待接通'}</h3><p>{flags[key] ? line : '故事的另一种可能，仍在频率之间。'}</p></article>)}</div>
            {flags.endingSame && <img className="broadcast-memory" src="game/background/promise.webp" alt="同频结局纪念：两人的手在广播室相遇" />}
          </>}
        </section>
      </div>}
    </main>}
  </>;
}
