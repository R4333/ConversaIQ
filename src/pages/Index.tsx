import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Settings as SettingsIcon, Mic, MicOff, PanelLeft } from "lucide-react";
import { TranscriptPanel } from "@/components/call/TranscriptPanel";
import { AnalysisPanel } from "@/components/call/AnalysisPanel";
import { ChatPanel } from "@/components/call/ChatPanel";
import { ConversationHistory } from "@/components/history/ConversationHistory";
import React, { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { toast } from "sonner";

// Define types
export type TranscriptEntry = { speaker: string; text: string; };
export type AnalysisItem = { type: string; text: string; level: string; };
export type ChatMessage = { speaker: "You" | "AI"; text: string; };

export type Conversation = {
  id: string;
  title: string;
  date: string;
  transcript: TranscriptEntry[];
  analysis: AnalysisItem[];
  chat: ChatMessage[];
};

type PanelId = "transcript" | "analysis" | "chat";
type PanelLocation = "left" | "topRight" | "bottomRight";

const ItemTypes = {
  PANEL: 'panel',
};

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    title: 'Login Issue with testuser123',
    date: '2024-07-30T10:00:00Z',
    transcript: [
      { speaker: 'Agent', text: 'Hello, thank you for calling Support. How can I help you today?' },
      { speaker: 'Client', text: 'Hi, I\'m having trouble with my account login.' },
      { speaker: 'Agent', text: 'I can certainly help with that. Could you please tell me your username?' },
      { speaker: 'Client', text: 'Sure, it\'s \'testuser123\'.' },
    ],
    analysis: [
      { type: 'Sentiment', text: 'Client seems frustrated.', level: 'warning' },
      { type: 'Suggestion', text: 'Offer a discount for the inconvenience.', level: 'info' },
      { type: 'Keyword', text: 'Detected \'login issue\'.', level: 'default' },
    ],
    chat: [
        { speaker: 'You', text: 'What was the client\'s username?' },
        { speaker: 'AI', text: 'The client\'s username is \'testuser123\'.' }
    ]
  },
  {
    id: 'conv2',
    title: 'Billing Inquiry - INV-0045',
    date: '2024-07-29T14:30:00Z',
    transcript: [
        { speaker: 'Agent', text: 'Support, how can I help?' },
        { speaker: 'Client', text: 'I have a question about my last invoice.' },
    ],
    analysis: [
        { type: 'Keyword', text: 'Detected \'invoice\'.', level: 'default' },
    ],
    chat: []
  }
];

interface DraggablePanelProps {
  id: PanelId;
  location: PanelLocation;
  movePanel: (draggedId: PanelId, targetLocation: PanelLocation) => void;
  conversationData: Conversation | undefined;
}

const DraggableAndDroppablePanel: React.FC<DraggablePanelProps> = ({ id, location, movePanel, conversationData }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { id: PanelId; location: PanelLocation },
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.PANEL,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { id: PanelId; location: PanelLocation }) {
      if (!ref.current || item.id === id) {
        return;
      }
      movePanel(item.id, location);
      item.location = location;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PANEL,
    item: () => ({ id, location }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(ref);

  const renderPanel = () => {
    switch (id) {
      case 'transcript':
        return <TranscriptPanel dragHandle={drag} transcript={conversationData?.transcript || []} />;
      case 'analysis':
        return <AnalysisPanel dragHandle={drag} analysis={conversationData?.analysis || []} />;
      case 'chat':
        return <ChatPanel dragHandle={drag} chatHistory={conversationData?.chat || []} />;
      default:
        return <div className="p-4">Unknown Panel</div>;
    }
  };

  return (
    <div 
      ref={ref} 
      style={{ opacity: isDragging ? 0.25 : 1, height: '100%' }} 
      data-handler-id={handlerId}
    >
      {renderPanel()}
    </div>
  );
};

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv1');
  const [panelLayout, setPanelLayout] = useState<Record<PanelLocation, PanelId>>({
    left: "transcript",
    topRight: "analysis",
    bottomRight: "chat",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
    toast.info(isRecording ? "Recording stopped." : "Recording started...");
  };

  const handleNewConversation = () => {
    const newId = `conv${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: "New Call",
      date: new Date().toISOString(),
      transcript: [],
      analysis: [],
      chat: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    toast.success("Started a new call session.");
  };

  const movePanel = (draggedId: PanelId, targetLocation: PanelLocation) => {
    const sourceLocation = Object.keys(panelLayout).find(
      (key) => panelLayout[key as PanelLocation] === draggedId
    ) as PanelLocation;
    
    if (sourceLocation === targetLocation) return;

    setPanelLayout(prev => {
      const newLayout = { ...prev };
      newLayout[targetLocation] = draggedId;
      newLayout[sourceLocation] = panelLayout[targetLocation];
      return newLayout;
    });
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col max-w-full">
      <header className="flex justify-between items-center p-2 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsHistoryVisible((prev) => !prev)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Call Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleToggleRecording} size="sm" disabled={!activeConversationId}>
            {isRecording ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {isRecording ? "Stop Call" : "Start Call"}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <SettingsIcon className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow overflow-hidden flex flex-row">
        {isHistoryVisible && (
          <div className="w-[20%] min-w-[250px] max-w-[400px] shrink-0 border-r">
            <ConversationHistory 
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}
        <div className="flex-grow">
            <div className="p-4 h-full">
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full rounded-lg border"
              >
                <ResizablePanel defaultSize={50}>
                  <DraggableAndDroppablePanel 
                    id={panelLayout.left} 
                    location="left" 
                    movePanel={movePanel} 
                    conversationData={activeConversation}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                      <DraggableAndDroppablePanel 
                        id={panelLayout.topRight} 
                        location="topRight" 
                        movePanel={movePanel}
                        conversationData={activeConversation}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                      <DraggableAndDroppablePanel 
                        id={panelLayout.bottomRight} 
                        location="bottomRight" 
                        movePanel={movePanel}
                        conversationData={activeConversation}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Index;