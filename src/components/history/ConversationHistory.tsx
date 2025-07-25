import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/pages/Index";

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ConversationHistory = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationHistoryProps) => {
  return (
    <div className="h-full flex flex-col bg-muted/20 dark:bg-muted/50">
      <div className="p-4 border-b">
        <Button className="w-full" onClick={onNewConversation}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Call
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 pt-2 space-y-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight mb-2">
            History
          </h2>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                activeConversationId === conv.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <p className="font-semibold truncate text-sm">{conv.title}</p>
              <p className="text-xs opacity-70">{new Date(conv.date).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};