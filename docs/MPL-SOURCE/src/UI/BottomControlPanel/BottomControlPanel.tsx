import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setMenuPanelTag, setVisibility } from '@/store/GUIReducer';
import { MenuPanelTag } from '@/store/guiInterface';
import { switchAuto } from '@/Core/controller/gamePlay/autoPlay';
import { switchFast, stopAll } from '@/Core/controller/gamePlay/fastSkip';
import { backToTitle } from '@/Core/controller/gamePlay/backToTitle';
import { WebGAL } from '@/Core/WebGAL';
import useFullScreen from '@/hooks/useFullScreen';
import { useStageState } from '@/hooks/useStageState';

export function BottomControlPanel(){
  const gui=useSelector((s:RootState)=>s.GUI);
  const stage=useStageState();const dispatch=useDispatch();
  const fullscreen=useFullScreen();
  const [mode,setMode]=useState({auto:false,fast:false});
  useEffect(()=>{const t=setInterval(()=>setMode(m=>m.auto===WebGAL.gameplay.isAuto&&m.fast===WebGAL.gameplay.isFast?m:{auto:WebGAL.gameplay.isAuto,fast:WebGAL.gameplay.isFast}),250);return()=>clearInterval(t);},[]);
  const menu=(tag:MenuPanelTag)=>{stopAll();dispatch(setMenuPanelTag(tag));dispatch(setVisibility({component:'showMenuPanel',visibility:true}));};
  useEffect(()=>{
    const close=(e:KeyboardEvent)=>{
      if(e.code!=='Escape'||e.isComposing)return;
      e.preventDefault();
      if(gui.showGlobalDialog)dispatch(setVisibility({component:'showGlobalDialog',visibility:false}));
      else if(gui.showMenuPanel)dispatch(setVisibility({component:'showMenuPanel',visibility:false}));
      else if(gui.showBacklog){dispatch(setVisibility({component:'showBacklog',visibility:false}));dispatch(setVisibility({component:'showTextBox',visibility:true}));}
      else if(!gui.showTitle)menu(MenuPanelTag.Option);
    };
    document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);
  },[gui.showGlobalDialog,gui.showMenuPanel,gui.showBacklog,gui.showTitle]);
  if(gui.showBacklog)return <button className="broadcast-return" onClick={()=>{dispatch(setVisibility({component:'showBacklog',visibility:false}));dispatch(setVisibility({component:'showTextBox',visibility:true}));}}>← 返回剧情</button>;
  if(gui.showTitle||!gui.showTextBox||stage.enableFilm!==''||!gui.controlsVisibility)return null;
  return <nav className="broadcast-controls" aria-label="阅读工具" onClick={e=>e.stopPropagation()}>
    <button onClick={()=>{stopAll();dispatch(setVisibility({component:'showBacklog',visibility:true}));dispatch(setVisibility({component:'showTextBox',visibility:false}));}}><span>≡</span>历史</button>
    <button id="Button_ControlPanel_auto" aria-pressed={mode.auto} onClick={()=>switchAuto()}><span>▷</span>自动</button>
    <button id="Button_ControlPanel_fast" aria-pressed={mode.fast} onClick={()=>switchFast()}><span>≫</span>快进</button>
    <button onClick={()=>menu(MenuPanelTag.Save)}><span>↓</span>存档</button>
    <button onClick={()=>menu(MenuPanelTag.Load)}><span>↑</span>读档</button>
    <button onClick={()=>menu(MenuPanelTag.Option)}><span>⚙</span>设置</button>
    <button onClick={()=>backToTitle()}><span>⌂</span>标题</button>
    <button disabled={!fullscreen.isSupported} onClick={()=>fullscreen.toggle()}><span>⛶</span>{fullscreen.isFullScreen?'退出全屏':'全屏'}</button>
  </nav>;
}
