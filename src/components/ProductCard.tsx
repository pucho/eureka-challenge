type ProductVariant = {
  price: string;
};
type Product = {
  title: string;
  product_type: string;
  image: {
    src: string;
  };
  quantitySold: number;
  variants: ProductVariant[];
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = (props: ProductCardProps) => {
  const {
    product: {
      title,
      product_type,
      image: { src },
      quantitySold,
      variants,
    },
  } = props;
  return (
    <div className="p-3 rounded overflow-hidden shadow-lg flex flex-col border border-gray-500 hover:bg-gray-500">
      <img
        src={src}
        alt={title}
        className="h-24 object-contain justify-center mb-3"
      />
      <h3 className="text-center">{title}</h3>
      <p>{product_type.charAt(0).toUpperCase() + product_type.slice(1)}</p>
      <p>Quantity Sold: {quantitySold}</p>
    </div>
  );
};

export default ProductCard;
