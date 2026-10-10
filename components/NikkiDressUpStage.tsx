'use client';

import React, { useState } from 'react';
import {
  HISTORICAL_ERAS,
  WARDROBE_CATALOG,
  PRESET_OUTFITS,
  HistoricalEra,
  WardrobeItem,
} from '@/data/historical-data';
import {
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Search,
  RotateCcw,
  BookOpen,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Palette,
  AlertTriangle,
  Camera,
} from 'lucide-react';
import { PopmartDollVisualizer } from '@/components/PopmartDollVisualizer';

interface NikkiDressUpStageProps {
  currentEra: HistoricalEra;
  selectedItems: WardrobeItem[];
  onToggleItem: (item: WardrobeItem) => void;
  onClearAll: () => void;
  onApplyPreset: (presetId: string) => void;
  onApplyStationSuggestion: () => void;
  onBackToTimeline: () => void;
  onOpenEvaluation: () => void;
  onOpenChat: () => void;
  eventContext: string;
  onChangeEventContext: (ctx: string) => void;
  isAnalyzing: boolean;
  guardrailStatus: {
    isAppropriate: boolean | null;
    warning: string | null;
  } | null;
  onCompleteOutfit?: () => void;
  isOutfitCompleted?: boolean;
  onOpenCollectorCard?: () => void;
  onOpenRecognition?: () => void;
  onChangeEra?: (era: HistoricalEra) => void;
}

type NikkiCategory =
  | 'toc' // Tóc
  | 'dam' // Đầm / Áo dài
  | 'ao' // Áo
  | 'quan' // Quần
  | 'khoac' // Áo khoác ngoài
  | 'vo' // Vớ / Tất
  | 'giay' // Giày / Hài
  | 'tsuc' // Trang sức & Họa tiết
  | 'mat' // Mặt / Biểu cảm Popmart
  | 'nen' // Nền / Bối cảnh
  | 'bo'; // Bộ trang phục mẫu

const EVENT_PRESETS = [
  'Dạo phố cuối tuần',
  'Dạ tiệc trang trọng',
  'Đi học thường nhật',
  'Lễ hội truyền thống',
  'Lễ chùa / Chốn tôn nghiêm',
  'Trình diễn nghệ thuật',
];

