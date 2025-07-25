import {
  useState,
  useRef,
  ClipboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ConnectDragSource } from "react-dnd";
import type { ChatMessage } from "@/pages/Index";

interface ChatPanelProps {
  dragHandle: ConnectDragSource;
  chatHistory: ChatMessage[];
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ dragHandle, chatHistory }) => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (attachment && attachment.type.startsWith("image/")) {
      const url = URL.createObjectURL(attachment);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [attachment]);

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setAttachment(file);
          toast.success("Screenshot attached from clipboard!");
          event.preventDefault();
        }
        break;
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
      toast.success(`File "${file.name}" attached.`);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none bg-transparent">
      <CardHeader ref={dragHandle} className="border-b cursor-move">
        <CardTitle>Ask AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 p-0">
        <ScrollArea className="flex-grow h-full px-6 pt-4">
          <div className="space-y-4">
            {chatHistory.length > 0 ? (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    message.speaker === "You" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      message.speaker === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-xs font-bold mb-1 opacity-70">
                      {message.speaker}
                    </p>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No messages yet. Ask the AI something!</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 space-y-2">
          {attachment && (
            <div className="relative p-2 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Attachment preview"
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <Paperclip className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="text-sm overflow-hidden">
                  <p className="font-medium truncate">{attachment.name}</p>
                  <p className="text-muted-foreground">
                    {(attachment.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={handleRemoveAttachment}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Ask or paste a screenshot..."
              onPaste={handlePaste}
            />
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};