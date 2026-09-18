'use strict';
/**
 * earthlib.js — 依赖零外部库的地球渲染引擎
 *
 *  - PNG 编解码（仅用 Node 内置 zlib）
 *  - 等距圆柱(equirectangular)投影采样 → 5x7 位图字体
 *  - 正交(orthographic)投影渲染地球：洲界填充 + 国界 + 经纬网 + 城市点
 *
 * 手环9 画布 192x490，地球直径约 176px，所以一切追求"256 色内清晰可辨"。
 */

const zlib = require('zlib');
const fs = require('fs');

/* ============================ PNG ============================ */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Buffer} rgba  length = width*height*4
 * @param {number} level  zlib 压缩级别
 */
function encodePNG(width, height, rgba, level = 9) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type 0 (None)
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function decodePNG(buffer) {
  let pos = 8;
  let width = 0, height = 0, colorType = 6, bitDepth = 8;
  const idat = [];
  let palette = null, trns = null;
  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos);
    const type = buffer.toString('latin1', pos + 4, pos + 8);
    const data = buffer.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'PLTE') {
      palette = Buffer.from(data);
    } else if (type === 'tRNS') {
      trns = Buffer.from(data);
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(data));
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }
  if (bitDepth !== 8) throw new Error('decodePNG: only 8-bit supported, got ' + bitDepth);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error('decodePNG: unsupported color type ' + colorType);
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? line[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      switch (filter) {
        case 0: break;
        case 1: line[x] = (line[x] + a) & 0xff; break;
        case 2: line[x] = (line[x] + b) & 0xff; break;
        case 3: line[x] = (line[x] + ((a + b) >> 1)) & 0xff; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          line[x] = (line[x] + pred) & 0xff;
          break;
        }
        default: throw new Error('decodePNG: bad filter ' + filter);
      }
    }
    line.copy(out, y * stride);
    prev = line;
  }
  // 统一展开成 RGBA
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    let r, g, b, a = 255;
    if (colorType === 0) { r = g = b = out[i]; }
    else if (colorType === 2) { r = out[i * 3]; g = out[i * 3 + 1]; b = out[i * 3 + 2]; }
    else if (colorType === 3) {
      const idx = out[i];
      r = palette[idx * 3]; g = palette[idx * 3 + 1]; b = palette[idx * 3 + 2];
      if (trns && idx < trns.length) a = trns[idx];
    } else if (colorType === 4) { r = g = b = out[i * 2]; a = out[i * 2 + 1]; }
    else { r = out[i * 4]; g = out[i * 4 + 1]; b = out[i * 4 + 2]; a = out[i * 4 + 3]; }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  return { width, height, rgba };
}

/** 最近邻缩放，用于生成小幅参考图 */
function resizeNearest(src, sw, sh, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(sh - 1, Math.floor((y * sh) / dh));
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(sw - 1, Math.floor((x * sw) / dw));
      out.set(src.subarray((sy * sw + sx) * 4, (sy * sw + sx) * 4 + 4), (y * dw + x) * 4);
    }
  }
  return out;
}

/* ============================ 画布工具 ============================ */

class Canvas {
  constructor(width, height, fill = [0, 0, 0, 0]) {
    this.width = width;
    this.height = height;
    this.data = Buffer.alloc(width * height * 4);
    if (fill[3] !== 0) this.clear(fill);
  }
  clear(c) {
    for (let i = 0; i < this.width * this.height; i++) {
      this.data[i * 4] = c[0]; this.data[i * 4 + 1] = c[1];
      this.data[i * 4 + 2] = c[2]; this.data[i * 4 + 3] = c[3];
    }
  }
  /** 直接写入（不混合） */
  set(x, y, c) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const i = (y * this.width + x) * 4;
    this.data[i] = c[0]; this.data[i + 1] = c[1]; this.data[i + 2] = c[2]; this.data[i + 3] = c[3];
  }
  /** alpha 混合，a 为 0..1 额外权重 */
  blend(x, y, c, a = 1) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const i = (y * this.width + x) * 4;
    const w = a * (c[3] / 255);
    if (w <= 0) return;
    if (w >= 1) { this.data[i] = c[0]; this.data[i + 1] = c[1]; this.data[i + 2] = c[2]; this.data[i + 3] = 255; return; }
    const d = this.data;
    for (let k = 0; k < 3; k++) d[i + k] = Math.round(d[i + k] * (1 - w) + c[k] * w);
    d[i + 3] = Math.round(d[i + 3] * (1 - w) + 255 * w);
  }
  fillCircle(cx, cy, r, c) {
    const r2 = r * r;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r2) this.set(x, y, c);
      }
    }
  }
  /** 抗锯齿圆环 */
  ring(cx, cy, r, thickness, c, a = 1) {
    const outer = r + thickness / 2, inner = r - thickness / 2;
    for (let y = Math.floor(cy - outer - 1); y <= Math.ceil(cy + outer + 1); y++) {
      for (let x = Math.floor(cx - outer - 1); x <= Math.ceil(cx + outer + 1); x++) {
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const cov = Math.min(1, Math.max(0, outer - d)) * Math.min(1, Math.max(0, d - inner));
        if (cov > 0) this.blend(x, y, c, cov * a);
      }
    }
  }
  toPNG(level = 9) { return encodePNG(this.width, this.height, this.data, level); }
}

