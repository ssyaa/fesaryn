export default function LoadingOverlay() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
        <span className="text-white text-2xl font-semibold animate-pulse">Loading...</span>
      </div>
    );
  }
  