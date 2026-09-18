'use strict';
/**
 * 地球渲染的地理保真度审计（干净版）
 *
 * 设计要点，避免此前踩过的坑：
 *  1. 真值只用 countries110，且按 polygon 独立判定（外环命中 +1，洞 -1，非零环绕）。
 *     —— 曾经把 land110 与 countries110 混在一起全局 XOR，导致北京被算两次而抵消。
 *  2. 渲染图判定陆地只读 RGB（绿色显著高于蓝色），不碰 alpha。
 *     —— 曾经写 `cv.data[i + 3] > 0`，被解析成 `cv.data[i + (3>0)]` 读成绿色通道。
 *  3. 自带已知点自检，真值函数本身先被验证过才敢用。
 *  4. 同时报告召回率与精确率，两者都会暴露不同类别的错误。
 */
const fs = require('fs');
const path = require('path');
const L = require('./earthlib.js');

const root = path.resolve(__dirname, '..');
const countries = JSON.parse(fs.readFileSync(path.join(root, 'data/countries110.json'), 'utf8'));

const polys = [];
for (const f of countries.features) {
  const g = f.geometry;
  if (!g) continue;
  const nm = f.properties.NAME || '?';
  if (g.type === 'Polygon') polys.push({ name: nm, rings: g.coordinates });
  else if (g.type === 'MultiPolygon') g.coordinates.forEach((p, i) => polys.push({ name: nm + '#' + i, rings: p }));
}

function ringContains(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat)) {
      const xint = xi + ((lat - yi) / (yj - yi)) * (xj - xi);
      if (lon < xint) inside = !inside;
    }
  }
  return inside;
}
/**
 * 预计算陆地掩膜（等距圆柱），把真值查询从 O(多边形数) 降到 O(1)。
 * 之前逐像素遍历 288 个多边形导致审计超时，结果几乎不可用。
 */
const MASK_W = 2160, MASK_H = 1080;
const landMask = new Uint8Array(MASK_W * MASK_H);
for (let my = 0; my < MASK_H; my++) {
  const lat = 90 - (my + 0.5) * (180 / MASK_H);
  for (let mx = 0; mx < MASK_W; mx++) {
    const lon = -180 + (mx + 0.5) * (360 / MASK_W);
    if (truthIsLandRaw(lon, lat)) landMask[my * MASK_W + mx] = 1;
  }
}
function truthIsLand(lon, lat) {
  let mx = Math.floor(((lon + 180) / 360) * MASK_W);
  let my = Math.floor(((90 - lat) / 180) * MASK_H);
  mx = ((mx % MASK_W) + MASK_W) % MASK_W;
  my = Math.max(0, Math.min(MASK_H - 1, my));
  return landMask[my * MASK_W + mx] === 1;
}
// 用掩膜复检已知点（确保量化没有破坏判据）
{
  const bad2 = CASES.filter(([, lon, lat, exp]) => truthIsLand(lon, lat) !== exp);
  console.log('掩膜自检:', bad2.length === 0 ? `全部通过 (${CASES.length}/${CASES.length})` : 'FAIL ' + JSON.stringify(bad2));
  if (bad2.length) process.exit(1);
}

function truthIsLandRaw(lon, lat) {
  for (const p of polys) {
    let w = ringContains(lon, lat, p.rings[0]) ? 1 : 0;
    for (let h = 1; h < p.rings.length; h++) if (ringContains(lon, lat, p.rings[h])) w--;
    if (w > 0) return true;
  }
  return false;
}

