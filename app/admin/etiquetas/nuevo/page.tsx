import { CreateTagForm } from "@/components/admin/CreateTagForm";

export default function NewTagPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nueva Etiqueta</h1>
        <p className="text-gray-500 mt-2">Crea una nueva etiqueta para categorizar noticias</p>
      </div>

      <div className="max-w-2xl">
        <CreateTagForm />
      </div>
    </div>
  );
}
