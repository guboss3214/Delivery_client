import AddToCartButton from '@/components/AddToCartButton';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>
}
 
async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct((await params).slug);
 
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Eliftech Store`,
    description: `Buy ${product.name} for just $${product.price}`,
    openGraph: {
      images: [product.imageUrl || ''],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
    console.log((await params).slug);
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link href="/" className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
          &larr; Back to menu
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl || ''} 
              alt={product.name} 
              priority
              className="w-full h-auto object-cover rounded-xl"
              width={500}
              height={500}
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {product.shopId?.name && (
            <span className="text-sm font-bold tracking-wider text-emerald-500 uppercase mb-2">
              {product.shopId.name}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-3xl font-bold text-emerald-600 mb-8">
            ${product.price.toFixed(2)}
          </div>

          <div className="flex gap-4">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}