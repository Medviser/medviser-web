import HeadingActions from "@/components/admin/header-actions";
import ErrorReportsList from "./list";

export default function ReportsContent(){
     return (
          <div className="space-y-3">
               <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Սխալների զեկույցներ</h1>
               <HeadingActions/>
               <ErrorReportsList reports={[]}/>
          </div>
     );
}