// --- 自检：真值函数必须先通过已知点 ---
const CASES = [
  ['北京', 116.41, 39.90, true], ['伦敦', -0.13, 51.51, true], ['纽约', -74.01, 40.71, true],
  ['悉尼', 151.21, -33.87, true], ['撒哈拉', 10, 22, true], ['亚马逊', -60, -5, true],
  ['青藏高原', 88, 32, true], ['格陵兰', -42, 72, true], ['南极', 0, -80, true],
  ['太平洋', -150, 10, false], ['北大西洋', -30, 40, false], ['印度洋', 80, -30, false],
  ['北冰洋', 0, 85, false], ['地中海', 15, 36, false], ['东海', 125, 30, false],
];
const bad = CASES.filter(([, lon, lat, exp]) => truthIsLandRaw(lon, lat) !== exp);
console.log('真值自检:', bad.length === 0 ? `全部通过 (${CASES.length}/${CASES.length})` : 'FAIL ' + JSON.stringify(bad));
if (bad.length) process.exit(1);

/** 渲染图中该像素是否为陆地（只读 RGB） */
const isLandPixel = (cv, x, y) => {
  const i = (y * cv.width + x) * 4;
  return cv.data[i + 1] > 90 && cv.data[i + 1] > cv.data[i + 2] + 22;
};

function audit(size, viewLon, viewLat) {
  const cv = L.renderEarth({ size, viewLon, viewLat, land: polys.map((p) => p.rings), borders: [], cities: [] });
  const R = size / 2 - 1.5, C = size / 2;
  let truthN = 0, renderN = 0, hit = 0, over = 0, miss = 0, outside = 0;
  const overS = [], missS = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - C, dy = y + 0.5 - C;
      const d2 = (dx * dx + dy * dy) / (R * R);
      if (d2 >= 0.97) continue;             // 贴近轮廓的一圈单独统计
      const ll = L.screenToLonLat(dx, dy, R, viewLon, viewLat);
      if (!ll) continue;
      const t = truthIsLand(ll.lon, ll.lat);
      const p = isLandPixel(cv, x, y);
      if (t) truthN++;
      if (p) renderN++;
      if (t && p) hit++;
      else if (!t && p) { over++; if (overS.length < 6) overS.push([+ll.lon.toFixed(1), +ll.lat.toFixed(1)]); }
      else if (t && !p) { miss++; if (missS.length < 6) missS.push([+ll.lon.toFixed(1), +ll.lat.toFixed(1)]); }
    }
  }
  // 轮廓附近单独算：只关心"多画"（越界）
  let rimOver = 0, rimTotal = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - C, dy = y + 0.5 - C;
      const d2 = (dx * dx + dy * dy) / (R * R);
      if (d2 < 0.97 || d2 >= 1) continue;
      const ll = L.screenToLonLat(dx, dy, R, viewLon, viewLat);
      if (!ll) continue;
      rimTotal++;
      if (!truthIsLand(ll.lon, ll.lat) && isLandPixel(cv, x, y)) rimOver++;
    }
  }
  const recall = hit / Math.max(1, truthN) * 100;
  const precision = hit / Math.max(1, hit + over) * 100;
  console.log(`size=${size} viewLon=${String(viewLon).padStart(4)} viewLat=${viewLat}: ` +
    `真值陆地=${truthN} 渲染陆地=${renderN} 命中=${hit} 多画=${over} 漏画=${miss} ` +
    `召回=${recall.toFixed(1)}% 精确=${precision.toFixed(1)}% | 轮廓圈(${rimTotal}px)越界=${rimOver}`);
  if (over) console.log('    多画样例:', JSON.stringify(overS));
  if (miss) console.log('    漏画样例:', JSON.stringify(missS));
  return { recall, precision };
}

let worstRecall = 100, worstPrecision = 100;
for (const viewLat of [0, 18, 30]) {
  for (const viewLon of [0, 116, -74, 151, -47]) {
    const r = audit(320, viewLon, viewLat);
    worstRecall = Math.min(worstRecall, r.recall);
    worstPrecision = Math.min(worstPrecision, r.precision);
  }
}
console.log(`\n最差召回=${worstRecall.toFixed(1)}%  最差精确=${worstPrecision.toFixed(1)}%`);
console.log(worstRecall > 97 && worstPrecision > 97 ? '=> PASS' : '=> 需要继续修复');
