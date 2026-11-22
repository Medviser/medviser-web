import HeadingActions from "@/components/admin/header-actions";
import ResourcesList from "./list";
import type { Resource } from "@/db/schema";

interface ResourcesContentProps{
     resources: Resource[]
}
export default function ResourcesContent({resources}: ResourcesContentProps){
     return (
          <div className="space-y-3">
               <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Ռեսուրսներ</h1>
               <HeadingActions href="/admin/resources/editor"/>
               <ResourcesList data={resources}/>
          </div>
     );
}