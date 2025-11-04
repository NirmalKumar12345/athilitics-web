'use client';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="relative flex flex-col items-center">
        <span className="absolute inline-flex h-44 w-44 rounded-full bg-[#4EF162] opacity-30 animate-ping"></span>
        <img src="/images/athliticsLogo.svg" alt="Logo" className="w-40 h-40 z-10" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
