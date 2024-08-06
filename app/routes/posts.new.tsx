import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { openDB } from "~/db.js";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const db = await openDB();
  await db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [
    title,
    content,
  ]);
  return redirect("/");
};

export default function NewPost() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">New Post</h1>
      <Form method="post" className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
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
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Publish
          </button>
        </div>
      </Form>
    </div>
  );
}
