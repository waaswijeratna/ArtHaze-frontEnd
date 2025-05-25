import ExhibitionForm from "@/components/exhibitions/ExhibitionForm";

export default function MyExhibitions() {
  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Create Virtual Exhibition</h1>
      <ExhibitionForm />
    </div>
  );
}