export function NikkiDressUpStage({
  currentEra,
  selectedItems,
  onToggleItem,
  onClearAll,
  onApplyPreset,
  onApplyStationSuggestion,
  onBackToTimeline,
  onOpenEvaluation,
  onOpenChat,
  eventContext,
  onChangeEventContext,
  isAnalyzing,
  guardrailStatus,
  onCompleteOutfit,
  isOutfitCompleted = false,
  onOpenCollectorCard,
  onOpenRecognition,
  onChangeEra,
}: NikkiDressUpStageProps) {
  // Model view: 'popmart-chibi' (3D Popmart Doll) or 'classic' (Mannequin 2D)
  const [dollModelView, setDollModelView] = useState<'popmart-chibi' | 'classic'>('popmart-chibi');
  // Category tray state
  const [activeCategory, setActiveCategory] = useState<NikkiCategory | null>(null);
  const [isTopContextOpen, setIsTopContextOpen] = useState(true);
  const [isSuggestionPopupOpen, setIsSuggestionPopupOpen] = useState(true);
  const [bgTheme, setBgTheme] = useState<'snow-pagoda' | 'palace' | 'street'>('snow-pagoda');

  // Categorize active worn items
  const hair = selectedItems.find((i) => i.category === 'hair');
  const outer = selectedItems.find((i) => i.category === 'outerwear');
  const inner = selectedItems.find((i) => i.category === 'innerwear');
  const bottom = selectedItems.find((i) => i.category === 'bottom');
  const footwear = selectedItems.find((i) => i.category === 'footwear');
  const motif = selectedItems.find((i) => i.category === 'motif');
  const accessories = selectedItems.filter((i) => i.category === 'accessories');

  // Check if item is selected
  const isSelected = (itemId: string) => selectedItems.some((i) => i.id === itemId);

  // Map Nikki category to WardrobeItem categories
  const getCategoryItems = (cat: NikkiCategory): WardrobeItem[] => {
    switch (cat) {
      case 'toc':
        return WARDROBE_CATALOG.filter((i) => i.category === 'hair');
      case 'dam':
        return WARDROBE_CATALOG.filter(
          (i) => i.id.includes('ao-dai') || i.id.includes('nhat-binh') || i.id.includes('dam')
        );
      case 'ao':
        return WARDROBE_CATALOG.filter((i) => i.category === 'innerwear');
      case 'quan':
        return WARDROBE_CATALOG.filter((i) => i.category === 'bottom');
      case 'khoac':
        return WARDROBE_CATALOG.filter((i) => i.category === 'outerwear');
      case 'vo':
        return WARDROBE_CATALOG.filter((i) => i.category === 'socks');
      case 'giay':
        return WARDROBE_CATALOG.filter((i) => i.category === 'footwear');
      case 'tsuc':
        return WARDROBE_CATALOG.filter(
          (i) => i.category === 'accessories' || i.category === 'motif'
        );
      case 'mat':
        return WARDROBE_CATALOG.filter((i) => i.category === 'face');
      case 'nen':
        return WARDROBE_CATALOG.filter((i) => i.category === 'background');
      default:
        return [];
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-[#1e293b] select-none min-h-[740px] sm:min-h-[800px] flex flex-col justify-between">
      {/* 1. KHÔNG GIAN BỐI CẢNH (HÌNH ẢNH SÂN CHÙA MÙA ĐÔNG / HOÀNG THÀNH TRONG ẢNH) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Background gradient sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#18233C] via-[#2F4468] to-[#9AB3CA]" />

        {/* Cổng vòm cổ kính & Mái chùa có đèn lồng (Moon Gate & Ancient Pagoda) */}
        <div className="absolute inset-0 opacity-80">
          {/* Cổng vòm lớn bo tròn góc trên như trong ảnh */}
          <div className="absolute -top-12 -left-12 w-[420px] h-[520px] rounded-full border-[28px] border-[#5E6877]/80 bg-transparent shadow-2xl" />

          {/* Mái đình cổ lầu đèn lồng đỏ bên trái */}
          <div className="absolute top-28 left-0 w-44 h-48 border-r-2 border-[#1E293B]/40">
            {/* Đèn lồng đỏ treo */}
            <div className="absolute top-16 left-12 w-4 h-6 rounded-full bg-red-600 shadow-[0_0_12px_#EF4444]" />
            <div className="absolute top-24 left-20 w-3 h-5 rounded-full bg-red-600 shadow-[0_0_10px_#EF4444]" />
          </div>

          {/* Cành đào/mai đỏ tuyết phủ góc trên bên trái */}
          <svg
            className="absolute top-0 left-0 w-80 h-72 text-red-500/90 pointer-events-none"
            viewBox="0 0 320 280"
            fill="none"
          >
            <path
              d="M0 20 Q120 40 200 90 T260 180"
              stroke="#3E2723"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M120 40 Q160 10 220 30"
              stroke="#3E2723"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Hoa đỏ điểm tuyết trắng */}
            <circle cx="90" cy="30" r="5" fill="#EF4444" />
            <circle cx="140" cy="50" r="6" fill="#EF4444" />
            <circle cx="170" cy="20" r="4" fill="#EF4444" />
            <circle cx="210" cy="30" r="6" fill="#EF4444" />
            <circle cx="180" cy="80" r="6" fill="#EF4444" />
            <circle cx="220" cy="110" r="5" fill="#EF4444" />
            <circle cx="240" cy="150" r="6" fill="#EF4444" />
            {/* Đốm tuyết trắng */}
            <circle cx="92" cy="28" r="2" fill="#FFFFFF" />
            <circle cx="142" cy="48" r="2.5" fill="#FFFFFF" />
            <circle cx="212" cy="28" r="2" fill="#FFFFFF" />
          </svg>

          {/* Cầu đá & Nền tuyết trắng phủ sân gạch */}
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#EDF2F7] via-[#DDE5ED] to-transparent" />
          <div className="absolute bottom-28 left-1/4 w-72 h-16 rounded-full bg-[#CBD5E1]/60 blur-md" />
        </div>

        {/* Bông tuyết / Hoa rơi lãng mạn */}
        <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px] opacity-40 animate-pulse pointer-events-none" />
      </div>

      {/* 2. TOP HEADER: NÚT QUAY LẠI HỒNG & BỐI CẢNH Ở TRÊN MODEL (VÙNG CAM TRONG ẢNH) */}
      <div className="relative z-20 p-3 sm:p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          {/* Nút quay lại tròn màu hồng có viền trắng (Y hệt góc trên bên trái trong ảnh) */}
          <button
            onClick={onBackToTimeline}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FF758F] hover:bg-[#FF4D6D] border-2 border-white shadow-md flex items-center justify-center text-white active:scale-95 transition-all shrink-0"
            title="Quay lại bản đồ các trạm"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* VÙNG CAM TRÊN MODEL: BỐI CẢNH CỦA MỐC THỜI KÌ HIỆN LÊN Ở TRÊN MODEL */}
          <div className="flex-1 max-w-lg bg-white/95 backdrop-blur-md border border-amber-900/25 rounded-2xl p-2.5 sm:p-3 shadow-md">
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-stone-200/60">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-[#991B1B] text-white font-bold text-[10px] flex items-center justify-center font-serif shrink-0">
                  {currentEra.stationNumber}
                </span>

                {onChangeEra ? (
                  <select
                    value={currentEra.id}
                    onChange={(e) => {
                      const matched = HISTORICAL_ERAS.find((era) => era.id === e.target.value);
                      if (matched) onChangeEra(matched);
                    }}
                    className="text-xs sm:text-sm font-bold text-stone-900 font-serif-editorial bg-transparent border-b border-dashed border-stone-400 focus:outline-none cursor-pointer pr-1"
                    title="Đổi mốc thời kỳ lịch sử"
                  >
                    {HISTORICAL_ERAS.map((era) => (
                      <option key={era.id} value={era.id}>
                        Trạm {era.stationNumber}: {era.name} ({era.period})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-stone-900 font-serif-editorial">
                    {currentEra.stationTitle}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Chọn bối cảnh sự kiện */}
                <select
                  value={eventContext}
                  onChange={(e) => onChangeEventContext(e.target.value)}
                  className="text-[11px] font-semibold bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 text-stone-800 focus:outline-none"
                >
                  {EVENT_PRESETS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsTopContextOpen(!isTopContextOpen)}
                  className="p-1 rounded-md text-stone-500 hover:text-stone-800 transition-colors"
                  title="Mở rộng / Thu gọn 3 trụ cột lịch sử"
                >
                  {isTopContextOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 3 Trụ cột lịch sử thu gọn/mở rộng trực tiếp trên model */}
            {isTopContextOpen ? (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] leading-tight">
                <div className="bg-rose-50/70 p-1.5 rounded-lg border border-rose-200/50">
                  <span className="font-bold text-rose-900 block mb-0.5">
                    1. Ý chí dân tộc:
                  </span>
                  <span className="text-stone-700 line-clamp-2">
                    {currentEra.politicalWill}
                  </span>
                </div>
                <div className="bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    2. Giao thoa văn hóa:
                  </span>
                  <span className="text-stone-700 line-clamp-2">
                    {currentEra.culturalExchange}
                  </span>
                </div>
                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200/50">
                  <span className="font-bold text-emerald-900 block mb-0.5">
                    3. Kinh tế & Lối sống:
                  </span>
                  <span className="text-stone-700 line-clamp-2">
                    {currentEra.economicAndLifestyle}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-stone-600 italic pt-1 truncate">
                &ldquo;{currentEra.tagline}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. KHU VỰC CHÍNH Ở GIỮA: MODEL NGƯỜI MẪU NIKKI + BÊN TRÁI POPUP + BÊN PHẢI TỦ ĐỒ */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-3 sm:px-6">
        {/* BÊN TRÁI MODEL: POP-UP GỢI Ý PHỐI ĐỒ (VÙNG CAM BÊN TRÁI DƯỚI TRONG ẢNH) */}
        <div className="w-60 sm:w-68 flex flex-col justify-end space-y-3 shrink-0 self-end mb-4">
          {isSuggestionPopupOpen ? (
            <div className="bg-white/95 backdrop-blur-md border-2 border-rose-200/80 rounded-2xl p-3 sm:p-3.5 shadow-xl relative animate-in fade-in duration-200">
              {/* Header pop-up */}
              <div className="flex items-center justify-between pb-1.5 border-b border-rose-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-rose-950 font-serif-editorial">
                    Stylist Gợi Ý Phối Đồ
                  </span>
                </div>
                <button
                  onClick={() => setIsSuggestionPopupOpen(false)}
                  className="text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tên gợi ý & Công thức */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-rose-900 text-[11px] sm:text-xs">
                  {currentEra.stylingSuggestion.title}
                </div>

                <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 text-[11px] font-medium text-stone-800 leading-relaxed">
                  <span className="font-bold text-[#991B1B] block text-[10px] uppercase">
                    Công thức:
                  </span>
                  {currentEra.stylingSuggestion.formula}
                </div>

                {/* Cảnh báo văn hóa */}
                <div className="bg-red-50 p-2 rounded-xl border border-red-200/60 text-[10px] text-red-900 leading-tight">
                  <span className="font-bold flex items-center gap-1 mb-0.5 text-red-800">
                    <ShieldAlert className="w-3 h-3" />
                    Lưu ý cấm kỵ:
                  </span>
                  {currentEra.stylingSuggestion.culturalNotice}
                </div>
              </div>

              {/* Nút mở tủ đồ tự chọn theo gợi ý */}
              <button
                onClick={() => {
                  // Mở danh mục áo khoác ngoài hoặc áo dài để người chơi tự chọn từng món
                  setActiveCategory('khoac');
                }}
                className="w-full mt-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#991B1B] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#BE123C] text-white font-bold text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🔍 Tự chọn từng món theo gợi ý</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSuggestionPopupOpen(true)}
              className="self-start flex items-center gap-1.5 bg-white/90 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-bold text-rose-800 shadow-md hover:bg-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Mở Gợi ý phối đồ</span>
            </button>
          )}

          {/* NÚT "SẴN SÀNG / HOÀN TẤT PHỐI ĐỒ" HÌNH BẦU DỤC VIỀN BẠC 3D (GÓC DƯỚI BÊN TRÁI Y HỆT TRONG ẢNH) */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if (onCompleteOutfit) {
                  onCompleteOutfit();
                } else {
                  onOpenEvaluation();
                }
                onOpenCollectorCard?.();
              }}
              className={`w-32 sm:w-36 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-[0_4px_0_#94A3B8] border-2 border-white transition-all active:translate-y-1 active:shadow-[0_1px_0_#94A3B8] flex items-center justify-center gap-1.5 cursor-pointer ${
                guardrailStatus?.isAppropriate === false
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-white'
                  : isOutfitCompleted
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_0_#059669]'
                  : 'bg-gradient-to-b from-[#E2E8F0] via-[#F8FAFC] to-[#CBD5E1] text-stone-700 hover:text-stone-900'
              }`}
              title="Nhấn để hoàn tất phối đồ, kiểm tra văn hóa & tạo Thẻ Sưu Tập Di Sản Popmart 3D"
            >
              {isAnalyzing ? (
                <span className="animate-spin text-amber-600">●</span>
              ) : guardrailStatus?.isAppropriate === false ? (
                <AlertTriangle className="w-4 h-4 text-white" />
              ) : isOutfitCompleted ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span>{isOutfitCompleted ? 'Đã phối xong' : 'Sẵn sàng'}</span>
            </button>

            {/* Nút xem Thẻ Sưu Tập Di Sản khi đã phối xong */}
            {isOutfitCompleted && onOpenCollectorCard && (
              <button
                onClick={onOpenCollectorCard}
                className="w-32 sm:w-36 py-1.5 px-2 rounded-full font-bold text-[11px] bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 hover:from-amber-300 hover:to-rose-300 text-stone-900 border-2 border-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-in fade-in"
                title="Mở Thẻ Sưu Tập Di Sản Blind-Box 3D"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Thẻ Sưu Tập 3D</span>
              </button>
            )}
          </div>
        </div>

        {/* Ở GIỮA: MODEL NGƯỜI MẪU BÚP BÊ POPMART 3D CHIBI ÁO DÀI LỤA HỒNG */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[540px] sm:min-h-[620px]">
          {/* Top Style Badge & Controls */}
          <div className="mb-2 z-20 flex flex-wrap items-center justify-center gap-1.5 animate-in fade-in duration-300">
            {/* View Mode Toggle: Popmart 3D vs Mannequin */}
            <div className="flex items-center bg-stone-900/80 backdrop-blur-md p-0.5 rounded-full border border-stone-700/80 shadow-md">
              <button
                onClick={() => setDollModelView('popmart-chibi')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  dollModelView === 'popmart-chibi'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                ✨ Búp Bê Popmart 3D
              </button>
              <button
                onClick={() => setDollModelView('classic')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  dollModelView === 'classic'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                👗 Mannequin Tương Tác
              </button>
            </div>

            {/* AI Image Recognition Scanner Button */}
            {onOpenRecognition && (
              <button
                onClick={onOpenRecognition}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                title="Nhận diện & Chèn hình ảnh phối đồ vào UI"
              >
                <Camera className="w-3 h-3 text-amber-200" />
                <span>📷 Quét ảnh phối đồ</span>
              </button>
            )}

            {/* Quick Wear Pink Silk Preset */}
            <button
              onClick={() => {
                const pinkItems = WARDROBE_CATALOG.filter((i) =>
                  [
                    'toc-tet-vuong-mien',
                    'ao-dai-pink-silk',
                    'vo-lua-theu-hoa',
                    'hai-theu-lua-hong',
                    'lotus-chrysanthemum',
                  ].includes(i.id)
                );
                onClearAll();
                pinkItems.forEach((it) => onToggleItem(it));
              }}
              className="px-2.5 py-1 rounded-full bg-stone-900/70 hover:bg-stone-800 text-rose-200 border border-rose-400/50 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              title="Mặc trọn bộ Búp Bê Áo Dài Lụa Hồng truyền thống"
            >
              <span>🌸 Mặc bộ chuẩn</span>
            </button>
          </div>

          {dollModelView === 'popmart-chibi' ? (
            <PopmartDollVisualizer
              selectedItems={selectedItems}
              onToggleItem={onToggleItem}
              onClearAll={onClearAll}
              guardrailStatus={guardrailStatus}
              onOpenRecognition={onOpenRecognition}
            />
          ) : (
            /* SVG Character Model with Natural Miracle Nikki & Popmart 3D Chibi Silhouette */
            <div className="relative w-[280px] sm:w-[320px] h-full flex items-center justify-center">
            {/* MANNEQUIN / NIKKI SVG BASE */}
            <svg
              className="w-full h-full filter drop-shadow-xl"
              viewBox="0 0 320 620"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Tóc sau (Back hair flowing pink) */}
              <path
                d="M130 110 C80 150 70 260 90 320 C100 280 110 200 135 150 Z"
                fill={hair?.color || '#F4A7B9'}
                opacity="0.95"
              />
              <path
                d="M190 110 C240 150 250 260 230 320 C220 280 210 200 185 150 Z"
                fill={hair?.color || '#F4A7B9'}
                opacity="0.95"
              />

              {/* Body Skin / Cơ thể người mẫu (Nikki standing pose) */}
              {/* Chân & Bàn chân (Long slender legs) */}
              {/* Chân trái */}
              <path
                d="M142 340 L140 460 L146 560 L140 590 L130 595 L148 595 L156 570 L158 460 L156 340 Z"
                fill="#FDEDE3"
              />
              {/* Chân phải (hơi nhấc gót như trong ảnh) */}
              <path
                d="M164 340 L166 450 L174 540 L178 575 L170 585 L186 585 L188 560 L180 450 L176 340 Z"
                fill="#FEE6D8"
              />

              {/* Thân người (Torso & Waist) */}
              <path
                d="M136 170 C130 200 132 260 136 340 L184 340 C188 260 190 200 184 170 Z"
                fill="#FEECE1"
              />

              {/* Tay trái */}
              <path
                d="M136 170 C110 210 90 270 94 315 L104 315 C102 270 120 210 144 175 Z"
                fill="#FEECE1"
              />
              {/* Bàn tay trái */}
              <circle cx="98" cy="320" r="5" fill="#FEECE1" />

              {/* Tay phải */}
              <path
                d="M184 170 C210 210 230 270 226 315 L216 315 C218 270 200 210 176 175 Z"
                fill="#FEECE1"
              />
              {/* Bàn tay phải */}
              <circle cx="222" cy="320" r="5" fill="#FEECE1" />

              {/* Cổ & Mặt */}
              <path d="M152 140 L152 165 L168 165 L168 140 Z" fill="#FEE6D8" />
              <ellipse cx="160" cy="115" rx="22" ry="26" fill="#FFF2EB" />

              {/* Chi tiết khuôn mặt anime Nikki (Mắt to long lanh, má hồng, miệng chúm chím) */}
              {/* Má hồng */}
              <circle cx="146" cy="122" r="4.5" fill="#FFAAA6" opacity="0.45" />
              <circle cx="174" cy="122" r="4.5" fill="#FFAAA6" opacity="0.45" />
              {/* Mắt trái */}
              <ellipse cx="148" cy="114" rx="3.5" ry="5" fill="#5A3825" />
              <circle cx="147" cy="112" r="1.5" fill="#FFFFFF" />
              {/* Mắt phải */}
              <ellipse cx="172" cy="114" rx="3.5" ry="5" fill="#5A3825" />
              <circle cx="171" cy="112" r="1.5" fill="#FFFFFF" />
              {/* Miệng cười xinh xắn */}
              <path
                d="M158 126 Q160 129 162 126"
                stroke="#E57373"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* LỚP 1: TRANG PHỤC MẶC ĐỊNH HOẶC ĐỒ TRONG (T-Shirt Nikki như trong ảnh hoặc Áo yếm) */}
              {inner ? (
                inner.id === 'ao-yem-silk' ? (
                  /* Áo yếm lụa truyền thống */
                  <g>
                    <path
                      d="M144 165 L176 165 L182 250 L160 270 L138 250 Z"
                      fill={inner.color || '#C0392B'}
                    />
                    <path
                      d="M150 150 L160 165 L170 150"
                      stroke="#852015"
                      strokeWidth="2"
                    />
                  </g>
                ) : (
                  /* Áo thun trắng Miracle Nikki như trong ảnh gốc */
                  <g>
                    <path
                      d="M134 168 L186 168 L194 300 L126 300 Z"
                      fill="#FFFFFF"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                    />
                    {/* Tay áo ngắn */}
                    <path d="M134 168 L114 200 L130 205 L140 175 Z" fill="#FFFFFF" />
                    <path d="M186 168 L206 200 L190 205 L180 175 Z" fill="#FFFFFF" />
                    {/* Vương miện in trên áo thun (Y hệt ảnh Miracle Nikki) */}
                    <path
                      d="M152 205 L155 195 L160 202 L165 195 L168 205 Z"
                      fill="#1E293B"
                    />
                    <circle cx="160" cy="215" r="8" fill="#1E293B" opacity="0.1" />
                  </g>
                )
              ) : (
                /* Áo thun trắng Miracle Nikki mặc định */
                <g>
                  <path
                    d="M134 168 L186 168 L194 300 L126 300 Z"
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <path d="M134 168 L114 200 L130 205 L140 175 Z" fill="#FFFFFF" />
                  <path d="M186 168 L206 200 L190 205 L180 175 Z" fill="#FFFFFF" />
                  {/* Vương miện in chữ Miracle */}
                  <path
                    d="M152 205 L155 195 L160 202 L165 195 L168 205 Z"
                    fill="#0F172A"
                  />
                  <text
                    x="160"
                    y="190"
                    fontSize="7"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#0F172A"
                  >
                    MIRACLE
                  </text>
                </g>
              )}

              {/* LỚP 2: QUẦN / VÁY */}
              {bottom && (
                <g>
                  {bottom.id.includes('pants') || bottom.id.includes('jeans') ? (
                    /* Quần ống rộng / Jeans */
                    <path
                      d="M132 290 L188 290 L194 540 L166 540 L160 360 L154 540 L126 540 Z"
                      fill={bottom.color || '#334155'}
                      opacity="0.95"
                    />
                  ) : (
                    /* Váy quây / Chân váy */
                    <path
                      d="M134 290 L186 290 L204 460 L116 460 Z"
                      fill={bottom.color || '#475569'}
                      opacity="0.95"
                    />
                  )}
                </g>
              )}

              {/* LỚP 3: ÁO KHOÁC NGOÀI (ÁO GIAO LĨNH / NGŨ THÂN / NHẬT BÌNH) */}
              {outer && (
                <g>
                  {outer.id.includes('giao-linh') ? (
                    /* Áo Giao Lĩnh cổ chéo khoác ngoài */
                    <g>
                      <path
                        d="M128 165 L192 165 L204 440 L116 440 Z"
                        fill={outer.color || '#8B1E1E'}
                        opacity="0.9"
                      />
                      {/* Vạt cổ chéo vắt sang phải */}
                      <path
                        d="M140 165 L175 250 L195 440 L185 440 L165 250 L130 165 Z"
                        fill="#F3F0E6"
                        opacity="0.8"
                      />
                      {/* Tay áo rộng buông rủ */}
                      <path
                        d="M128 168 L92 270 L108 280 L136 190 Z"
                        fill={outer.color || '#8B1E1E'}
                      />
                      <path
                        d="M192 168 L228 270 L212 280 L184 190 Z"
                        fill={outer.color || '#8B1E1E'}
                      />
                    </g>
                  ) : outer.id.includes('nhat-binh') ? (
                    /* Áo Nhật Bình viền ngũ sắc */
                    <g>
                      <path
                        d="M128 165 L192 165 L202 450 L118 450 Z"
                        fill={outer.color || '#0E4D48'}
                        opacity="0.92"
                      />
                      {/* Cổ áo đối khâm viền ngũ sắc hình chữ nhật trước ngực */}
                      <rect
                        x="152"
                        y="165"
                        width="16"
                        height="180"
                        fill="#F59E0B"
                        stroke="#BE123C"
                        strokeWidth="2"
                      />
                    </g>
                  ) : outer.id.includes('pink-silk') || outer.id.includes('ao-dai') ? (
                    /* Áo Dài Lụa Hồng Popmart Chibi với tà rủ mềm mại tự nhiên & thêu hoa sen vàng */
                    <g>
                      {/* Tà sau lụa hồng */}
                      <path
                        d="M126 165 L194 165 L206 500 C175 515 145 515 114 500 Z"
                        fill="#F472B6"
                        opacity="0.85"
                      />
                      {/* Tà trước lụa hồng mềm mại rủ nhẹ */}
                      <path
                        d="M130 165 C122 230 120 340 122 495 C150 510 170 510 198 495 C200 340 198 230 190 165 Z"
                        fill={outer.color || '#FB7185'}
                      />
                      {/* Nếp gấp rủ tơ tằm tự nhiên */}
                      <path
                        d="M142 180 Q136 320 140 485"
                        stroke="#FDA4AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.75"
                      />
                      <path
                        d="M178 180 Q184 320 180 485"
                        stroke="#FDA4AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.75"
                      />
                      <path
                        d="M160 185 Q159 340 160 488"
                        stroke="#FFE4E6"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.85"
                      />

                      {/* Họa tiết thêu sen vàng & mây lành trước ngực */}
                      <circle cx="160" cy="240" r="11" fill="#FBBF24" opacity="0.9" />
                      <path
                        d="M154 236 Q160 225 166 236 Q160 248 154 236 Z"
                        fill="#F59E0B"
                      />
                      <circle cx="160" cy="237" r="3.5" fill="#BE185D" />
                      {/* Mây lành viền vàng */}
                      <path
                        d="M144 252 Q152 247 160 252 T176 252"
                        stroke="#FDE047"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      {/* Hoa văn sen chân tà */}
                      <circle cx="160" cy="430" r="9" fill="#FBBF24" opacity="0.85" />
                      <circle cx="160" cy="430" r="4.5" fill="#F43F5E" />

                      {/* Tay áo tơ tằm buông rủ */}
                      <path
                        d="M130 168 L96 270 L112 278 L142 195 Z"
                        fill={outer.color || '#FB7185'}
                      />
                      <path
                        d="M190 168 L224 270 L208 278 L178 195 Z"
                        fill={outer.color || '#FB7185'}
                      />
                      {/* Cổ áo cao truyền thống & khuy ngọc */}
                      <path d="M148 148 L172 148 L170 168 L150 168 Z" fill="#E11D48" />
                      <circle cx="164" cy="158" r="2" fill="#FEF08A" />
                    </g>
                  ) : (
                    /* Áo khoác / Ngũ thân mặc định */
                    <g>
                      <path
                        d="M128 165 L192 165 L198 480 L122 480 Z"
                        fill={outer.color || '#3B82F6'}
                        opacity="0.88"
                      />
                    </g>
                  )}
                </g>
              )}

              {/* LỚP 4: GIÀY / GUỐC */}
              {footwear && (
                <g>
                  <path
                    d="M130 585 L148 585 L152 596 L128 596 Z"
                    fill={footwear.color || '#E11D48'}
                  />
                  <path
                    d="M170 580 L188 580 L190 592 L168 592 Z"
                    fill={footwear.color || '#E11D48'}
                  />
                </g>
              )}

              {/* LỚP 5: TÓC TRƯỚC & KHĂN VẤN / MŨ */}
              {hair?.id === 'khan-van-nhung' ? (
                /* Khăn vấn nhung đen nhiều nếp */
                <g>
                  <ellipse cx="160" cy="94" rx="28" ry="14" fill="#18181B" />
                  <ellipse cx="160" cy="92" rx="24" ry="10" fill="#27272A" />
                  {/* Tóc mái rẽ ngôi thanh tú */}
                  <path
                    d="M138 106 Q150 96 160 106 Q170 96 182 106 C176 96 144 96 138 106 Z"
                    fill="#18181B"
                  />
                </g>
              ) : hair?.id === 'toc-tet-vuong-mien' ? (
                /* Vành tóc tết vương miện Popmart cài hoa ngọc sen hồng & trâm ngọc trai */
                <g>
                  {/* Tóc mái rẽ thanh nhã ôm má bánh bao */}
                  <path
                    d="M132 104 C144 90 176 90 188 104 C180 120 170 124 160 110 C150 124 140 120 132 104 Z"
                    fill="#3E2723"
                  />
                  {/* Lọn tóc mai ôm má hồng */}
                  <path
                    d="M134 104 C128 126 132 170 138 195 C136 160 140 125 138 106 Z"
                    fill="#3E2723"
                  />
                  <path
                    d="M186 104 C192 126 188 170 182 195 C184 160 180 125 182 106 Z"
                    fill="#3E2723"
                  />
                  {/* Vành tết vương miện trên đầu */}
                  <path
                    d="M136 94 Q160 82 184 94"
                    stroke="#5D4037"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M138 94 Q160 84 182 94"
                    stroke="#8D6E63"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="3,3"
                    fill="none"
                  />
                  {/* Hoa sen ngọc & trâm ngọc trai cài tóc */}
                  <circle cx="144" cy="90" r="4.5" fill="#F472B6" />
                  <circle cx="144" cy="90" r="2" fill="#FEF08A" />
                  <circle cx="176" cy="90" r="4.5" fill="#F472B6" />
                  <circle cx="176" cy="90" r="2" fill="#FEF08A" />
                  <circle cx="160" cy="85" r="3" fill="#FFFFFF" />
                </g>
              ) : (
                /* Tóc mái hồng buông rủ dài như trong ảnh */
                <g>
                  <path
                    d="M134 105 C145 92 175 92 186 105 C180 120 170 125 160 110 C150 125 140 120 134 105 Z"
                    fill={hair?.color || '#F4A7B9'}
                  />
                  {/* Lọn tóc mai hai bên ôm lấy má */}
                  <path
                    d="M136 105 C130 130 134 180 140 210 C138 170 142 130 140 108 Z"
                    fill={hair?.color || '#F4A7B9'}
                  />
                  <path
                    d="M184 105 C190 130 186 180 180 210 C182 170 178 130 180 108 Z"
                    fill={hair?.color || '#F4A7B9'}
                  />
                </g>
              )}

              {/* LỚP 6: HOA VĂN THÊU NỔI (RỒNG 5 MÓNG HOẶC SEN CÚC DÂY) */}
              {motif && (
                <g opacity="0.95">
                  {motif.id === 'dragon-5-claws' ? (
                    /* Rồng 5 móng hoàng gia vàng rực */
                    <g>
                      <circle cx="160" cy="240" r="16" fill="#F59E0B" opacity="0.85" />
                      <path
                        d="M152 235 Q160 225 168 235 Q164 245 156 248 Z"
                        fill="#B45309"
                      />
                      <circle cx="156" cy="232" r="1.5" fill="#DC2626" />
                    </g>
                  ) : (
                    /* Hoa sen & cúc dây thanh tao */
                    <g>
                      <circle cx="160" cy="240" r="14" fill="#FDE047" opacity="0.7" />
                      <circle cx="160" cy="240" r="7" fill="#F43F5E" opacity="0.8" />
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>
          )}
        </div>

        {/* BÊN PHẢI CẠNH MODEL: THANH CỘT DANH MỤC TỦ ĐỒ (Y HỆT THANH BÊN PHẢI TRONG ẢNH) */}
        <div className="flex items-start gap-2 shrink-0 z-20">
          {/* Menu Drawer mở ra khi click vào danh mục */}
          {activeCategory && (
            <div className="w-56 sm:w-64 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-stone-200 shadow-2xl p-3 animate-in fade-in slide-in-from-right-4 duration-200 max-h-[560px] flex flex-col justify-between">
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold uppercase text-stone-800">
                  {activeCategory === 'toc'
                    ? 'Tóc & Mấn'
                    : activeCategory === 'dam'
                    ? 'Đầm & Áo dài'
                    : activeCategory === 'ao'
                    ? 'Áo trong & Yếm'
                    : activeCategory === 'quan'
                    ? 'Quần & Váy'
                    : activeCategory === 'khoac'
                    ? 'Áo khoác ngoài'
                    : activeCategory === 'vo'
                    ? 'Vớ & Tất chân'
                    : activeCategory === 'giay'
                    ? 'Giày & Hài thêu'
                    : activeCategory === 'tsuc'
                    ? 'Trang sức & Hoa văn'
                    : activeCategory === 'mat'
                    ? 'Mặt & Biểu cảm (Popmart)'
                    : activeCategory === 'nen'
                    ? 'Nền & Bối cảnh di sản'
                    : 'Bộ trang phục mẫu'}
                </span>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="overflow-y-auto space-y-2 py-2 pr-1 flex-1">
                {activeCategory === 'bo' ? (
                  /* Presets */
                  PRESET_OUTFITS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => {
                        onApplyPreset(preset.id);
                        setActiveCategory(null);
                      }}
                      className="p-2 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 cursor-pointer transition-all text-xs"
                    >
                      <div className="font-bold text-stone-900">{preset.name}</div>
                      <div className="text-[10px] text-stone-500 line-clamp-1">
                        {preset.styleName} · {preset.eventContext}
                      </div>
                    </div>
                  ))
                ) : (
                  /* Wardrobe items for this category */
                  getCategoryItems(activeCategory).map((item) => {
                    const worn = isSelected(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.category === 'background') {
                            if (item.id === 'nen-hoang-thanh-hue') setBgTheme('palace');
                            else if (item.id === 'nen-pho-co-hoi-an') setBgTheme('street');
                            else setBgTheme('snow-pagoda');
                          }
                          onToggleItem(item);
                        }}
                        className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          worn
                            ? 'bg-rose-50 border-rose-500 shadow-xs'
                            : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-stone-900 block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-stone-500 block truncate">
                              {item.styleTag}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {currentEra.stylingSuggestion.presetItemIds.includes(item.id) && (
                            <span
                              className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1 py-0.5 rounded-sm"
                              title="Món đồ thuộc công thức gợi ý của trạm này"
                            >
                              ⭐ Gợi ý
                            </span>
                          )}
                          {item.isTabooForStreetwear && (
                            <span
                              className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold"
                              title="Họa tiết cấm kỵ"
                            >
                              !
                            </span>
                          )}
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              worn
                                ? 'bg-rose-600 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {worn ? '✓' : '+'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* CỘT NÚT VIÊN THUỐC TRÒN BO GÓC DỌC (GIỐNG 100% ẢNH MINH HỌA) */}
          {/* Cột các nút tròn danh mục (10 Danh mục chuẩn + tiện ích) */}
          <div className="flex flex-col items-center gap-1.5 py-1 px-1 bg-stone-900/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-h-[620px] overflow-y-auto">
            {/* 1. Tóc */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'toc' ? null : 'toc')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'toc'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">💇‍♀️</span>
              <span className="text-[9px] font-bold text-stone-800">Tóc</span>
            </button>

            {/* 2. Đầm */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'dam' ? null : 'dam')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'dam'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">👗</span>
              <span className="text-[9px] font-bold text-stone-800">Đầm</span>
            </button>

            {/* 3. Áo */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'ao' ? null : 'ao')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'ao'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">👚</span>
              <span className="text-[9px] font-bold text-stone-800">Áo</span>
            </button>

            {/* 4. Quần */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'quan' ? null : 'quan')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'quan'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">👖</span>
              <span className="text-[9px] font-bold text-stone-800">Quần</span>
            </button>

            {/* 5. Khoác */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'khoac' ? null : 'khoac')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'khoac'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">🧥</span>
              <span className="text-[9px] font-bold text-stone-800">Khoác</span>
            </button>

            {/* 6. Vớ */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'vo' ? null : 'vo')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'vo'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">🧦</span>
              <span className="text-[9px] font-bold text-stone-800">Vớ</span>
            </button>

            {/* 7. Giày */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'giay' ? null : 'giay')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'giay'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">👠</span>
              <span className="text-[9px] font-bold text-stone-800">Giày</span>
            </button>

            {/* 8. Trang sức */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'tsuc' ? null : 'tsuc')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'tsuc'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">👑</span>
              <span className="text-[9px] font-bold text-stone-800">T.sức</span>
            </button>

            {/* 9. Mặt / Biểu cảm (Popmart) */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'mat' ? null : 'mat')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'mat'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">😊</span>
              <span className="text-[9px] font-bold text-stone-800">Mặt</span>
            </button>

            {/* 10. Nền */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'nen' ? null : 'nen')
              }
              className={`relative w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-white/95 border-2 flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                activeCategory === 'nen'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : 'border-stone-200'
              }`}
            >
              <span className="text-base leading-none">🏞️</span>
              <span className="text-[9px] font-bold text-stone-800">Nền</span>
            </button>

            {/* Tiện ích: Bộ trang phục mẫu */}
            <button
              onClick={() =>
                setActiveCategory(activeCategory === 'bo' ? null : 'bo')
              }
              className="w-10 h-9 rounded-lg bg-white/80 border border-stone-200 flex flex-col items-center justify-center hover:bg-white shadow-xs"
              title="Bộ trang phục mẫu"
            >
              <span className="text-[10px]">👘</span>
              <span className="text-[8px] font-bold text-stone-600">Bộ</span>
            </button>

            {/* Nút Xóa / Cởi đồ */}
            <button
              onClick={onClearAll}
              className="w-10 h-9 rounded-lg bg-white/80 border border-stone-200 flex flex-col items-center justify-center hover:bg-white shadow-xs"
              title="Cởi toàn bộ đồ về mặc định"
            >
              <span className="text-[10px]">🗑️</span>
              <span className="text-[8px] font-bold text-stone-600">Xóa</span>
            </button>

            {/* Nút Chat AI Stylist */}
            <button
              onClick={onOpenChat}
              className="w-10 h-9 rounded-lg bg-amber-50 border border-amber-300 flex flex-col items-center justify-center hover:bg-amber-100 shadow-xs"
              title="Hỏi AI Stylist"
            >
              <Bot className="w-3 h-3 text-amber-700" />
              <span className="text-[8px] font-bold text-amber-800">AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
