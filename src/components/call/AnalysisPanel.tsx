import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ConnectDragSource } from "react-dnd";
import type { AnalysisItem } from "@/pages/Index";

interface AnalysisPanelProps {
  dragHandle: ConnectDragSource;
  analysis: AnalysisItem[];
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ dragHandle, analysis }) => {
  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none bg-transparent">
      <CardHeader ref={dragHandle} className="border-b cursor-move">
        <CardTitle>Real-time Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {analysis.length > 0 ? (
              analysis.map((item, index) => (
                <div key={index} className="p-3 rounded-md border bg-muted">
                  <Badge
                    variant={item.level === "warning" ? "destructive" : "secondary"}
                    className="mb-1"
                  >
                    {item.type}
                  </Badge>
                  <p>{item.text}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No analysis available for this call.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};