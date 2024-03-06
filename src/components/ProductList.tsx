import { useEffect, useState } from "react";
import { Range } from "react-range";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";

import useFetchProducts from "../hooks/useFetchProducts";
import { capitalize } from "../utils/stringUtils";

const ProductList: React.FC = () => {
  const { loading, error, productTypes, products } = useFetchProducts();
  const [filters, setFilters] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [listFormat, setListFormat] = useState("grid" as "grid" | "list");
  const [sortType, setSortType] = useState<string>("priceHighToLow");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 100]);

  useEffect(() => {
    handleSortChange("priceHighToLow");
  }, []);

  // Calculate min and max price for all current product variants
  useEffect(() => {
    if (!loading && products.length > 0) {
      const prices = products.flatMap((product) =>
        product.variants.map((variant: any) => parseFloat(variant.price)),
      );
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
      setSelectedPriceRange([minPrice, maxPrice]);
    }
  }, [loading, products]);

  useEffect(() => {
    let processedProducts = [...products];

    // Filter
    if (filters.length > 0) {
      processedProducts = processedProducts.filter((product) =>
        filters.includes(product.product_type),
      );
    }

    // Sort
    processedProducts = sortProducts(processedProducts, sortType);

    // Filter by price range
    processedProducts = processedProducts.filter((product) =>
      product.variants.some(
        (variant: any) =>
          parseFloat(variant.price) >= selectedPriceRange[0] &&
          parseFloat(variant.price) <= selectedPriceRange[1],
      ),
    );

    setFilteredProducts(processedProducts);
  }, [filters, products, sortType, selectedPriceRange]);

  // TODO: Check sorting depending on variants or which variable
  const sortProducts = (products: any[], sortType: string): any[] => {
    switch (sortType) {
      case "priceHighToLow":
        return products.sort(
          (a, b) => b.variants[0].price - a.variants[0].price,
        );
      case "priceLowToHigh":
        return products.sort(
          (a, b) => a.variants[0].price - b.variants[0].price,
        );
      case "alphabeticalAsc":
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case "alphabeticalDesc":
        return products.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return products;
    }
  };

  const handleSortChange = (sortType: string) => {
    setSortType(sortType);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-200"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // TODO: Manage error states from the API
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex p-4">
      <div className="flex flex-col py-3">
        <div className="min-w-52 text-center">Filter Results</div>
        <h4>Product Type</h4>
        {productTypes.map((productType, index) => {
          return (
            <div
              className="flex items-center ml-4"
              key={`${productType}-${index}`}
            >
              <input
                type="checkbox"
                id={productType}
                key={productType}
                onChange={() => {
                  if (filters.includes(productType)) {
                    setFilters(
                      filters.filter((filter) => filter !== productType),
                    );
                  } else {
                    setFilters([...filters, productType]);
                  }
                }}
              />
              <label htmlFor={productType} className="ml-2">
                {capitalize(productType)}
              </label>
            </div>
          );
        })}
        <div>
          <h4>Price Range</h4>
          <div className="px-6">
            <Range
              step={1}
              min={priceRange[0]}
              max={priceRange[1]}
              values={selectedPriceRange}
              onChange={(values) =>
                setSelectedPriceRange(values as [number, number])
              }
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="my-4 h-2 bg-gray-100 rounded"
                  style={props.style}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div {...props} className="h-4 w-4 bg-gray-400 rounded-full" />
              )}
            />
            <div className="flex justify-between">
              <div>{selectedPriceRange[0]}</div>
              <div>{selectedPriceRange[1]}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between px-4 py-3">
          <div>Available Deals: {products.length}</div>
          <div className="flex flex-row gap-3">
            <div
              onClick={() => setListFormat("grid")}
              className={`cursor-pointer ${listFormat === "grid" && "text-gray-400"}`}
            >
              <Squares2X2Icon className="h-6 w-6" />
            </div>
            <div
              onClick={() => setListFormat("list")}
              className={`cursor-pointer ${listFormat === "list" && "text-gray-400"}`}
            >
              <ListBulletIcon className="h-6 w-6" />
            </div>
            <div className="ml-6">
              Sort results:{" "}
              <select onChange={(e) => handleSortChange(e.target.value)}>
                <option value="priceHighToLow">Price High to Low</option>
                <option value="priceLowToHigh">Price Low to High</option>
                <option value="alphabeticalAsc">Alphabetical (A-Z)</option>
                <option value="alphabeticalDesc">Alphabetical (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
        <div
          className={`grid ${listFormat === "grid" ? "grid-cols-3" : "grid-cols-1"} gap-3`}
        >
          {filteredProducts.map((product: any) => (
            <ProductCard product={product} key={product.id} type={listFormat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
