export default function CreditFooter({ isEmpty }: { isEmpty: boolean }) {
  return (
    <div className={`w-full flex justify-center px-6 ${isEmpty ? 'flex-grow items-center' : 'py-12 mt-8'}`}>
      <div className={`text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 ${isEmpty ? 'w-full max-w-sm' : 'w-full'}`}>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
          Developed By
        </p>
        <h3 className="text-lg font-black text-gray-800">
          Md Nafiz
        </h3>
        <p className="text-xs font-medium text-gray-400 mt-2">
          Student Of Masjid Mission Academy School & College
        </p>
      </div>
    </div>
  );
}

