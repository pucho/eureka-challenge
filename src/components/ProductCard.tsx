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
  type?: string;
};

const ProductCard = (props: ProductCardProps) => {
  const {
    product: {
      title,
      product_type,
      image: { src },
      quantitySold,
    },
    type = "card",
  } = props;

  const createClassNames = (cardType: string) => {
    let classNames =
      "bg-gray-600 p-3 rounded overflow-hidden shadow-lg flex border border-gray-500 hover:shadow-2xl transition duration-300 ease-in-out hover:bg-gray-500";
    if (cardType === "list") {
      classNames += " flex-row";
    } else {
      classNames += " flex-col";
    }
    return classNames;
  };
  console.log(type);
  return (
    <div className={createClassNames(type)}>
      <img
        src={src}
        alt={title}
        className="h-24 object-contain self-center mb-3"
      />
      <div className={`${type === "list" && "ml-3"}`}>
        <h3 className="text-center mb-2">{title}</h3>
        <p>{product_type.charAt(0).toUpperCase() + product_type.slice(1)}</p>
        <p>Quantity Sold: {quantitySold}</p>
      </div>
    </div>
  );
};

export default ProductCard;
