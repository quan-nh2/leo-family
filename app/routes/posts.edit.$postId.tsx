import { useLoaderData, Form, Params } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

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
  params: { postId: string };
}) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const db = await openDB();
  await db.run(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    title,
    content,
    params.postId
  );

  return redirect(`/posts/${params.postId}`);
};

export default function EditPost() {
  const post = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Edit Post</h1>
      <Form method="post" className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            defaultValue={post.content}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
