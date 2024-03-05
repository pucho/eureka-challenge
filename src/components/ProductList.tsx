import { useEffect, useState } from "react";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [sortType, setSortType] = useState("priceHighToLow" as string);
  const [listFormat, setListFormat] = useState("grid" as "grid" | "list");

  useEffect(() => {
    // Fetch data from the API
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
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  useEffect(() => {
    handleSortChange(sortType);
  }, []);

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
    <div>
      <div className="flex justify-between px-4">
        <div>Available Deals: {products.length}</div>
        <div className="flex flex-row">
          <div onClick={() => setListFormat("grid")}>
            <Squares2X2Icon className="h-6 w-6" />
          </div>
          <div onClick={() => setListFormat("list")}>
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
      <div className="flex">
        <div className="min-w-28">Filter Results</div>
        <div className="grid grid-cols-3 gap-3">
          {products.map((product: any) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
