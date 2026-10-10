import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FDFBF7] text-[#1C1917]">
      <h2 className="text-4xl font-bold font-serif mb-4 text-[#991B1B]">404 - Không tìm thấy trang</h2>
      <p className="text-stone-600 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#991B1B] text-white rounded-xl font-medium shadow-md hover:bg-[#7F1D1D] transition-colors"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}
