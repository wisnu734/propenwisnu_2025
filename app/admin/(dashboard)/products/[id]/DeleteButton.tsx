'use client'; // <--- WAJIB PALING ATAS

type Props = {
  id: number;
  deleteAction: (formData: FormData) => Promise<void>; 
};

export default function DeleteButton({ id, deleteAction }: Props) {
  return (
    <form action={deleteAction}>
      <input type="hidden" name="id" value={id} />
      <button
        className="btn btn-ghost hover:bg-red-900/50 hover:text-red-200"
        onClick={(e) => {
          // Confirm di browser
          if (!confirm('Yakin ingin menghapus produk ini? Data resep & history order terkait produk ini juga akan ikut terhapus!')) {
            e.preventDefault();
          }
        }}
      >
        Hapus Produk
      </button>
    </form>
  );
}