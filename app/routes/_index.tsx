import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import dayjs from "dayjs";
import { DEFAULT_THUMBNAIL } from "~/contants";
import { openDB } from "~/db.js";

export const loader = async () => {
  const db = await openDB();

  console.log("db: ", db);

  const posts = await db.all("SELECT * FROM posts");

  if (!posts) {
    throw new Response("Post not found", { status: 404 });
  }

  return json(posts);
};

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return (
    <div
      className={`container mx-auto p-4 ${
        posts.length === 0 ? "grid-cols-1" : "grid grid-cols-1 md:grid-cols-2"
      } gap-4`}
    >
      {posts.length === 0 ? (
        <div className="col-span-1 text-center text-gray-600">
          No posts available.
        </div>
      ) : (
        posts.map((post) => (
          <Link key={post.id} to={`/posts/${post.id}`}>
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <img
                src={post.image ?? DEFAULT_THUMBNAIL}
                alt={post.title}
                className="rounded-md mb-4 w-full"
                loading="lazy"
              />

              <div className="text-sm text-gray-500 mb-2 flex items-center">
                {dayjs(post.createdAt).format("MMMM D, YYYY")}
              </div>
              <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">
                {post.title}
              </h2>

              <p className="text-gray-600 line-clamp-2">{post.content}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
