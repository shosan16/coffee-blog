import { Bean, Droplet, Settings } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="h-56 w-full justify-center transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{recipe.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bean className="h-4 w-4" />
            <span className="text-sm">
              {recipe.roastLevel}・{recipe.grindSize}・{recipe.coffeeAmount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            <span className="text-sm">
              {recipe.waterTemp}・{recipe.totalWater}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">{recipe.equipment.join('・')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
