'use client';

import React, { useState } from 'react';
import {
  Compass,
  Layers,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Palette,
  Eye,
  Shirt,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { HistoricalEra, HISTORICAL_ERAS } from '@/data/historical-data';

interface MainUseCasesSectionProps {
  onSelectScenarioPreset?: (preset: {
    eventContext: string;
    eraId: string;
    styleName: string;
    itemsHint: string[];
  }) => void;
  onNavigateToStudio?: () => void;
}

export function MainUseCasesSection({
  onSelectScenarioPreset,
  onNavigateToStudio,
}: MainUseCasesSectionProps) {
  // Tab active giữa 3 tình huống sử dụng chính
  const [activeScenario, setActiveScenario] = useState<1 | 2 | 3>(1);

  // State cho Tình huống 1: Sự kiện / Địa phương
  const [selectedEvent, setSelectedEvent] = useState<'le-chua' | 'hoi-thao' | 'dao-pho'>('le-chua');

  // State cho Tình huống 2: Khám phá & Mix & Match
  const [selectedInner, setSelectedInner] = useState<'ao-yem' | 'ao-tanktop' | 'ao-canh'>('ao-yem');
  const [selectedOuter, setSelectedOuter] = useState<'giao-linh' | 'ngu-than' | 'nhat-binh'>('giao-linh');
  const [selectedBottom, setSelectedBottom] = useState<'quan-lua' | 'quan-short' | 'chan-vay'>('quan-lua');
  const [colorTone, setColorTone] = useState<'cung-dinh' | 'hien-dai' | 'pastel'>('cung-dinh');
  const [activeAccessories, setActiveAccessories] = useState<string[]>(['khan-van', 'hai-theu']);

  // State cho Tình huống 3: Tra cứu nhanh lịch sử (Tooltip / Info Card)
  const [inspectedMotif, setInspectedMotif] = useState<string>('thuy-ba');
  const [copiedText, setCopiedText] = useState(false);

  // Toggle accessory
  const toggleAccessory = (id: string) => {
    setActiveAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Dữ liệu chi tiết cho Tình huống 1
  const EVENT_SCENARIOS = {
    'le-chua': {
      title: 'Đi Lễ Chùa & Chốn Tôn Nghiêm',
      badge: 'Cần Kín Đáo & Đoan Trang',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description:
        'Yêu cầu tính tôn nghiêm, kín cổng cao tường, che kín phần vai, lưng và ngực. Tuyệt đối không để lộ áo lót hay mặc độc chiếc áo yếm.',
      eraRecommendation: 'Thời Lý - Trần - Lê (Trạm 2) hoặc Triều Nguyễn (Trạm 3)',
      recommendedSet: {
        outer: 'Áo Giao Lĩnh cổ chéo hoặc Áo Ngũ Thân tay chẽn kín đáo',
        inner: 'Áo Yếm lụa đào mặc bên trong làm nền lót',
        bottom: 'Quần lụa trắng ống suông dài chấm gót',
        accessories: 'Hài thêu hoa sen kín ngón, Mấn nhung đen hoặc Nón Ba Tầm',
      },
      guardrailAlert:
        'Cấm kỵ: Mặc độc chiếc Áo Yếm mà không có áo khoác ngoài, hoặc dùng hoa văn Rồng 5 móng.',
      appropriatenessScore: 5,
      eraId: 'ly-tran-le',
      styleName: 'Trang nghiêm Cung đình & Chùa chiền',
    },
    'hoi-thao': {
      title: 'Đi Hội Thảo & Tọa Đàm Văn Hóa',
      badge: 'Cần Thanh Lịch & Trí Thức',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description:
        'Trang trọng, nhã nhặn, tôn vinh phong thái đĩnh đạc của giới trí thức, kết nối giữa di sản truyền thống và môi trường học thuật quốc tế.',
      eraRecommendation: 'Thời Triều Nguyễn (Trạm 3) hoặc Pháp Thuộc Đầu TK XX (Trạm 4)',
      recommendedSet: {
        outer: 'Áo Ngũ Thân 5 khuy cài nghiêm cẩn (tượng trưng Nhân - Lễ - Nghĩa - Trí - Tín)',
        inner: 'Áo lót cánh trắng cổ đứng sạch sẽ',
        bottom: 'Quần lụa trắng hoặc đen là ủi phẳng phiu',
        accessories: 'Mấn quấn gọn gàng, Kiềng bạc truyền thống, Giày tây hoặc Guốc mộc đen',
      },
      guardrailAlert:
        'Khuyên dùng: Màu sắc nhã nhặn (xanh lục, chàm, nâu trầm, vàng đồng), tránh màu quá chói lọi phản cảm.',
      appropriatenessScore: 5,
      eraId: 'trieu-nguyen',
      styleName: 'Thanh lịch Trí thức & Ngoại giao',
    },
    'dao-pho': {
      title: 'Chụp Ảnh Dạo Phố & Check-in Gen Z',
      badge: 'Cần Năng Động & Cá Tính',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description:
        'Hiện đại, phóng khoáng, trẻ trung và linh hoạt khi di chuyển dạo phố, cà phê cuối tuần hoặc sáng tạo nội dung ảnh nghệ thuật.',
      eraRecommendation: 'Tân Thời & Đương Đại (Trạm 5) hoặc Pháp Thuộc Cải Biên (Trạm 4)',
      recommendedSet: {
        outer: 'Áo Dài Lemur cách tân hoặc Áo Giao Lĩnh khoác ngoài như kimono blazer',
        inner: 'Áo thun ba lỗ trắng hoặc áo croptop lót bên trong',
        bottom: 'Quần suông hiện đại hoặc Quần lụa dạo phố thoải mái',
        accessories: 'Kính râm gọng mắt mèo, Giày sneaker / Guốc gỗ cách tân, Túi cói thủ công',
      },
      guardrailAlert:
        'Lưu ý: Thoải mái phối hợp (Mix & Match) nhưng giữ phom dáng tà áo chuẩn mực, không cắt xẻ phản cảm.',
      appropriatenessScore: 5,
      eraId: 'hien-dai',
      styleName: 'Streetwear Heritage Layering',
    },
  };

  // Dữ liệu chi tiết cho Tình huống 3: Thẻ thông tin & Họa tiết
  const MOTIF_TOOLTIPS: Record<
    string,
    {
      name: string;
      era: string;
      meaning: string;
      symbolism: string;
      tabooRule: string;
      originSource: string;
      svgIcon: string;
    }
  > = {
    'thuy-ba': {
      name: 'Họa Tiết Thủy Ba & Sóng Cuộn Đại Việt',
      era: 'Thời Lý - Trần (TK XI - XIV)',
      meaning:
        'Hình tượng những ngọn sóng cuộn trào tầng tầng lớp lớp ở chân gấu áo, thể hiện hào khí Đông A quật khởi và sự gắn bó khăng khít với văn minh sông nước lúa nước.',
      symbolism: 'Sự trường tồn bất diệt, lòng bao dung và sức sống mãnh liệt của dân tộc.',
      tabooRule:
        'Có thể dùng rộng rãi trên cả trang phục lễ nghi lẫn dạo phố cách tân, không vi phạm điển chế phong kiến.',
      originSource: 'Bảo tàng Lịch sử Quốc gia & Bệ đá chùa Phật Tích (1057).',
      svgIcon: '🌊',
    },
    'rong-4-mong': {
      name: 'Họa Tiết Rồng 4 Móng (Vương Hầu & Quan Lại)',
      era: 'Thời Lê Sơ - Nguyễn (TK XV - XIX)',
      meaning:
        'Hình tượng rồng uốn lượn hình sin mềm mại, chỉ có 4 móng chân, dành cho Hoàng tử, Vương hầu và Đại thần cửu phẩm.',
      symbolism: 'Biểu thị tước vị cao quý, đức độ trung quân ái quốc và sự thịnh vượng bền vững.',
      tabooRule:
        'Hợp lệ 100% cho thiết kế văn hóa đương đại. Khác biệt cốt lõi với Rồng 5 móng vốn là độc quyền tối cao của Hoàng đế.',
      originSource: 'Đại Nam Hội Điển Sự Lệ & Điển chế triều Lê.',
      svgIcon: '🐉',
    },
    'may-cuon': {
      name: 'Họa Tiết Mây Cụm Tản Vân',
      era: 'Thời Lê Sơ (TK XV - XVI)',
      meaning:
        'Đám mây cuộn tròn thành từng khóm bồng bềnh mang phong cách Nho giáo chuẩn mực, tượng trưng cho thiên đạo thái bình và khí lành hội tụ.',
      symbolism: 'Sự hanh thông, mưa thuận gió hòa và tinh thần tự chủ thịnh trị.',
      tabooRule:
        'Rất thích hợp thêu trên vai áo, cổ áo hoặc ngực áo Giao Lĩnh, Viên Lĩnh.',
      originSource: 'Bia đá Lam Kinh & Di tích Hoàng thành Thăng Long.',
      svgIcon: '☁️',
    },
    'sen-cuc-day': {
      name: 'Hoa Sen & Hoa Cúc Dây Dập Nổi',
      era: 'Thời Lý - Trần (TK XI - XIII)',
      meaning:
        'Hoa sen thanh tịnh của nhà Phật kết hợp với cúc dây vương giả tượng trưng cho sự thanh cao thoát tục và trường thọ viên mãn.',
      symbolism: 'Tâm hồn trong sáng, không vướng bụi trần, an lạc và tự tại.',
      tabooRule:
        'Phù hợp tuyệt đối cho y phục đi lễ chùa, sự kiện thiền định và dạo phố tao nhã.',
      originSource: 'Gốm hoa nâu thời Lý - Trần & Điêu khắc tháp Bút Tháp.',
      svgIcon: '🪷',
    },
  };

  const handleApplyPreset = (eraId: string, styleName: string, eventCtx: string) => {
    if (onSelectScenarioPreset) {
      onSelectScenarioPreset({
        eraId,
        styleName,
        eventContext: eventCtx,
        itemsHint: ['Áo khoác chuẩn', 'Quần lụa', 'Hài thêu'],
      });
    } else if (onNavigateToStudio) {
      onNavigateToStudio();
    }
  };

  const copyUseCasesMarkdown = () => {
    const text = `# 3 TÌNH HUỐNG SỬ DỤNG CHÍNH - NỀN TẢNG "ÁO XƯA NAY"

1. LỰA CHỌN TRANG PHỤC THEO SỰ KIỆN / ĐỊA PHƯƠNG:
- Đi lễ chùa: Cần kín đáo, đoan trang (Áo Giao Lĩnh / Ngũ Thân kín cổ + Hài thêu, tránh mặc yếm đơn độc).
- Đi hội thảo: Cần thanh lịch, trí thức (Áo Ngũ Thân 5 khuy + Mấn nhung + Kiềng bạc trang nhã).
- Chụp ảnh dạo phố: Cần năng động, trẻ trung (Áo Dài Lemur / Streetwear Layering + Phụ kiện hiện đại).

2. KHÁM PHÁ VÀ MIX & MATCH:
- Tách rời các lớp áo (Innerwear + Outerwear + Bottom) để cá nhân hóa phong cách.
- Đổi màu sắc theo bảng màu Cung đình, Hiện đại hoặc Pastel.
- Thêm phụ kiện truyền thống (Mấn, quạt lụa, hài thêu, nón quai thao) đảm bảo tính hài hòa văn hóa.

3. TRA CỨU NHANH LỊCH SỬ (TOOLTIP & INFO CARDS):
- Xem tooltip giải thích nguồn gốc và ý nghĩa họa tiết (Thủy ba sông nước, Rồng 4 móng, Mây cụm Lê Sơ, Sen cúc dây).
- Nhận diện hàng rào văn hóa và quy chuẩn cấm kỵ ngay trong quá trình phối đồ.`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section className="w-full bg-white border border-stone-200/90 rounded-3xl shadow-sm overflow-hidden transition-all">
      {/* 1. Header Banner của Section */}
      <div className="bg-gradient-to-r from-[#991B1B] via-[#831818] to-[#6E1212] text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wider uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Cẩm Nang Trải Nghiệm Người Dùng</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-editorial tracking-tight text-white">
              3 Tình Huống Sử Dụng Chính
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl leading-relaxed">
              Thiết kế giải pháp phối đồ chuẩn sử liệu cho giới trẻ: Từ chọn đồ theo tình huống thực tế, tự do Mix & Match đa tầng, đến tra cứu tức thì ý nghĩa hoa văn di sản.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyUseCasesMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Đã chép nội dung!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-300" />
                  <span>Sao chép tóm tắt</span>
                </>
              )}
            </button>

            {onNavigateToStudio && (
              <button
                onClick={onNavigateToStudio}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Shirt className="w-4 h-4" />
                <span>Vào Studio Thử Ngay</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Tab Điều hướng Tình huống */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
          {/* Tab 1 */}
          <button
            onClick={() => setActiveScenario(1)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer ${
              activeScenario === 1
                ? 'bg-white text-stone-900 shadow-md font-bold'
                : 'bg-white/10 text-stone-200 hover:bg-white/15'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                activeScenario === 1
                  ? 'bg-[#991B1B] text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              1
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Theo Sự Kiện / Địa Phương</div>
              <div className="text-[10px] opacity-80 line-clamp-1">Lễ chùa · Hội thảo · Dạo phố</div>
            </div>
          </button>

          {/* Tab 2 */}
          <button
            onClick={() => setActiveScenario(2)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer ${
              activeScenario === 2
                ? 'bg-white text-stone-900 shadow-md font-bold'
                : 'bg-white/10 text-stone-200 hover:bg-white/15'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                activeScenario === 2
                  ? 'bg-[#991B1B] text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              2
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Khám Phá & Mix & Match</div>
              <div className="text-[10px] opacity-80 line-clamp-1">Tách lớp áo · Đổi màu · Phụ kiện</div>
            </div>
          </button>

          {/* Tab 3 */}
          <button
            onClick={() => setActiveScenario(3)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer ${
              activeScenario === 3
                ? 'bg-white text-stone-900 shadow-md font-bold'
                : 'bg-white/10 text-stone-200 hover:bg-white/15'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                activeScenario === 3
                  ? 'bg-[#991B1B] text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              3
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Tra Cứu Nhanh Lịch Sử</div>
              <div className="text-[10px] opacity-80 line-clamp-1">Tooltip hoa văn & Xuất xứ sử liệu</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Nội dung Chi tiết theo Tình huống */}
      <div className="p-5 sm:p-6">
        {/* ========================================================
            TÌNH HUỐNG 1: LỰA CHỌN TRANG PHỤC THEO SỰ KIỆN / ĐỊA PHƯƠNG
           ======================================================== */}
        {activeScenario === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Thanh tiêu đề con */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B]">
                  Tình huống 1
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-stone-900">
                  Lựa chọn trang phục theo sự kiện / địa phương
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Tìm set đồ phù hợp để đi lễ chùa (cần kín đáo), đi hội thảo (cần thanh lịch) hoặc chụp ảnh dạo phố (cần năng động).
                </p>
              </div>

              {/* 3 Nút chọn Bối cảnh Sự kiện */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedEvent('le-chua')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEvent === 'le-chua'
                      ? 'bg-white text-[#991B1B] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🛕 Đi Lễ Chùa
                </button>
                <button
                  onClick={() => setSelectedEvent('hoi-thao')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEvent === 'hoi-thao'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🏛️ Đi Hội Thảo
                </button>
                <button
                  onClick={() => setSelectedEvent('dao-pho')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEvent === 'dao-pho'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  📸 Chụp Ảnh Dạo Phố
                </button>
              </div>
            </div>

            {/* Chi tiết Bối cảnh đang chọn */}
            {(() => {
              const current = EVENT_SCENARIOS[selectedEvent];
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Cột 1: Thông số & Tiêu chí văn hóa (5 cột) */}
                  <div className="lg:col-span-5 bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${current.badgeColor}`}
                        >
                          {current.badge}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                          {Array.from({ length: current.appropriatenessScore }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          <span className="text-stone-500 ml-1">5/5 Sao</span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold font-serif-editorial text-stone-900">
                        {current.title}
                      </h4>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {current.description}
                      </p>

                      <div className="pt-2 border-t border-stone-200/80 space-y-2">
                        <div className="text-xs">
                          <span className="font-bold text-stone-800">Trạm Lịch Sử gợi ý: </span>
                          <span className="text-[#991B1B] font-semibold">{current.eraRecommendation}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="leading-tight">{current.guardrailAlert}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleApplyPreset(
                          current.eraId,
                          current.styleName,
                          current.title
                        )
                      }
                      className="w-full py-2.5 px-4 rounded-xl bg-[#991B1B] hover:bg-[#831818] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Shirt className="w-4 h-4 text-amber-300" />
                      <span>Áp Dụng Bối Cảnh Này Vào Phòng Thử Đồ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cột 2: Danh sách bóc tách Set Đồ chuẩn mực (7 cột) */}
                  <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Bóc Tách Set Đồ Chuẩn Mực Theo Bối Cảnh
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Chuẩn Thuần Phong Mỹ Tục
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-stone-400">
                            1. Áo Khoác Ngoài (Outerwear)
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {current.recommendedSet.outer}
                          </div>
                          <div className="text-[11px] text-stone-500 leading-tight">
                            Tạo phom dáng đoan trang, che phủ kín đáo.
                          </div>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-stone-400">
                            2. Lớp Áo Mặc Trong (Innerwear)
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {current.recommendedSet.inner}
                          </div>
                          <div className="text-[11px] text-stone-500 leading-tight">
                            Lớp lót êm ái, giữ trọn nét duyên truyền thống.
                          </div>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-stone-400">
                            3. Quần / Chân Váy (Bottom)
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {current.recommendedSet.bottom}
                          </div>
                          <div className="text-[11px] text-stone-500 leading-tight">
                            Độ dài chạm gót, chất liệu tơ tằm mềm rủ.
                          </div>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="text-[10px] font-bold uppercase text-stone-400">
                            4. Phụ Kiện Đi Kèm (Accessories)
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {current.recommendedSet.accessories}
                          </div>
                          <div className="text-[11px] text-stone-500 leading-tight">
                            Tạo điểm nhấn trang nhã, không phô trương.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Hệ thống tự động chấm điểm độ phù hợp khi người dùng chọn set này.</span>
                      </div>
                      <span className="font-bold text-emerald-800 text-[11px]">Đạt chuẩn 100%</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================
            TÌNH HUỐNG 2: KHÁM PHÁ VÀ MIX & MATCH ĐA TẦNG
           ======================================================== */}
        {activeScenario === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Thanh tiêu đề con */}
            <div className="pb-3 border-b border-stone-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B]">
                Tình huống 2
              </span>
              <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-stone-900">
                Khám phá và Mix & Match cá nhân hóa
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Thử tách rời các lớp áo, đổi màu sắc và thêm phụ kiện để cá nhân hóa phong cách nhưng vẫn đảm bảo sự hài hòa văn hóa.
              </p>
            </div>

            {/* Trình giả lập Mix & Match tương tác */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Cột trái: Bộ điều khiển Layering & Palette (7 cột) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Tách rời lớp áo */}
                <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
                      1. Thử Tách Rời Các Lớp Áo (Layering)
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">Bóc tách 3 tầng</span>
                  </div>

                  {/* Lớp mặc trong */}
                  <div>
                    <div className="text-[11px] font-bold text-stone-600 mb-1">
                      Lớp trong (Innerwear):
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedInner('ao-yem')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedInner === 'ao-yem'
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        🎽 Áo Yếm Lụa Tơ
                      </button>
                      <button
                        onClick={() => setSelectedInner('ao-tanktop')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedInner === 'ao-tanktop'
                            ? 'bg-stone-200 border-stone-400 text-stone-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        👕 Áo Ba Lỗ Ở Nhà
                      </button>
                      <button
                        onClick={() => setSelectedInner('ao-canh')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedInner === 'ao-canh'
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        🥋 Áo Cánh Lót Trắng
                      </button>
                    </div>
                  </div>

                  {/* Lớp áo ngoài */}
                  <div>
                    <div className="text-[11px] font-bold text-stone-600 mb-1">
                      Lớp ngoài (Outerwear):
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedOuter('giao-linh')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedOuter === 'giao-linh'
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        👘 Áo Giao Lĩnh Cổ Chéo
                      </button>
                      <button
                        onClick={() => setSelectedOuter('ngu-than')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedOuter === 'ngu-than'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        🥻 Áo Ngũ Thân 5 Khuy
                      </button>
                      <button
                        onClick={() => setSelectedOuter('nhat-binh')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedOuter === 'nhat-binh'
                            ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        👑 Áo Nhật Bình Cung Đình
                      </button>
                    </div>
                  </div>

                  {/* Lớp quần / váy */}
                  <div>
                    <div className="text-[11px] font-bold text-stone-600 mb-1">
                      Lớp dưới (Bottom):
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedBottom('quan-lua')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedBottom === 'quan-lua'
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        👖 Quần Lụa Trắng Dài
                      </button>
                      <button
                        onClick={() => setSelectedBottom('quan-short')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedBottom === 'quan-short'
                            ? 'bg-stone-200 border-stone-400 text-stone-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        🩳 Quần Short Xám Năng Động
                      </button>
                      <button
                        onClick={() => setSelectedBottom('chan-vay')}
                        className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                          selectedBottom === 'chan-vay'
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        👗 Chân Váy Xòe Thêu
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Đổi bảng màu sắc */}
                <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    2. Đổi Màu Sắc Theo Phong Cách
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setColorTone('cung-dinh')}
                      className={`p-2.5 rounded-xl text-xs border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        colorTone === 'cung-dinh'
                          ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                      </div>
                      <span>Cung Đình Cổ Điển</span>
                      <span className="text-[10px] text-stone-500">Đỏ son, vàng tơ, lục</span>
                    </button>

                    <button
                      onClick={() => setColorTone('hien-dai')}
                      className={`p-2.5 rounded-xl text-xs border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        colorTone === 'hien-dai'
                          ? 'bg-stone-200 border-stone-600 text-stone-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-300" />
                      </div>
                      <span>Tối Giản Hiện Đại</span>
                      <span className="text-[10px] text-stone-500">Đen tuyền, xám, trắng</span>
                    </button>

                    <button
                      onClick={() => setColorTone('pastel')}
                      className={`p-2.5 rounded-xl text-xs border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        colorTone === 'pastel'
                          ? 'bg-rose-100/70 border-rose-400 text-rose-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-200" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                      </div>
                      <span>Gen Z Pastel</span>
                      <span className="text-[10px] text-stone-500">Hồng phấn, ngọc bích nhạt</span>
                    </button>
                  </div>
                </div>

                {/* 3. Thêm phụ kiện */}
                <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    3. Thêm Phụ Kiện Cá Nhân Hóa (Bấm để bật/tắt)
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'khan-van', label: '👑 Mấn quấn nhung', tag: 'Đầu' },
                      { id: 'non-quai-thao', label: '👒 Nón Ba Tầm', tag: 'Đầu' },
                      { id: 'hai-theu', label: '🥿 Hài thêu sen', tag: 'Chân' },
                      { id: 'quat-lua', label: '🪭 Quạt lụa cầm tay', tag: 'Tay' },
                      { id: 'kieng-bac', label: '💍 Kiềng bạc cổ', tag: 'Cổ' },
                      { id: 'kinh-ram', label: '🕶️ Kính râm dạo phố', tag: 'Mắt' },
                    ].map((acc) => {
                      const isSelected = activeAccessories.includes(acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccessory(acc.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-2xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <span>{acc.label}</span>
                          <span
                            className={`text-[9px] px-1 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {acc.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cột phải: Bản xem trước độ Hài hòa & Đánh giá phối đồ (5 cột) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-2xl p-5 border border-stone-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Chỉ Số Hài Hòa & Cá Tính
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800">
                      TỔNG HÒA 9.5/10
                    </span>
                  </div>

                  {/* Thanh đánh giá 3 chiều */}
                  <div className="space-y-3 my-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">Tính Chuẩn Mực Văn Hóa:</span>
                        <span className="font-bold text-amber-300">
                          {selectedOuter === 'giao-linh' || selectedOuter === 'ngu-than'
                            ? '95% (Rất chuẩn mực)'
                            : '88% (Cách tân hài hòa)'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                          style={{
                            width:
                              selectedOuter === 'giao-linh' || selectedOuter === 'ngu-than'
                                ? '95%'
                                : '88%',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">Tính Cá Nhân Hóa Gen Z:</span>
                        <span className="font-bold text-pink-300">
                          {colorTone === 'pastel' || activeAccessories.includes('kinh-ram')
                            ? '98% (Đậm chất thời thượng)'
                            : '85% (Cân bằng tao nhã)'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                          style={{
                            width:
                              colorTone === 'pastel' || activeAccessories.includes('kinh-ram')
                                ? '98%'
                                : '85%',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">Độ Hài Hòa Phối Lớp:</span>
                        <span className="font-bold text-cyan-300">92% (Tách lớp mượt mà)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Bản tóm tắt set đồ đang dựng */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1.5 text-stone-300">
                    <div className="text-[11px] font-bold text-white uppercase mb-1">
                      Set Đang Thử Nghiệm:
                    </div>
                    <div>
                      <span className="text-stone-400">• Lớp ngoài:</span>{' '}
                      <span className="font-semibold text-amber-200">
                        {selectedOuter === 'giao-linh'
                          ? 'Áo Giao Lĩnh Cổ Chéo'
                          : selectedOuter === 'ngu-than'
                          ? 'Áo Ngũ Thân 5 Khuy'
                          : 'Áo Nhật Bình'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">• Lớp trong:</span>{' '}
                      <span className="font-semibold text-rose-200">
                        {selectedInner === 'ao-yem'
                          ? 'Áo Yếm Lụa Tơ'
                          : selectedInner === 'ao-tanktop'
                          ? 'Áo Ba Lỗ Ở Nhà'
                          : 'Áo Cánh Lót Trắng'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">• Phụ kiện:</span>{' '}
                      <span className="font-semibold text-stone-200">
                        {activeAccessories.length > 0
                          ? activeAccessories.join(', ')
                          : 'Không kèm phụ kiện'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">• Tone màu:</span>{' '}
                      <span className="font-semibold text-cyan-200">
                        {colorTone === 'cung-dinh'
                          ? 'Cung Đình Cổ Điển'
                          : colorTone === 'hien-dai'
                          ? 'Tối Giản Hiện Đại'
                          : 'Gen Z Pastel'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onNavigateToStudio) onNavigateToStudio();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Mở Tủ Đồ Thử Ngay Từng Món Trên Người Mẫu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TÌNH HUỐNG 3: TRA CỨU NHANH LỊCH SỬ (TOOLTIP & INFO CARDS)
           ======================================================== */}
        {activeScenario === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Thanh tiêu đề con */}
            <div className="pb-3 border-b border-stone-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B]">
                Tình huống 3
              </span>
              <h3 className="text-base sm:text-lg font-bold font-serif-editorial text-stone-900">
                Tra cứu nhanh lịch sử ngay trong quá trình phối đồ
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Xem nhanh các thẻ thông tin (tooltip / popover) giải thích ý nghĩa họa tiết và nguồn gốc trang phục ngay trong quá trình phối đồ mà không bị đứt đoạn trải nghiệm.
              </p>
            </div>

            {/* Bảng tương tác mô phỏng Tooltip Tra cứu nhanh */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Danh sách 4 Họa tiết Di sản Tra cứu (5 cột) */}
              <div className="lg:col-span-5 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Chọn Thẻ Hoa Văn Để Xem Nhanh Tooltip:
                </span>

                {Object.entries(MOTIF_TOOLTIPS).map(([key, item]) => {
                  const isActive = inspectedMotif === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setInspectedMotif(key)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.svgIcon}</span>
                        <div>
                          <div className="text-xs font-bold leading-snug">{item.name}</div>
                          <div
                            className={`text-[11px] ${
                              isActive ? 'text-amber-200' : 'text-stone-500'
                            }`}
                          >
                            {item.era}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white translate-x-1' : 'text-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2 mt-3">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    Trong phòng phối đồ, bạn chỉ cần <strong>hover</strong> hoặc <strong>chạm</strong> vào biểu tượng thẻ thông tin trên bất kỳ món đồ nào để mở tooltip này ngay lập tức.
                  </div>
                </div>
              </div>

              {/* Thẻ mô phỏng Tooltip / Info Card chi tiết (7 cột) */}
              <div className="lg:col-span-7 bg-white border-2 border-stone-300 rounded-3xl p-5 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

                {(() => {
                  const currentMotif = MOTIF_TOOLTIPS[inspectedMotif];
                  return (
                    <div className="space-y-4">
                      {/* Header của Tooltip */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-stone-100 rounded-2xl">
                            {currentMotif.svgIcon}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] bg-red-50 px-2 py-0.5 rounded">
                              Thẻ Thông Tin Di Sản (Interactive Tooltip)
                            </span>
                            <h4 className="text-base font-bold font-serif-editorial text-stone-900 mt-0.5">
                              {currentMotif.name}
                            </h4>
                            <p className="text-xs text-stone-500 font-mono">
                              Niên đại: {currentMotif.era}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                          Đã Xác Thực Sử Liệu
                        </span>
                      </div>

                      {/* Ý nghĩa & Biểu tượng */}
                      <div className="space-y-2 text-xs leading-relaxed text-stone-700">
                        <div>
                          <strong className="text-stone-900">📖 Ý nghĩa văn hóa: </strong>
                          {currentMotif.meaning}
                        </div>
                        <div>
                          <strong className="text-stone-900">✨ Biểu tượng tinh thần: </strong>
                          {currentMotif.symbolism}
                        </div>
                        <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/80 text-red-950">
                          <strong className="text-red-900">⚠️ Hàng rào cấm kỵ & Quy chuẩn: </strong>
                          {currentMotif.tabooRule}
                        </div>
                      </div>

                      {/* Nguồn gốc xuất xứ */}
                      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
                        <div>
                          <span className="font-semibold text-stone-700">Nguồn trích dẫn: </span>
                          <span>{currentMotif.originSource}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (onNavigateToStudio) onNavigateToStudio();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#991B1B] hover:underline cursor-pointer"
                        >
                          <span>Thử món có hoa văn này trong Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer tóm tắt 3 tình huống */}
      <div className="bg-stone-50 px-5 sm:px-6 py-3.5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#991B1B]" />
          <span>3 Tình huống sử dụng đã được tích hợp toàn diện vào Studio và Bảng Kiến Thức Lịch Sử.</span>
        </div>
        <div className="text-[11px] font-medium text-stone-400">
          Áo Xưa Nay · Bảo Tồn Văn Hóa Y Phục Việt Nam Cho Giới Trẻ
        </div>
      </div>
    </section>
  );
}
