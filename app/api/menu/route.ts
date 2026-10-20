import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1. Ambil Semua Menu (SELECT)
export async function GET() {
  const [rows] = await db.query("SELECT * FROM Menu ORDER BY id DESC");
  return NextResponse.json(rows);
}

// 2. Tambah Menu Baru (INSERT)
export async function POST(req: Request) {
  const { nama, kategori, harga, deskripsi, gambarUrl } = await req.json();
  await db.query(
    "INSERT INTO Menu (nama, kategori, harga, deskripsi, gambarUrl) VALUES (?, ?, ?, ?, ?)",
    [nama, kategori, harga, deskripsi || "", gambarUrl || ""]
  );
  return NextResponse.json({ message: "Berhasil" });
}

// 3. Hapus Menu (DELETE)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await db.query("DELETE FROM Menu WHERE id = ?", [id]);
  return NextResponse.json({ message: "Terhapus" });
}