/** 在 canvas 上画线（Bresenham，带 alpha） */
function drawLine(cv, x0, y0, x1, y1, c, a = 1) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    cv.blend(x0, y0, c, a);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

/* ============================ 地理数据 ============================ */

/** 展开 GeoJSON 所有环为 [[lon,lat],...] 数组 */
function collectRings(geojson) {
  const rings = [];
  const addGeom = (geom) => {
    if (!geom) return;
    const { type, coordinates } = geom;
    if (type === 'Polygon') coordinates.forEach((r) => rings.push(r));
    else if (type === 'MultiPolygon') coordinates.forEach((p) => p.forEach((r) => rings.push(r)));
    else if (type === 'LineString') rings.push(coordinates);
    else if (type === 'MultiLineString') coordinates.forEach((r) => rings.push(r));
    else if (type === 'GeometryCollection') geom.geometries.forEach(addGeom);
  };
  for (const f of geojson.features || []) addGeom(f.geometry);
  if (!geojson.features) addGeom(geojson);
  return rings;
}

/**
 * 构建陆地查找表（等距圆柱），用于快速点查询/离线校验。
 * 不是渲染主路径，但便于调试。
 */
function buildLandMask(geojson, w = 720, h = 360) {
  const mask = new Uint8Array(w * h);
  const rings = collectRings(geojson).map((r) => [r]);
  rasterizePolygons(mask, w, h, rings, (p) => ((p[0] + 180) / 360) * w, (p) => ((90 - p[1]) / 180) * h);
  return mask;
}

/**
 * 通用扫描线多边形栅格化：polygons = [ rings[], ... ]（首环为外环）
 * px/py 接收单个顶点对象（GeoJSON 用 [lon,lat]，投影后为 {x,y}）
 */
