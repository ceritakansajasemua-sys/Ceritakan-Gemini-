// components/ChatBox.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase (hanya sekali, bisa di file terpisah)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Asumsikan kita tahu ID admin dan ID user
interface ChatBoxProps {
  userId: string;
  adminId: string;
}

interface Message {
  id: number;
  konten: string;
  pengirim_id: string;
}

export default function ChatBox({ userId, adminId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // 1. Ambil chat lama saat komponen dimuat
  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`(pengirim_id.eq.${userId},penerima_id.eq.${adminId}),(pengirim_id.eq.${adminId},penerima_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      setMessages(data || []);
    }
    fetchMessages();
  }, [userId, adminId]);

  // 2. KUNCI REALTIME: Dengarkan pesan baru
  useEffect(() => {
    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          // Saat ada pesan baru masuk di DB, tambahkan ke state
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Fungsi kirim pesan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await supabase
      .from('messages')
      .insert({
        pengirim_id: userId,
        penerima_id: adminId,
        konten: newMessage
      });
    
    setNewMessage("");
  };

  return (
    <div>
      <div className="chat-window h-96 overflow-y-auto border p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.pengirim_id === userId ? 'text-right' : 'text-left'}>
            <p className="inline-block bg-gray-200 p-2 rounded-lg">{msg.konten}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded-l-lg p-2"
          placeholder="Ketik pesanmu..."
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-lg">
          Kirim
        </button>
      </form>
    </div>
  );
}
