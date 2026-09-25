import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductForm from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1>Edit {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
