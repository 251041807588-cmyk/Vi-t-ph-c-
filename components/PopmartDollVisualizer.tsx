'use client';

import React, { useState } from 'react';
import { WardrobeItem } from '@/data/historical-data';
import {
  Sparkles,
  Layers,
  Eye,
  Maximize2,
  Moon,
  Sun,
  ShieldCheck,
  ShieldAlert,
  Palette,
  Camera,
} from 'lucide-react';

interface PopmartDollVisualizerProps {
  selectedItems: WardrobeItem[];
  onToggleItem?: (item: WardrobeItem) => void;
  onClearAll?: () => void;
  guardrailStatus?: {
    isAppropriate: boolean | null;
    warning: string | null;
  } | null;
  onOpenRecognition?: () => void;
}

export function PopmartDollVisualizer({
  selectedItems,
  onToggleItem,
  guardrailStatus,
  onOpenRecognition,
}: PopmartDollVisualizerProps) {
  // Ratio state: 3:4 (Desktop stage) or 9:16 (Mobile-first story)
  const [viewportRatio, setViewportRatio] = useState<'3:4' | '9:16'>('3:4');
  // Angle view: 3/4 pose (collector default), front, zoom-portrait
  const [viewAngle, setViewAngle] = useState<'three-quarter' | 'front' | 'portrait'>('three-quarter');
  // Atmosphere: 'night-snow' | 'morning-mist'
  const [atmosphere, setAtmosphere] = useState<'night-snow' | 'morning-mist'>('night-snow');

  // Categorize active worn items
  const hair = selectedItems.find((i) => i.category === 'hair');
  const outer = selectedItems.find((i) => i.category === 'outerwear');
  const inner = selectedItems.find((i) => i.category === 'innerwear');
  const bottom = selectedItems.find((i) => i.category === 'bottom');
  const footwear = selectedItems.find((i) => i.category === 'footwear');
  const motif = selectedItems.find((i) => i.category === 'motif');
  const accessories = selectedItems.filter((i) => i.category === 'accessories');

  // Check if Pink Silk Ao Dai signature is worn
  const isPinkAoDai = selectedItems.some((i) => i.id === 'ao-dai-pink-silk');
  const hasCrownHair = selectedItems.some((i) => i.id === 'toc-tet-vuong-mien');
  const isTabooDragon5 = selectedItems.some((i) => i.id === 'dragon-5-claws');

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* TOP CONTROLS & HUD BAR */}
      <div className="w-full max-w-[420px] mb-2 px-2 flex items-center justify-between text-xs text-stone-200 z-30">
        {/* Ratio & Angle Toggles */}
        <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-700/60 shadow-md">
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            Popmart 1:2.8
          </span>
          <span className="text-stone-600">|</span>
          <button
            onClick={() => setViewportRatio((r) => (r === '3:4' ? '9:16' : '3:4'))}
            className="text-[10px] font-medium text-stone-300 hover:text-white px-1.5 py-0.5 rounded bg-stone-800/80 transition-all cursor-pointer"
            title="Đổi tỷ lệ khung nhìn (3:4 Desktop / 9:16 Mobile)"
          >
            {viewportRatio === '3:4' ? '📐 3:4 Stage' : '📱 9:16 Feed'}
          </button>
        </div>

        {/* View Angle and Atmosphere Toggle */}
        <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-stone-700/60 shadow-md">
          <button
            onClick={() =>
              setViewAngle((a) =>
                a === 'three-quarter' ? 'front' : a === 'front' ? 'portrait' : 'three-quarter'
              )
            }
            className="text-[10px] font-medium text-amber-200 hover:text-amber-100 px-1.5 py-0.5 rounded transition-all cursor-pointer"
            title="Xoay góc nhìn (Góc 3/4 Popmart / Chính diện / Cận cảnh)"
          >
            {viewAngle === 'three-quarter' ? '🔄 Góc 3/4' : viewAngle === 'front' ? '🔄 Chính diện' : '🔍 Cận cảnh'}
          </button>
          <button
            onClick={() => setAtmosphere((a) => (a === 'night-snow' ? 'morning-mist' : 'night-snow'))}
            className="text-stone-300 hover:text-amber-300 p-1 rounded transition-all cursor-pointer"
            title="Đổi thời gian bối cảnh (Đêm lồng đèn tuyết / Sương mai)"
          >
            {atmosphere === 'night-snow' ? <Moon className="w-3 h-3 text-amber-300" /> : <Sun className="w-3 h-3 text-amber-400" />}
          </button>
          {onOpenRecognition && (
            <button
              onClick={onOpenRecognition}
              className="ml-1 px-2 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:scale-105 transition-all"
              title="Nhận diện hình ảnh phối đồ qua AI Scanner"
            >
              <Camera className="w-3 h-3" />
              <span className="hidden sm:inline">Quét ảnh</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEWPORT CONTAINER WITH PRECISE RATIO */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 border-stone-700/50 shadow-2xl transition-all duration-500 ${
          viewportRatio === '3:4'
            ? 'w-[320px] sm:w-[380px] h-[440px] sm:h-[506px]'
            : 'w-[290px] sm:w-[330px] h-[515px] sm:h-[586px]'
        }`}
      >
        {/* ============================================================== */}
        {/* LỚP 1: HẬU CẢNH (BACKGROUND) - BẦU TRỜI KHÓI LAM & HẠT BỤI ÁNH SÁNG */}
        {/* ============================================================== */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            atmosphere === 'night-snow'
              ? 'bg-gradient-to-b from-[#18233C] via-[#1F2C46] to-[#0F172A]'
              : 'bg-gradient-to-b from-[#3E4F65] via-[#4A5D75] to-[#253245]'
          }`}
        >
          {/* Atmospheric fog gradient */}
          <div className="absolute inset-0 bg-radial from-rose-900/15 via-transparent to-stone-950/80 pointer-events-none" />

          {/* Dusted light particles & floating petals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Drifting Petals */}
            <div className="absolute top-10 left-12 w-2 h-3.5 bg-rose-300/60 rounded-full rotate-45 blur-[0.5px] animate-pulse" />
            <div className="absolute top-28 right-16 w-1.5 h-2.5 bg-rose-200/50 rounded-full -rotate-12" />
            <div className="absolute top-48 left-24 w-2 h-3 bg-pink-300/40 rounded-full rotate-12" />
            <div className="absolute top-72 right-12 w-2.5 h-4 bg-rose-200/40 rounded-full rotate-45" />

            {/* Ambient Bokeh Golden Dust */}
            <div className="absolute top-20 left-1/3 w-1.5 h-1.5 bg-amber-200/70 rounded-full blur-[0.5px] animate-ping" />
            <div className="absolute top-36 right-1/4 w-1 h-1 bg-amber-300/80 rounded-full" />
            <div className="absolute top-60 left-16 w-2 h-2 bg-amber-100/50 rounded-full blur-[1px]" />
            <div className="absolute top-80 right-20 w-1.5 h-1.5 bg-amber-200/60 rounded-full" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* LỚP 2: TRUNG CẢNH (MIDGROUND) - CỔNG NGUYỆT MÔN & ĐÌNH LẦU LỒNG ĐÈN */}
        {/* ============================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cổng vòm Nguyệt Môn tròn bằng đá cổ xám tro */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[260px] sm:w-[290px] h-[260px] sm:h-[290px] rounded-full border-[18px] sm:border-[22px] border-[#5E6877]/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-[1px] opacity-90">
            {/* Vân đá cổ xám tro */}
            <div className="absolute inset-0 rounded-full border border-stone-400/20" />
          </div>

          {/* Mái đình cổ lầu ngói cong phía trên */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[280px] sm:w-[320px] h-10 border-t-4 border-[#8B3A3A] rounded-t-full opacity-70" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[340px] flex justify-between px-6">
            {/* Đao đình uốn cong */}
            <div className="w-6 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr-lg -rotate-12" />
            <div className="w-6 h-3 border-t-2 border-l-2 border-amber-600 rounded-tl-lg rotate-12" />
          </div>

          {/* Đôi Lồng Đèn Đỏ Cung Đình Tỏa Ánh Sáng Ấm Cúng */}
          {/* Lồng đèn trái */}
          <div className="absolute top-8 left-8 flex flex-col items-center animate-bounce duration-1000">
            <div className="w-0.5 h-6 bg-amber-600/70" />
            <div className="w-8 h-10 rounded-full bg-gradient-to-b from-red-600 via-rose-600 to-amber-700 shadow-[0_0_18px_rgba(239,68,68,0.8)] border border-amber-400/40 relative">
              {/* Vành vàng lồng đèn */}
              <div className="absolute top-1 inset-x-1 h-0.5 bg-amber-300" />
              <div className="absolute bottom-1 inset-x-1 h-0.5 bg-amber-300" />
            </div>
            {/* Tua rua lụa đỏ */}
            <div className="w-1.5 h-6 bg-red-700 rounded-b" />
          </div>

          {/* Lồng đèn phải */}
          <div className="absolute top-8 right-8 flex flex-col items-center animate-bounce duration-1000 delay-300">
            <div className="w-0.5 h-6 bg-amber-600/70" />
            <div className="w-8 h-10 rounded-full bg-gradient-to-b from-red-600 via-rose-600 to-amber-700 shadow-[0_0_18px_rgba(239,68,68,0.8)] border border-amber-400/40 relative">
              <div className="absolute top-1 inset-x-1 h-0.5 bg-amber-300" />
              <div className="absolute bottom-1 inset-x-1 h-0.5 bg-amber-300" />
            </div>
            <div className="w-1.5 h-6 bg-red-700 rounded-b" />
          </div>

          {/* Nền gạch phủ sương tuyết nhẹ & Sương mù sàn */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent">
            {/* Hàng gạch lát cổ */}
            <div className="absolute bottom-4 inset-x-4 h-6 border-t border-stone-600/40 flex justify-around">
              <div className="w-px h-full bg-stone-700/30" />
              <div className="w-px h-full bg-stone-700/30" />
              <div className="w-px h-full bg-stone-700/30" />
              <div className="w-px h-full bg-stone-700/30" />
            </div>
            {/* Sương tuyết mềm */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-cyan-100/15 via-rose-100/10 to-transparent blur-md" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* NHÂN VẬT 3D CHIBI POPMART BLIND-BOX (TỶ LỆ 1:2.8 & ÁO DÀI LỤA HỒNG) */}
        {/* ============================================================== */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 z-10 ${
            viewAngle === 'portrait' ? 'scale-135 translate-y-24' : 'scale-100'
          }`}
        >
          {/* Popmart 3D Chibi SVG Model */}
          <svg
            className="w-[280px] sm:w-[330px] h-[400px] sm:h-[460px] filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            viewBox="0 0 320 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subsurface Scattering Skin Gradients */}
              <radialGradient id="popmartSkin" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#FFF7F2" />
                <stop offset="65%" stopColor="#FDEAE1" />
                <stop offset="100%" stopColor="#F7D7CA" />
              </radialGradient>

              {/* Plump Peach Bao-Bun Cheek Blush */}
              <radialGradient id="peachCheek" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF8F94" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#FFA6A9" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFA6A9" stopOpacity="0" />
              </radialGradient>

              {/* Glassy Reflective Cornea (Mắt Ngọc Thủy Tinh) */}
              <radialGradient id="glassEye" cx="45%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#3E2723" />
                <stop offset="60%" stopColor="#2D150B" />
                <stop offset="100%" stopColor="#0F0805" />
              </radialGradient>

              {/* Silk Draping Gradient for Ao Dai (Lụa Tơ Tằm Hồng Phấn) */}
              <linearGradient id="pinkSilkDrape" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FED7E2" />
                <stop offset="40%" stopColor="#FBB6CE" />
                <stop offset="75%" stopColor="#F687B3" />
                <stop offset="100%" stopColor="#ED64A6" />
              </linearGradient>

              {/* Gold Embroidery Thread Gradient */}
              <linearGradient id="goldThread" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Vinyl Collectible Sheen Highlight */}
              <linearGradient id="vinylSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Tóc sau buông nhẹ (Back Flowing Hair) */}
            <path
              d={
                viewAngle === 'three-quarter'
                  ? 'M120 120 C90 160 85 240 105 290 C112 250 120 190 135 150 Z'
                  : 'M120 120 C85 160 85 240 100 290 C110 250 120 190 135 150 Z'
              }
              fill={hair?.color || '#3D2817'}
            />
            <path
              d={
                viewAngle === 'three-quarter'
                  ? 'M195 120 C225 160 220 240 205 290 C198 250 190 190 180 150 Z'
                  : 'M200 120 C235 160 235 240 220 290 C210 250 200 190 185 150 Z'
              }
              fill={hair?.color || '#3D2817'}
            />

            {/* ĐÔI CHÂN CHIBI POPOART & QUẦN LỤA TRẮNG (Anatomy 1:2.8) */}
            {/* Quần lụa trắng buông rủ ống suông */}
            <g>
              {/* Quần trái */}
              <path
                d="M136 290 L126 395 L148 400 L154 290 Z"
                fill={bottom?.color || '#FFFFFF'}
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />
              {/* Quần phải (3/4 góc đứng nhẹ) */}
              <path
                d="M166 290 L172 395 L194 398 L184 290 Z"
                fill={bottom?.color || '#FFFFFF'}
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />
              {/* Nếp gấp lụa quần */}
              <path d="M136 310 L134 380" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
              <path d="M182 310 L184 380" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* ĐÔI HÀI THÊU LỤA HỒNG MŨI CONG */}
            <g>
              {/* Hài trái */}
              <path
                d="M124 395 C124 395 120 405 130 408 C144 408 148 400 148 398 Z"
                fill={footwear?.color || '#F4A7B9'}
                stroke="#DB2777"
                strokeWidth="1"
              />
              <circle cx="128" cy="404" r="1.5" fill="#FDE68A" />
              {/* Hài phải (hơi chếch góc 3/4) */}
              <path
                d="M172 396 C172 396 170 406 182 408 C194 408 196 400 194 396 Z"
                fill={footwear?.color || '#F4A7B9'}
                stroke="#DB2777"
                strokeWidth="1"
              />
              <circle cx="178" cy="404" r="1.5" fill="#FDE68A" />
            </g>

            {/* TÀ ÁO DÀI SAU (Back Silk Flap - Khoe chiều sâu tà áo trước-sau) */}
            <path
              d={
                viewAngle === 'three-quarter'
                  ? 'M142 220 C130 270 120 330 114 380 C130 384 175 382 192 376 C182 320 178 260 174 220 Z'
                  : 'M140 220 C130 270 122 330 118 380 C140 384 180 384 202 380 C198 330 190 270 180 220 Z'
              }
              fill="url(#pinkSilkDrape)"
              opacity="0.8"
            />

            {/* THÂN NGƯỜI CHIBI & TÀ ÁO DÀI TRƯỚC (Front Ao Dai Silk Flap) */}
            {/* Tà trước áo dài lụa rủ mềm tự nhiên */}
            <path
              d={
                viewAngle === 'three-quarter'
                  ? 'M140 180 C136 210 134 260 130 365 C146 370 178 368 186 362 C184 260 182 210 178 180 Z'
                  : 'M140 180 C136 210 134 260 130 365 C145 370 175 370 190 365 C186 260 184 210 180 180 Z'
              }
              fill="url(#pinkSilkDrape)"
              stroke="#F472B6"
              strokeWidth="0.8"
            />

            {/* Nẹp cổ áo dài truyền thống (Cổ thuyền / cổ trụ 2cm e ấp) */}
            <path
              d="M148 168 C154 172 166 172 172 168 L170 184 C164 186 156 186 150 184 Z"
              fill="#F472B6"
              stroke="#BE185D"
              strokeWidth="0.8"
            />
            {/* Hàng khuy bấm ngọc trai chéo nách */}
            <circle cx="166" cy="176" r="1.5" fill="#FFFFFF" />
            <circle cx="170" cy="184" r="1.5" fill="#FFFFFF" />
            <circle cx="174" cy="194" r="1.5" fill="#FFFFFF" />

            {/* GẤM THÊU NỔI KIM CHỈ: HOA SEN & HOA CÚC TRÊN NGỰC ÁO */}
            <g transform="translate(152, 196) scale(0.65)">
              {/* Bông sen kim chỉ dát vàng */}
              <path
                d="M12 0 C16 6 18 14 12 20 C6 14 8 6 12 0 Z"
                fill="url(#goldThread)"
              />
              <path
                d="M6 6 C12 10 14 18 6 20 C2 16 2 10 6 6 Z"
                fill="url(#goldThread)"
                opacity="0.85"
              />
              <path
                d="M18 6 C12 10 10 18 18 20 C22 16 22 10 18 6 Z"
                fill="url(#goldThread)"
                opacity="0.85"
              />
              {/* Dây cúc uốn lượn */}
              <path
                d="M2 18 Q12 26 22 18"
                stroke="url(#goldThread)"
                strokeWidth="1.5"
                fill="none"
              />
            </g>

            {/* HAI CÁNH TAY & TAY ÁO DÀI RỦ MỀM */}
            {/* Tay trái */}
            <path
              d="M144 178 C124 195 118 225 120 250 L130 250 C128 228 134 202 150 188 Z"
              fill="url(#pinkSilkDrape)"
            />
            {/* Bàn tay trái nhỏ nhắn đặt trước ngực */}
            <circle cx="126" cy="252" r="5" fill="url(#popmartSkin)" />

            {/* Tay phải (Cầm quạt nan / nón ba tầm phía trước) */}
            <path
              d="M176 178 C192 195 196 225 190 250 L180 250 C184 228 180 202 168 188 Z"
              fill="url(#pinkSilkDrape)"
            />
            {/* Bàn tay phải */}
            <circle cx="186" cy="252" r="5" fill="url(#popmartSkin)" />

            {/* CHIẾC QUẠT NAN LỤA THÊU SEN CÚNG ĐÌNH (Phụ kiện tôn dáng tà áo) */}
            <g transform="translate(138, 235) rotate(-15)">
              {/* Nan quạt hình bán nguyệt xòe duyên dáng */}
              <path
                d="M10 25 L-6 0 C8 -8 24 -8 38 0 L22 25 Z"
                fill="#FFF1F2"
                stroke="#F472B6"
                strokeWidth="0.8"
              />
              {/* Thêu hoa sen trên mặt quạt */}
              <circle cx="16" cy="5" r="4" fill="#F43F5E" opacity="0.6" />
              {/* Cán quạt gỗ sơn mài & tua rua đỏ */}
              <line x1="16" y1="20" x2="16" y2="35" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="35" r="2" fill="#E11D48" />
              <line x1="16" y1="36" x2="16" y2="44" stroke="#BE123C" strokeWidth="1.5" />
            </g>

            {/* ĐẦU BÚP BÊ POPMART: CHUẨN TỶ LỆ 1:2.8 (Collect Art Toy Head) */}
            {/* Cổ tròn ngắn xinh */}
            <path d="M154 148 L154 168 L166 168 L166 148 Z" fill="url(#popmartSkin)" />

            {/* Khuôn mặt tròn trịa, bầu bĩnh má bánh bao (Subsurface Scattering) */}
            <ellipse cx="160" cy="115" rx="42" ry="40" fill="url(#popmartSkin)" />

            {/* Má bánh bao bầu bĩnh với hiệu ứng phấn má đào tán mịn (Subsurface Scattering) */}
            <circle cx="136" cy="126" r="14" fill="url(#peachCheek)" />
            <circle cx="184" cy="126" r="14" fill="url(#peachCheek)" />

            {/* ĐÔI MẮT BỒ CÂU TO TRÒN LONG LANH HAI TRÒNG PHẢN QUANG THỦY TINH (Reflective Cornea) */}
            {/* Mắt trái */}
            <g>
              <ellipse cx="140" cy="114" rx="8.5" ry="11" fill="url(#glassEye)" />
              {/* Vòng sáng hổ phách dưới tròng đen */}
              <ellipse cx="140" cy="118" rx="6.5" ry="5.5" fill="#8D4925" opacity="0.8" />
              {/* Phản quang thủy tinh 1 (Đốm sáng to chính) */}
              <ellipse cx="138" cy="109" rx="3.5" ry="4.5" fill="#FFFFFF" />
              {/* Phản quang thủy tinh 2 (Đốm sáng phụ tạo chiều sâu 3D) */}
              <circle cx="143" cy="120" r="1.8" fill="#FFFFFF" opacity="0.9" />
              {/* Lông mi tơ mềm mại */}
              <path d="M132 107 Q140 102 148 107" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <line x1="148" y1="106" x2="152" y2="104" stroke="#3E2723" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* Mắt phải */}
            <g>
              <ellipse cx="180" cy="114" rx="8.5" ry="11" fill="url(#glassEye)" />
              <ellipse cx="180" cy="118" rx="6.5" ry="5.5" fill="#8D4925" opacity="0.8" />
              <ellipse cx="178" cy="109" rx="3.5" ry="4.5" fill="#FFFFFF" />
              <circle cx="183" cy="120" r="1.8" fill="#FFFFFF" opacity="0.9" />
              <path d="M172 107 Q180 102 188 107" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <line x1="188" y1="106" x2="192" y2="104" stroke="#3E2723" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* Mũi nhỏ xíu chúm chím */}
            <path d="M159 122 Q160 124 161 122" stroke="#E29578" strokeWidth="1" strokeLinecap="round" />

            {/* Môi son nụ e ấp, biểu cảm trong sáng thanh tú nét đẹp thiếu nữ Việt */}
            <path
              d="M155 133 C157 131 163 131 165 133 C163 137 157 137 155 133 Z"
              fill="#E11D48"
            />
            {/* Đốm bóng nước trên môi */}
            <circle cx="160" cy="133.5" r="1" fill="#FFFFFF" opacity="0.8" />

            {/* TÓC TẾT VƯƠNG MIỆN ĐÍNH NGỌC TRAI (Crown Braided Hair) */}
            <g>
              {/* Mái tóc mái bằng uốn nhẹ phồng Chibi */}
              <path
                d="M120 105 C122 75 198 75 200 105 C185 92 170 90 160 90 C150 90 135 92 120 105 Z"
                fill={hair?.color || '#3D2817'}
              />
              {/* Vành tóc tết vương miện cung đình */}
              <path
                d="M118 92 C125 68 195 68 202 92 C190 78 130 78 118 92 Z"
                fill="#543720"
                stroke="#6B4627"
                strokeWidth="1.5"
              />
              {/* Hạt ngọc trai đính trên vành tóc tết */}
              <circle cx="132" cy="79" r="2.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
              <circle cx="146" cy="74" r="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
              <circle cx="160" cy="72" r="3.5" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="0.8" />
              <circle cx="174" cy="74" r="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
              <circle cx="188" cy="79" r="2.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
            </g>

            {/* Vinyl Toy Material Highlight Curve */}
            <path
              d="M130 85 C145 78 175 78 190 85"
              stroke="url(#vinylSheen)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ============================================================== */}
        {/* LỚP 3: TIỀN CẢNH (FOREGROUND) - CÀNH ĐÀO PHAI TUYẾT PHỦ ĐUNG ĐƯA */}
        {/* ============================================================== */}
        {/* Cành đào tuyết ở góc trên bên trái tạo chiều sâu thị giác (Depth of Field Blur) */}
        <div className="absolute -top-3 -left-4 w-44 h-36 pointer-events-none z-20 filter blur-[0.6px] transition-transform duration-1000 animate-pulse">
          <svg viewBox="0 0 160 140" fill="none" className="w-full h-full opacity-95">
            {/* Nhánh cành cây gỗ rêu phong */}
            <path
              d="M-10 10 Q30 20 60 50 Q85 75 110 70"
              stroke="#543D2B"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M40 32 Q65 15 85 20"
              stroke="#543D2B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Lớp tuyết trắng phủ trên cành đào */}
            <path
              d="M-10 7 Q30 17 60 47"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Những bông hoa đào phai hồng phấn nở rộ */}
            {/* Bông 1 */}
            <g transform="translate(60, 48)">
              <circle cx="-5" cy="0" r="5" fill="#F472B6" opacity="0.9" />
              <circle cx="5" cy="0" r="5" fill="#F472B6" opacity="0.9" />
              <circle cx="0" cy="-5" r="5" fill="#FBCFE8" opacity="0.9" />
              <circle cx="0" cy="5" r="5" fill="#F472B6" opacity="0.9" />
              <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
            </g>
            {/* Bông 2 */}
            <g transform="translate(85, 20)">
              <circle cx="-4" cy="0" r="4.5" fill="#FBCFE8" />
              <circle cx="4" cy="0" r="4.5" fill="#F472B6" />
              <circle cx="0" cy="-4" r="4.5" fill="#F472B6" />
              <circle cx="0" cy="4" r="4.5" fill="#FBCFE8" />
              <circle cx="0" cy="0" r="2" fill="#F59E0B" />
            </g>
            {/* Bông 3 ở ngọn cành */}
            <g transform="translate(108, 68)">
              <circle cx="-4" cy="0" r="4" fill="#F472B6" />
              <circle cx="4" cy="0" r="4" fill="#FBCFE8" />
              <circle cx="0" cy="-4" r="4" fill="#F472B6" />
              <circle cx="0" cy="4" r="4" fill="#FBCFE8" />
              <circle cx="0" cy="0" r="1.8" fill="#FDE68A" />
            </g>
          </svg>
        </div>

        {/* BOTTOM HUD STAMP: POPMART ART TOY VERIFICATION */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-bold text-rose-200">Búp Bê Áo Dài Lụa Hồng</span>
            <span className="text-stone-400">· 1:2.8</span>
          </div>

          {/* Quick Cultural Guardrail Pill */}
          <div
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md border shadow-md flex items-center gap-1 ${
              guardrailStatus?.isAppropriate === false
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300'
                : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
            }`}
          >
            {guardrailStatus?.isAppropriate === false ? (
              <>
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Chưa Hợp Chuẩn</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>5★ Thuần Phong Mỹ Tục</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
