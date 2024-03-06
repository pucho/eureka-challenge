import { useState, useEffect } from "react";

const useFetchProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(import.meta.env.VITE_API_URL, {
          method: "GET",
          headers: {
            secretKey: import.meta.env.VITE_SECRET_KEY,
          },
        });
        const data = await response.json();

        const productsMap = new Map(
          data.map((product: any) => [product.id, product]),
        );
        const uniqueProducts = Array.from(productsMap.values());

        const uniqueProductTypes = Array.from(
          new Set(uniqueProducts.map((product: any) => product.product_type)),
        );

        setProducts(uniqueProducts);
        setProductTypes(uniqueProductTypes);
      } catch (error) {
        console.error(error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { loading, error, products, productTypes };
};

export default useFetchProducts;
