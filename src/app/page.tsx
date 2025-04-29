import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { recipes } from '@/features/recipes/data/mock-data-recipes';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">コーヒーレシピ一覧</h1>
      <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
