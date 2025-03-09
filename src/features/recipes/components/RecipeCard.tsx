import { Bean, Droplet, Settings } from 'lucide-react';
import { Recipe } from '../types/recipe';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-2 text-lg font-semibold">{recipe.title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">{recipe.description}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Bean className="h-4 w-4" />
          <span>
            {recipe.roastLevel}・{recipe.grindSize}・{recipe.coffeeAmount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4" />
          <span>
            {recipe.waterTemp}・{recipe.totalWater}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>{recipe.equipment.join('・')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