function rasterizePolygons(mask, w, h, polygons, px, py) {
  for (const rings of polygons) {
    const edges = [];
    let minY = Infinity, maxY = -Infinity;
    for (const ring of rings) {
      const n = ring.length;
      if (n < 3) continue;
      for (let i = 0; i < n; i++) {
        const a = ring[i], b = ring[(i + 1) % n];
        if (a === undefined || b === undefined) continue;
        const x0 = px(a), y0 = py(a), x1 = px(b), y1 = py(b);
        if (y0 === y1) continue;
        edges.push([x0, y0, x1, y1]);
        minY = Math.min(minY, y0, y1);
        maxY = Math.max(maxY, y0, y1);
      }
    }
    if (!edges.length) continue;
    const yStart = Math.max(0, Math.floor(minY)), yEnd = Math.min(h - 1, Math.ceil(maxY));
    for (let y = yStart; y <= yEnd; y++) {
      const cy = y + 0.5;
      const xs = [];
      for (const [x0, y0, x1, y1] of edges) {
        if ((cy >= y0 && cy < y1) || (cy >= y1 && cy < y0)) {
          xs.push(x0 + ((cy - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      if (xs.length < 2) continue;
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const xa = Math.max(0, Math.ceil(xs[i] - 0.5)), xb = Math.min(w - 1, Math.floor(xs[i + 1] - 0.5));
        for (let x = xa; x <= xb; x++) mask[y * w + x] = 1;
      }
    }
  }
}

/* ============================ 5x7 位图字体 ============================ */

// 每个字形 7 行，每行 5 位
const FONT = {
  '0': [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  '1': [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  '2': [0x0e, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1f],
  '3': [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  '4': [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  '5': [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  '6': [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  '7': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  '8': [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  '9': [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  'A': [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'B': [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  'C': [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  'D': [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  'E': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  'F': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  'G': [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  'H': [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'I': [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  'J': [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  'K': [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  'L': [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  'M': [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  'N': [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  'O': [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'P': [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  'Q': [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  'R': [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  'S': [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  'T': [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  'U': [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'V': [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  'W': [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
  'X': [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  'Y': [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  'Z': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  '-': [0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c],
  ':': [0x00, 0x0c, 0x0c, 0x00, 0x0c, 0x0c, 0x00],
  '/': [0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

/** 画一个字形，scale 为整数放大倍数 */
function drawGlyph(cv, ch, x, y, scale, c, a = 1) {
  const g = FONT[ch.toUpperCase()] || FONT[' '];
  for (let row = 0; row < 7; row++) {
    const bits = g[row];
    for (let col = 0; col < 5; col++) {
      if (bits & (1 << (4 - col))) {
        for (let dy = 0; dy < scale; dy++)
          for (let dx = 0; dx < scale; dx++)
            cv.blend(x + col * scale + dx, y + row * scale + dy, c, a);
      }
    }
  }
}

function textWidth(str, scale) { return str.length * 6 * scale - scale; }

function drawText(cv, str, x, y, scale, c, a = 1) {
  let cx = x;
  for (const ch of str) {
    drawGlyph(cv, ch, cx, y, scale, c, a);
    cx += 6 * scale;
  }
}

/* ============================ 地球渲染 ============================ */

const DEG = Math.PI / 180;

/**
 * 正交投影反解：屏幕偏移 (dx,dy) → 球面经纬度。null 表示落在球外。
 *
 * 正变换把球面点转到"视线"坐标系：
 *   v = Ry(-lon0)·Rx(lat0)·p(lat,lon)
 * 设屏幕归一化坐标 u = dx/R, v_scr = -dy/R，则视线系中的点是
 *   (u, v_scr, z)，其中 z = sqrt(1 - u² - v_scr²)（球面约束）。
 * 逆变换即正向旋转的转置：
 *   lat = asin( v_scr·cos(lat0) + z·sin(lat0) )
 *   lon = lon0 + atan2( u, z·cos(lat0) - v_scr·sin(lat0) )
 *
 * 注意：经度必须用 atan2 反解。早先用 asin(u) 是错的 ——
 * 那会让经度随屏幕 x 产生非线性扭曲，导致圆盘左右两侧的
 * 陆海判定整体错位（往返校验会直接暴露，见 test-globe.js）。
 */
function screenToLonLat(dx, dy, R, viewLon, viewLat) {
  const u = dx / R, v = -dy / R;
  const d2 = u * u + v * v;
  if (d2 > 1) return null;
  const z = Math.sqrt(1 - d2);
  const lat0 = viewLat * DEG;
  const sinLat0 = Math.sin(lat0), cosLat0 = Math.cos(lat0);
  const y3 = v * cosLat0 + z * sinLat0;
  const z3 = z * cosLat0 - v * sinLat0;
  return {
    lat: Math.asin(Math.max(-1, Math.min(1, y3))) / DEG,
    lon: viewLon + Math.atan2(u, z3) / DEG,
    z,
  };
}

/* ---------- 球面轮廓（limb）几何 ---------- */

/**
 * 求某条经线穿过可见轮廓时的纬度（解析解）。
 * 正变换里 z2 = 0 即位于轮廓上：
 *   cos(lat)cos(lon0-lon)cos(lat0) + sin(lat)sin(lat0) = 0
 *   => tan(lat) = -cos(lon0-lon) * cos(lat0) / sin(lat0)
 */
function limbLatAt(lon, viewLon, viewLat) {
  const lo = (lon - viewLon) * DEG;
  const lat0 = viewLat * DEG;
  const sinLat0 = Math.sin(lat0), cosLat0 = Math.cos(lat0);
  if (Math.abs(sinLat0) < 1e-9) return 0; // 视角在赤道：轮廓即 0° 纬线
  return Math.atan(-Math.cos(lo) * cosLat0 / sinLat0) / DEG;
}

/** 不可见点映射到轮廓上的位置：保留其方位角（球面轮廓投影仍是圆） */
function limbPoint(lat, lonOffset, R, viewLat) {
  const la = lat * DEG, lo = lonOffset * DEG;
  const lat0 = viewLat * DEG;
  const cosLa = Math.cos(la), sinLa = Math.sin(la);
  const y1 = sinLa * Math.cos(lat0) - cosLa * Math.cos(lo) * Math.sin(lat0);
  const x2 = cosLa * Math.sin(lo);
  const len = Math.hypot(x2, y1);
  if (len < 1e-12) return null;
  const ang = Math.atan2(-y1 / len, x2 / len);
  return { x: Math.cos(ang) * R, y: Math.sin(ang) * R, ang };
}

/** 可见点 P 与不可见点 Q 的轮廓像之间，连线与轮廓圆的交点 */
function limbSegmentIntersection(p, q, R) {
  if (!p || !q) return null;
  const px = p.x, py = p.y, qx = q.x, qy = q.y;
  const dx = qx - px, dy = qy - py;
  const a = dx * dx + dy * dy;
  if (a < 1e-12) return { x: px, y: py };
  const b = 2 * (px * dx + py * dy);
  const c = px * px + py * py - R * R;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return { x: px, y: py };
  const sq = Math.sqrt(disc);
  let t = (-b + sq) / (2 * a);
  if (t < 0 || t > 1) t = (-b - sq) / (2 * a);
  if (t < 0 || t > 1) return { x: px, y: py };
  return { x: px + dx * t, y: py + dy * t };
}

/** 轮廓弧上两点之间的最短角度差（用于补弧方向） */
function limbDelta(from, to) {
  let d = to.ang - from.ang;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

/**
 * 把环细分成短边。这一步是轮廓裁剪正确性的前提：
 * 端点可见性判据只在"边足够短"时才等价于"边整体可见"。
 * 一条两端都在背面、却横穿可见半球的长边（北冰洋沿岸很常见）
 * 如果被整条丢弃，多边形会破口，扫描线填充就会越界蔓延。
 */
function densifyRing(ring, maxDeg = 2.0) {
  const n = ring.length;
  if (n < 2) return ring;
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    out.push(a);
    let dLon = b[0] - a[0];
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dLat = b[1] - a[1];
    const steps = Math.min(64, Math.max(0, Math.ceil(Math.max(Math.abs(dLon), Math.abs(dLat)) / maxDeg) - 1));
    for (let s = 1; s <= steps; s++) {
      const t = s / (steps + 1);
      out.push([a[0] + dLon * t, a[1] + dLat * t]);
    }
  }
  return out;
}

/**
 * 把经纬度投影为屏幕偏移（相对球心的像素偏移）；不可见时返回 null
 */
function projectToScreen(lat, lon, R, viewLon, viewLat) {
  const la = lat * DEG, lo = (lon - viewLon) * DEG;
  const lat0 = viewLat * DEG;
  const cosLa = Math.cos(la), sinLa = Math.sin(la);
  const sinLat0 = Math.sin(lat0), cosLat0 = Math.cos(lat0);
  // 以 viewLat 为视角纬度的旋转
  const y1 = sinLa * cosLat0 - cosLa * Math.cos(lo) * sinLat0;
  const x2 = cosLa * Math.sin(lo);
  const z2 = cosLa * Math.cos(lo) * cosLat0 + sinLa * sinLat0;
  if (z2 < 0) return null;
  return { x: x2 * R, y: -y1 * R, z: z2 };
}

/**
 * 渲染一帧地球。
 *
 * @param {object} opt
 *   size        画布边长（像素）
 *   viewLon     正对观察者的经度
 *   viewLat     视角纬度（正=北半球偏向观察者）
 *   land        多边形数组 [[ring,...],...] 已按 [lon,lat]
 *   borders     国界线段数组 [[ [lon,lat], [lon,lat] ], ...]
 *   cities      [{name, lat, lon}] 高亮点
 *   style       配色
 */
function renderEarth(opt) {
  const {
    size,
    viewLon,
    viewLat = 18,
    land = [],
    borders = [],
    cities = [],
    style = {},
  } = opt;

  const st = Object.assign({
    ocean: [10, 22, 40, 255],
    oceanEdge: [16, 34, 60, 255],
    land: [58, 196, 148, 255],
    landDark: [30, 120, 104, 255],
    border: [12, 48, 52, 200],
    graticule: [255, 255, 255, 16],
    atmosphere: [80, 190, 255, 255],
    marker: [255, 214, 96, 255],
    limb: [40, 120, 200, 90],
  }, style);

  const cv = new Canvas(size, size, [0, 0, 0, 0]);
  const R = size / 2 - 1.5;
  const cx = size / 2, cy = size / 2;

  // ---- 1. 球体底色：径向渐变模拟边缘变暗 ----
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > R) continue;
      const t = d / R;
      const shade = Math.pow(1 - t * t, 0.45); // 边缘压暗
      const c = [
        Math.round(st.ocean[0] + (st.oceanEdge[0] - st.ocean[0]) * (1 - shade) * 0.6),
        Math.round(st.ocean[1] + (st.oceanEdge[1] - st.ocean[1]) * (1 - shade) * 0.6),
        Math.round(st.ocean[2] + (st.oceanEdge[2] - st.ocean[2]) * (1 - shade) * 0.6),
        255,
      ];
      // 轻微球面高光
      const highlight = Math.max(0, 1 - Math.hypot(dx - R * 0.35, dy - R * 0.35) / (R * 1.25));
      c[0] = Math.min(255, c[0] + highlight * 14);
      c[1] = Math.min(255, c[1] + highlight * 20);
      c[2] = Math.min(255, c[2] + highlight * 30);
      cv.set(x, y, c);
    }
  }

  // ---- 2. 经纬网（先画，陆地覆盖其上更有层次） ----
  for (let lat = -60; lat <= 60; lat += 30) {
    let prev = null;
    for (let lon = -180; lon <= 180; lon += 2) {
      const p = projectToScreen(lat, lon, R, viewLon, viewLat);
      if (p && prev) drawLine(cv, cx + prev.x, cy + prev.y, cx + p.x, cy + p.y, st.graticule, 1);
      prev = p;
    }
  }
  for (let lon = -180; lon < 180; lon += 30) {
    let prev = null;
    for (let lat = -90; lat <= 90; lat += 2) {
      const p = projectToScreen(lat, lon, R, viewLon, viewLat);
      if (p && prev) drawLine(cv, cx + prev.x, cy + prev.y, cx + p.x, cy + p.y, st.graticule, 1);
      prev = p;
    }
  }

  // ---- 3. 陆地填充：严格裁剪到可见半球后再填充 ----
  //
  // 两个关键点，缺一不可：
  //  a) 绝不能让背面顶点"贴"到轮廓上。否则横跨半球边界的大多边形
  //     （欧亚大陆）会被填成一条横穿整个圆盘的长条。
  //  b) 可见性必须以"边中点的纬度"判定，且边要先细分。若只看端点，
  //     一条两端在背面、中间横穿可见半球的长边会被整条丢掉，
  //     多边形破口后扫描线填充会越界蔓延（北冰洋沿岸最典型）。
  // 因此这里用 Sutherland–Hodgman：把环裁剪到"可见半球 ∩ 圆盘"这一凸区域。
  const signAt = (lon, lat) => {
    const la = lat * DEG;
    return Math.sin(la) * Math.sin(viewLat * DEG)
      + Math.cos(la) * Math.cos((lon - viewLon) * DEG) * Math.cos(viewLat * DEG);
  };

  /** 把 (lon,lat) 投影到轮廓圆上的点（保留方位角） */
  const limbXY = (lon, lat) => {
    const lp = limbPoint(lat, lon - viewLon, R, viewLat);
    if (lp) return { x: cx + lp.x, y: cy + lp.y };
    const p = projectToScreen(lat, lon, R, viewLon, viewLat) || { x: 0, y: 0 };
    return { x: cx + p.x, y: cy + p.y };
  };

  const clipRingToLimb = (ring) => {
    const dense = densifyRing(ring, 2.0);
    const n = dense.length;
    if (n < 3) return [];
    const s = dense.map(([lon, lat]) => signAt(lon, lat));
    if (!s.some((v) => v > 0)) return [];       // 整环在背面
    if (s.every((v) => v > 0)) {                // 整环可见：直接投影
      return dense.map(([lon, lat]) => {
        const p = projectToScreen(lat, lon, R, viewLon, viewLat);
        return { x: cx + p.x, y: cy + p.y };
      });
    }
    const out = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const aVis = s[i] >= 0, bVis = s[j] >= 0;
      if (aVis && bVis) {
        const p = projectToScreen(dense[j][1], dense[j][0], R, viewLon, viewLat);
        out.push({ x: cx + p.x, y: cy + p.y });
      } else if (aVis && !bVis) {
        const t = s[i] / (s[i] - s[j]);
        const lon = dense[i][0] + (dense[j][0] - dense[i][0]) * t;
        const lat = dense[i][1] + (dense[j][1] - dense[i][1]) * t;
        out.push(limbXY(lon, lat));
      } else if (!aVis && bVis) {
        const t = s[i] / (s[i] - s[j]);
        const lon = dense[i][0] + (dense[j][0] - dense[i][0]) * t;
        const lat = dense[i][1] + (dense[j][1] - dense[i][1]) * t;
        out.push(limbXY(lon, lat));
        const p = projectToScreen(dense[j][1], dense[j][0], R, viewLon, viewLat);
        out.push({ x: cx + p.x, y: cy + p.y });
      }
      // 两个端点都不可见：整段丢弃（细分之后这就是正确的）
    }
    return out;
  };

  const projected = [];
  for (const rings of land) {
    const clipped = [];
    for (const ring of rings) {
      const c = clipRingToLimb(ring);
      if (c.length >= 3) clipped.push(c);
    }
    if (!clipped.length) continue;
    projected.push(clipped);
  }

  const mask = new Uint8Array(size * size);
  // 按 polygon 调用：外环与洞一起做偶奇填充，洞才会被正确挖空
  rasterizePolygons(mask, size, size, projected, (v) => v.x, (v) => v.y);

  // 用 shading 上色（保留球面明暗）
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!mask[y * size + x]) continue;
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const t = Math.min(1, Math.sqrt(dx * dx + dy * dy) / R);
      const shade = Math.pow(1 - t * t, 0.35);
      // 光源在左上
      const lx = (dx / R) * 0.6 - (dy / R) * 0.35;
      const light = Math.max(0, Math.min(1, 0.55 + shade * 0.6 - Math.max(0, lx) * 0.25));
      const mix = (a, b, k) => Math.round(a + (b - a) * k);
      cv.set(x, y, [
        mix(st.landDark[0], st.land[0], light),
        mix(st.landDark[1], st.land[1], light),
        mix(st.landDark[2], st.land[2], light),
        255,
      ]);
    }
  }

  // ---- 4. 国界 ----
  for (const seg of borders) {
    const a = projectToScreen(seg[0][1], seg[0][0], R, viewLon, viewLat);
    const b = projectToScreen(seg[1][1], seg[1][0], R, viewLon, viewLat);
    if (a && b) drawLine(cv, cx + a.x, cy + a.y, cx + b.x, cy + b.y, st.border, 1);
  }

  // ---- 5. 城市亮点 ----
  for (const city of cities) {
    const p = projectToScreen(city.lat, city.lon, R, viewLon, viewLat);
    if (!p || p.z < 0.08) continue;
    const fade = Math.min(1, (p.z - 0.08) / 0.35);
    const px = cx + p.x, py = cy + p.y;
    cv.blend(Math.round(px), Math.round(py), st.marker, fade);
    if (city.major) {
      cv.ring(px, py, 3.2, 1.6, st.marker, fade * 0.75);
    }
  }

  // ---- 6. 大气辉光外环 ----
  cv.ring(cx, cy, R + 0.6, 1.6, st.atmosphere, 0.5);
  cv.ring(cx, cy, R + 2.2, 1.2, st.atmosphere, 0.18);

  // ---- 7. 把圆形之外清成透明（抗锯齿边缘） ----
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = Math.hypot(dx, dy);
      const outer = R + 3.0;
      if (d <= outer) continue;
      const i = (y * size + x) * 4;
      cv.data[i] = 0; cv.data[i + 1] = 0; cv.data[i + 2] = 0; cv.data[i + 3] = 0;
    }
  }

  return cv;
}

module.exports = {
  encodePNG, decodePNG, resizeNearest, Canvas, drawLine,
  collectRings, buildLandMask, rasterizePolygons,
  drawGlyph, drawText, textWidth, FONT,
  screenToLonLat, projectToScreen, renderEarth,
};
