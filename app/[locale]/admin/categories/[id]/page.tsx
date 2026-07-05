export default function AdminCategoryDetails({ params }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Catégorie #{params.id}</h1>
      <p className="text-gray-600 mt-2">Modifier la catégorie</p>
    </div>
  );
}
