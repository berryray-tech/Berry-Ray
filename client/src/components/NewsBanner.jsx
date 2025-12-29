// src/components/NewsBanner.jsx (Example)
export default function NewsBanner({ banners }) {
  // Check if there are any active banners
  if (!banners || banners.length === 0) {
    return null; // Don't render anything if no banners are active
  }

  // Use the first banner for simplicity
  const latestBanner = banners[0]; 

  return (
    <div className="bg-blue-600 text-white p-2 text-center text-sm font-medium">
      <p>
        <span className="font-bold mr-2">{latestBanner.title}:</span> 
        {latestBanner.content}
      </p>
    </div>
  );
}