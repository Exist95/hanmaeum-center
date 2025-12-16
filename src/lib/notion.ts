import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client";
import { cache } from "react";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
}

/* ===============================
   Published Posts (list)
================================ */
export const fetchPublishedPosts = cache(async () => {
  return await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: { equals: "Published" },
    },
    sorts: [
      {
        property: "Published Date",
        direction: "descending",
      },
    ],
  });
});

/* ===============================
   Single Post
================================ */
export const getPost = cache(async (pageId: string): Promise<Post | null> => {
  try {
    const page = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;

    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: content } = n2m.toMarkdownString(mdBlocks);

    const properties: any = page.properties;

    const paragraphs = content
      .split("\n")
      .filter((l: string) => l.trim().length > 0);

    const description =
      paragraphs[0]?.slice(0, 160) +
        (paragraphs[0]?.length > 160 ? "..." : "") || "";

    const slug =
      properties.Slug?.rich_text?.[0]?.plain_text?.trim();

    if (!slug) {
      throw new Error("Slug is missing (required)");
    }

    return {
      id: page.id,
      title: properties.Title.title[0]?.plain_text || "Untitled",
      slug,
      coverImage: properties["Featured Image"]?.url,
      description,
      date: properties["Published Date"]?.date?.start,
      content,
      author: properties.Author?.people?.[0]?.name,
      tags: properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      category: properties.Category?.select?.name,
    };
  } catch (err) {
    console.error("getPost error:", err);
    return null;
  }
});
