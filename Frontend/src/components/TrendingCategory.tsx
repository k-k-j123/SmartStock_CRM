import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  title: string;
  price: {
    raw: string;
  };
  thumbnail: string;
  rating: number;
}

interface TrendingProps {
  category: string;
  products: Product[];
}

export default function TrendingCategory({ category, products }: TrendingProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold capitalize text-foreground">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 bg-muted flex items-center justify-center">
              <img src={product.thumbnail} alt={product.title} className="h-32 w-32 object-contain" />
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium line-clamp-2">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-primary">{product.price?.raw || "N/A"}</span>
                <Badge variant="secondary">★ {product.rating || "N/A"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
