# VideoCode v2.0 - 语义通信引擎

**目标**：实现真正的 Encoder → Network → Decoder 流程，并量化带宽压缩效果。

## 架构设计

```
┌─────────────┐      JSON (1.5 KB/s)      ┌─────────────┐
│  Encoder    │ ─────────────────────────→ │  Decoder    │
│  (采集端)   │       WebSocket/HTTP       │  (渲染端)   │
│             │                            │             │
│ - MediaPipe │                            │ - Canvas    │
│ - 468 Points│                            │ - 红线人    │
│ - JSON Pack │                            │ - Sync      │
└─────────────┘                            └─────────────┘
```

## 核心指标
- **VideoCode 流量**: ~1.5 KB/s (仅传输关键点坐标)
- **H.264 流量**: ~500 KB/s (同等清晰度)
- **压缩率**: **99.7%**

## 文件结构
```
videocode-v2/
├── encoder.html      # 发送端（采集 + 编码）
├── decoder.html      # 接收端（解码 + 渲染）
├── server.js         # 中转服务器（WebSocket）
├── README.md         # 项目说明
└── test-report.md    # 带宽测试报告
```
