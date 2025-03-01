import SearchBar from "@/components/SearchBar";

function Listings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 shadow">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>
      <div className="container mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            {/* View Toggle Buttons */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border rounded hover:bg-gray-100">
                Grid
              </button>
              <button className="px-4 py-2 border rounded hover:bg-gray-100">
                List
              </button>
            </div>

            {/* Sort By */}
            <div>
              <select className="border rounded px-3 py-2">
                <option value="default">Sort By: Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4"></div>
      </div>
    </div>
  );
}

export default Listings;
