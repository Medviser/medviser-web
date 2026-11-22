"use client"
import HeadingActions from "@/components/admin/header-actions";
import type { getTopics } from "@/data/topics";
import TopicList from "./list";

interface TopicsContentProps{
     topics: Awaited<ReturnType<typeof getTopics>>
}
export default function TopicsContent({topics}: TopicsContentProps) {
     return (
          <div className="space-y-4">
               <h1 className="text-2xl font-semibold">Թեմաներ</h1>
               <HeadingActions href="/admin/topics/editor" />
               <TopicList topics={topics}/>
          </div>
     );
}