# 《明日放送》素材与许可

## 插画

四张场景背景（广播室、走廊、天台、校门），林夏一套立绘及平静、微笑、低落、惊讶四种表情，一张同频结局插画，均使用 OpenAI 内置 ImageGen 工具为本项目生成。

原始 PNG 与完整提示词保留在 `art-source/`，游戏使用 `game/background/` 和 `game/figure/` 中的 WebP。提示词记录里的机器绝对路径仅为生成来源；重建优先使用项目内 PNG，不依赖原机器目录。素材未冒充人工绘制或宣称排他版权；实际使用仍受生成服务适用条款约束。

## 音乐与音效

以下曲目由 `tools/assets.py` 中的原创音序及合成器程序生成，不使用外部录音或采样，随本项目以 CC0-1.0 提供使用：

| 文件 | 曲名 / 用途 | 长度 |
| --- | --- | --- |
| rain-letter.wav | 雨中的来信 / 开场与遗憾结局 | 约 52 秒，循环 |
| between-us.wav | 我们之间 / 调查与重逢 | 约 47 秒，循环 |
| tomorrow.wav | 明日的频率 / 最后播音与同频 | 约 49 秒，循环 |
| rain.wav | 合成雨声 | 8 秒 |
| static.wav | 合成收音机电流声 | 0.85 秒 |
| ui.wav | 轻提示音 | 0.12 秒 |

## 引擎与字体

- WebGAL 4.6.6： https://github.com/OpenWebGAL/WebGAL ，MPL-2.0。完整引擎源码和 LICENSE 随项目提供；项目修改的入口、Title 组件、主题样式与下方工具栏样式可由构建脚本重建。
- WebGAL 原有界面音效沿用上游资源。正式网页界面采用系统字体；剧情宋体是 Adobe Source Han Serif 的 WOFF2 子集，已将字体内部名称改为 Tomorrow Serif Subset，遵循 SIL OFL-1.1，原许可见同目录 `LICENSE-SourceHanSerif.txt`。完整上游字体保留在引擎源码资源目录；资源圆体许可见该目录的 `LICENSE-ResourceHanRounded`，正式网页不加载该字体和 OPPOSans。
- 未引入 Live2D 模型、SDK 或第三方角色素材。

源码交付保留 npm 锁文件以复现依赖。对外分发 WebGAL 修改版本时应同时提供适用的 MPL 源码与许可；本项目提供完整源码包。
