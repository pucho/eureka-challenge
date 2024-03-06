import { useEffect, useState } from "react";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [listFormat, setListFormat] = useState("grid" as "grid" | "list");

  useEffect(() => {
    // Fetch data from the API
    setLoading(true);
    fetch(
      "https://kabsa.yallababy.com/api/v1/products/best-selling-products-by-subcategory",
      {
        method: "GET",
        headers: {
          secretKey: "1DIPIkKeq8",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        // Use a Map to track unique items
        const productsMap = new Map(
          data.map((product: any) => [product.id, product]),
        );
        const uniqueProducts = Array.from(productsMap.values());
        setProducts(uniqueProducts);

        const uniqueProductTypes = Array.from(
          new Set(uniqueProducts.map((product: any) => product.product_type)),
        );
        setProductTypes(uniqueProductTypes);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        setError("Error fetching data");
      });
  }, []);

  useEffect(() => {
    handleSortChange("priceHighToLow");
  }, []);

  useEffect(() => {
    if (filters.length === 0) {
      setFilteredProducts(products);
      return;
    }
    const filteredProducts =
      products.filter((product) => {
        return filters.includes(product.product_type);
      }) || products;
    setFilteredProducts(filteredProducts);
  }, [filters, products]);

  // TODO move sorting to utils
  const handleSortChange = (sortType: string) => {
    let sortedProducts = [...products];
    switch (sortType) {
      case "priceHighToLow":
        sortedProducts.sort(
          (a, b) => b.variants[0].price - a.variants[0].price,
        );
        break;
      case "priceLowToHigh":
        sortedProducts.sort(
          (a, b) => a.variants[0].price - b.variants[0].price,
        );
        break;
      case "alphabeticalAsc":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alphabeticalDesc":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
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
