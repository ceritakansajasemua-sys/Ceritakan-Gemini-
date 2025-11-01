// app/page.tsx (Homepage)
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Selamat Datang di Cerita.online</h1>
      <p className="mt-4">Tempat aman untuk berbagi ceritamu. Curhat langsung dengan admin.</p>
      <div className="mt-6">
        <Link href="/#pricing" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
          Mulai Berlangganan
        </Link>
        <Link href="/about" className="ml-4 text-gray-700">
          Tentang Kami
        </Link>
      </div>
    </div>
  );
}
