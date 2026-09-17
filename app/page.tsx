import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-4 py-12 text-center sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        Аяллын мэдээлэл
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg md:text-xl">
        Байгууллагын аялал, зугаалгын мэдээлэл — багийн хуваарь, өдөр тутмын хуваарь, хонох байрлал бүгд нэг дор.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-xl transition hover:bg-indigo-50 sm:px-10"
        >
          Админ хэсэг
        </Link>
      </div>
      <p className="mt-8 text-sm text-indigo-200">
        Ажилтнууд тухайн аяллын линкээр орж мэдээллээ харна.
      </p>
    </main>
  );
}
