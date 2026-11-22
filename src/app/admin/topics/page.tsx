import { getTopics } from "@/data/topics";
import TopicsContent from "./content";

export default async function TopicsPage() {
     const topics = await getTopics();
     return (
          <TopicsContent
               topics={topics}
          />
     );
}