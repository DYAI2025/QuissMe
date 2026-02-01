export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D6B25E] animate-spin"></div>
      </div>
    </div>
  );
};
