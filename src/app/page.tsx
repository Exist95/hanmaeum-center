import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  const allPosts = await Promise.all(
    posts.results.map((post) => getPost(post.id))
  );
  return allPosts.filter((post): post is Post => post !== null);
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl text-[#1e53aa] font-bold tracking-tight sm:text-5xl mb-2">
          한마음재가복지센터
        </h1>
        <p className="text-xl font-bold text-[#a0a0a0]">
          가장에서 편안하게 가족처럼 따뜻하게
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
