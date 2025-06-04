import Image from "next/image";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to{" "}
          <span className="text-indigo-600" style={{ fontFamily: "var(--font-geist-sans)" }}>
            NextBlog
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          A modern Next.js demo app for managing users, blogs, and categories. Built with TypeScript, Tailwind CSS, and a beautiful UI.
        </p>
        <a
          href="/blog"
          className="btn text-lg px-8 py-3 shadow-lg rounded-full border border-transparent transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Explore Blog
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
        <div className="card flex flex-col items-center text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Image src="/file.svg" alt="Users" width={48} height={48} className="mb-3" />
          <h2 className="text-xl font-bold mb-2">User Management</h2>
          <p className="text-gray-500">Add, view, and manage users with profile images and roles.</p>
        </div>
        <div className="card flex flex-col items-center text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Image src="/window.svg" alt="Blog" width={48} height={48} className="mb-3" />
          <h2 className="text-xl font-bold mb-2">Blog Platform</h2>
          <p className="text-gray-500">Create, edit, and browse blog posts with author info and tags.</p>
        </div>
        <div className="card flex flex-col items-center text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Image src="/globe.svg" alt="Categories" width={48} height={48} className="mb-3" />
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <p className="text-gray-500">Organize your content with easy-to-manage categories.</p>
        </div>
      </div>
    </section>
  );
}
