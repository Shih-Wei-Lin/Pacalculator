# Daniels' Pace Calculator (丹尼爾博士配速計算器)

一個基於《丹尼爾博士的跑步科學》(Jack Daniels' Running Formula) 所開發的配速計算器。旨在幫助跑者精確計算 VDOT 值，並以此推導出各類訓練強度（E、M、T、I、R）的建議配速與比賽成績預測。

## 核心功能 (Roadmap)

- **VDOT 計算器**：根據最近的比賽成績計算跑者的 VDOT 等級。
- **訓練配速建議**：
  - **E (Easy Pace)**：輕鬆跑，用於恢復與基礎耐力。
  - **M (Marathon Pace)**：馬拉松配速，模擬目標比賽節奏。
  - **T (Threshold Pace)**：乳酸門檻跑，提升耐乳酸能力。
  - **I (Interval Pace)**：間歇跑，提升最大攝氧量 (VO2max)。
  - **R (Repetition Pace)**：重複跑，提升跑步經濟性與速度。
- **比賽成績預測**：根據當前 VDOT 預測 5K、10K、半馬、全馬的可能成績。
- **單位轉換**：支援公里 (km) 與英里 (mile) 切換。
- **行動優先設計**：方便跑者在操場或戶外隨時透過手機查看。

## 技術棧

- **框架**: React 19
- **語言**: TypeScript 6
- **構建工具**: Vite 8
- **樣式**: CSS Variables / Tailwind CSS
- **部署**: GitHub Pages

## 本地開發

1. 安裝依賴：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 構建專案：
   ```bash
   npm run build
   ```

## 部署至 GitHub Pages

本專案配置為自動部署至 GitHub Pages。構建後的靜態檔案位於 `dist` 目錄。

---

*免責聲明：本工具僅供訓練參考，請根據個人身體狀況調整訓練強度，必要時請諮詢專業教練。*
