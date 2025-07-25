import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ConnectDragSource } from "react-dnd";
import type { TranscriptEntry } from "@/pages/Index";

interface TranscriptPanelProps {
  dragHandle: ConnectDragSource;
  transcript: TranscriptEntry[];
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ dragHandle, transcript }) => {
  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none bg-transparent">
      <CardHeader ref={dragHandle} className="border-b cursor-move">
        <CardTitle>Live Transcript</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {transcript.length > 0 ? (
              transcript.map((entry, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    entry.speaker === "Client" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      entry.speaker === "Client"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-xs font-bold mb-1 opacity-70">
                      {entry.speaker}
                    </p>
                    <p className="text-sm">{entry.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No transcript available for this call.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};