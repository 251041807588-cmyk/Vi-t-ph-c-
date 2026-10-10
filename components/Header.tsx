'use client';

import React from 'react';
import { Sparkles, BookOpen, Shirt, ShieldCheck, MessageSquare, Boxes, Camera } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'matrix' | 'about';
  setActiveTab: (tab: 'studio' | 'matrix' | 'about') => void;
  onOpenChat: () => void;
  onOpenBlueprint?: () => void;
  onOpenRecognition?: () => void;
}

export function Header({ activeTab, setActiveTab, onOpenChat, onOpenBlueprint, onOpenRecognition }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#991B1B] text-amber-100 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            Á
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 leading-none">
              Áo Xưa Nay
            </span>
            <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium mt-0.5">
              Việt Phục & Hàng Rào Văn Hóa Gen Z
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'studio'
                ? 'text-[#991B1B] font-semibold border-b-2 border-[#991B1B]'
                : 'hover:text-stone-900'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Studio Phối Đồ</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'matrix'
                ? 'text-[#991B1B] font-semibold border-b-2 border-[#991B1B]'
                : 'hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ma Trận 4 Thời Kỳ</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'about'
                ? 'text-[#991B1B] font-semibold border-b-2 border-[#991B1B]'
                : 'hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Quy Chuẩn Văn Hóa</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenRecognition && (
            <button
              onClick={onOpenRecognition}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-2xs"
              title="Chuyên gia Nhận diện Hình ảnh Phối đồ qua AI"
            >
              <Camera className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Nhận Diện Ảnh Phối Đồ</span>
              <span className="sm:hidden">Quét Ảnh</span>
            </button>
          )}

          {onOpenBlueprint && (
            <button
              onClick={onOpenBlueprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all whitespace-nowrap active:scale-95"
              title="Xem Tài liệu Đặc tả Giao diện UI/UX Blueprint"
            >
              <Boxes className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Bản Thiết Kế UI/UX</span>
              <span className="sm:hidden">Blueprint</span>
            </button>
          )}

          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-sm transition-all whitespace-nowrap hover:shadow active:scale-95"
            title="Mở trợ lý AI Stylist với High Thinking Mode"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hỏi AI Stylist</span>
          </button>
        </div>
      </div>
    </header>
  );
}
