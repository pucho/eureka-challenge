import { useEffect, useState } from "react";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";
import useFetchProducts from "../hooks/useFetchProducts";

const ProductList: React.FC = () => {
  const { loading, error, productTypes, products } = useFetchProducts();
  const [filters, setFilters] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [listFormat, setListFormat] = useState("grid" as "grid" | "list");
  const [sortType, setSortType] = useState<string>("priceHighToLow");

  useEffect(() => {
    handleSortChange("priceHighToLow");
  }, []);

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

    setFilteredProducts(processedProducts);
  }, [filters, products, sortType]);

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
      <div role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex p-4">
      <div className="flex flex-col py-3">
        <div className="min-w-52 text-center">Filter Results</div>
        <div>Product Type</div>
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
                  console.log(productType);
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
                {productType}
              </label>
            </div>
          );
        })}
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
