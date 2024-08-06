import { json, redirect } from "@remix-run/node";
import { Params, useLoaderData, Link, Form } from "@remix-run/react";
import dayjs from "dayjs";
import { DEFAULT_THUMBNAIL } from "~/contants";
import { openDB } from "~/db.js";

export const loader = async ({ params }: { params: Params }) => {
  const db = await openDB();
  const post = await db.get("SELECT * FROM posts WHERE id = ?", [
    params.postId,
  ]);

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json(post);
};

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: Params;
}) => {
  if (request.method !== "DELETE") {
    throw new Response("Method Not Allowed", { status: 405 });
  }

  const db = await openDB();
  await db.run("DELETE FROM posts WHERE id = ?", [params.postId]);

  return redirect("/");
};

export default function PostDetail() {
  const post = useLoaderData<typeof loader>();

  const handleDeletePost = async (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        src={post.image ?? DEFAULT_THUMBNAIL}
        alt={post.title}
        className="rounded-md mb-4 w-full"
        loading="lazy"
      />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4 flex items-center">
        {dayjs(post.createdAt).format("MMMM D, YYYY")}
      </div>
      <div className="prose mb-4">
        <p>{post.content}</p>
      </div>
      <div className="flex justify-end">
        <Link
          to={`/posts/edit/${post.id}`}
          className="text-blue-500 hover:underline"
        >
          Update
        </Link>
        <Form method="delete" onSubmit={handleDeletePost}>
          <button type="submit" className="text-red-500 ml-2 hover:underline">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
