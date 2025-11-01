// app/how-to/page.tsx
export default function HowToPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Cara Menggunakan</h1>
      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li>Login menggunakan akun Google atau Instagram Anda.</li>
        <li>Pilih paket membership dan lakukan pembayaran via Midtrans.</li>
        <li>Setelah pembayaran sukses, menu "Chat Admin" akan terbuka.</li>
        <li>Mulai curhat kapanpun Anda mau!</li>
      </ol>
    </div>
  );
}
