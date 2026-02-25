"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Send,
  Paperclip,
  Users,
  ChevronLeft,
  Wheat,
  Sprout,
  Apple,
  Leaf,
  Tractor,
  CircleDot,
} from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

interface ChatGroup {
  id: string
  name: string
  icon: React.ElementType
  members: number
  lastMessage: string
  lastSender: string
  lastTime: string
  unread: number
  joined: boolean
  color: string
}

interface Message {
  id: string
  sender: string
  initials: string
  color: string
  content: string
  time: string
  isMe: boolean
  isSaleListing?: boolean
}

const groups: ChatGroup[] = [
  {
    id: "organic-wheat",
    name: "Organic Wheat Growers",
    icon: Wheat,
    members: 142,
    lastMessage: "Just harvested 200kg, DM for bulk rates",
    lastSender: "Raj P.",
    lastTime: "2m",
    unread: 3,
    joined: true,
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    id: "tomato-farmers",
    name: "Tomato Farmers Union",
    icon: Apple,
    members: 89,
    lastMessage: "Anyone tried the new blight-resistant variety?",
    lastSender: "Priya S.",
    lastTime: "15m",
    unread: 0,
    joined: true,
    color: "bg-red-500/15 text-red-400",
  },
  {
    id: "sustainable-ag",
    name: "Sustainable Farming",
    icon: Sprout,
    members: 234,
    lastMessage: "Cover cropping guide shared in files",
    lastSender: "Admin",
    lastTime: "1h",
    unread: 1,
    joined: true,
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: "soil-health",
    name: "Soil Health Network",
    icon: Leaf,
    members: 67,
    lastMessage: "pH testing results for Zone 4 are in",
    lastSender: "Dr. Meera",
    lastTime: "3h",
    unread: 0,
    joined: false,
    color: "bg-green-500/15 text-green-400",
  },
  {
    id: "farm-machinery",
    name: "Farm Machinery Exchange",
    icon: Tractor,
    members: 198,
    lastMessage: "Selling: John Deere 5050D, 2022 model",
    lastSender: "Vikram T.",
    lastTime: "5h",
    unread: 0,
    joined: false,
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    id: "rice-paddy",
    name: "Rice Paddy Collective",
    icon: Sprout,
    members: 156,
    lastMessage: "Water level monitoring automation tips",
    lastSender: "Sunil K.",
    lastTime: "8h",
    unread: 0,
    joined: false,
    color: "bg-cyan-500/15 text-cyan-400",
  },
]


export function CommunityView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("organic-wheat")
  const [showChat, setShowChat] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(
    new Set(groups.filter((g) => g.joined).map((g) => g.id))
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentGroup = groups.find((g) => g.id === selectedGroup)
  const [groupMessages, setGroupMessages] = useState<Record<string, Message[]>>({
    "organic-wheat": [
      {
        id: "1",
        sender: "Ramesh",
        initials: "RA",
        color: "bg-blue-500/15 text-blue-300",
        content: "Did anyone get rain today?",
        time: "09:12",
        isMe: false,
      },
      {
        id: "2",
        sender: "Anita Sharma",
        initials: "AS",
        color: "bg-pink-500/15 text-pink-300",
        content: "Just a light drizzle for about 10 minutes here in Zone 4.",
        time: "09:18",
        isMe: false,
      },
      {
        id: "3",
        sender: "You",
        initials: "YO",
        color: "bg-emerald-500/15 text-primary",
        content: "No rain on my farm unfortunately. Keeping irrigation systems running.",
        time: "09:24",
        isMe: true,
      },
    ]
  })

  const currentMessages = groupMessages[selectedGroup] || []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [selectedGroup, groupMessages, scrollToBottom])

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroup(groupId)
    setShowChat(true)
  }

  const handleJoin = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation()
    setJoinedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const handleSend = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      initials: "YO",
      color: "bg-emerald-500/15 text-primary",
      content: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }

    setGroupMessages(prev => ({
      ...prev,
      [selectedGroup]: [...(prev[selectedGroup] || []), newMessage]
    }))

    setMessageInput("")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Agritech Community</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect with local farmers &middot; Share knowledge and trade crops</p>
      </div>

      {/* Split pane container */}
      <div className="relative glass-card rounded-2xl overflow-hidden noise">
        <div className="relative flex flex-col lg:flex-row min-h-[600px] lg:min-h-[640px]">

          {/* Left pane - Group Directory */}
          <div className={`lg:w-[340px] lg:shrink-0 lg:border-r lg:border-white/[0.06] flex flex-col ${showChat ? "hidden lg:flex" : "flex"}`}>
            {/* Search */}
            <div className="p-3 border-b border-white/[0.06]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  placeholder="Find local groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 glass-input h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Group list */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredGroups.map((group) => {
                  const isSelected = selectedGroup === group.id
                  const isJoined = joinedGroups.has(group.id)
                  const GroupIcon = group.icon

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleSelectGroup(group.id)}
                      className={`flex items-start gap-3 w-full p-3 rounded-xl text-left transition-all ${isSelected
                          ? "bg-emerald-500/[0.06] border border-emerald-500/10"
                          : "hover:bg-white/[0.03] border border-transparent"
                        }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${group.color}`}>
                        <GroupIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{group.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 shrink-0">{group.lastTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                          <span className="font-medium text-foreground/60">{group.lastSender}:</span> {group.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {group.members}
                          </span>
                          {isJoined ? (
                            group.unread > 0 ? (
                              <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-4 min-w-4 justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                {group.unread}
                              </Badge>
                            ) : (
                              <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] text-[10px] px-1.5 py-0 h-4">
                                Joined
                              </Badge>
                            )
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-5 px-2 text-[10px] border-emerald-500/20 text-primary hover:bg-emerald-500/10 rounded-lg"
                              onClick={(e) => handleJoin(e, group.id)}
                            >
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right pane - Active Chat */}
          <div className={`flex-1 flex flex-col min-w-0 ${!showChat ? "hidden lg:flex" : "flex"}`}>
            {currentGroup ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                  <button
                    onClick={() => setShowChat(false)}
                    className="lg:hidden text-muted-foreground hover:text-foreground"
                    aria-label="Back to group list"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${currentGroup.color}`}>
                    <currentGroup.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{currentGroup.name}</p>
                    <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                      <CircleDot className="w-3 h-3 text-primary" />
                      {currentGroup.members} members &middot; {Math.floor(currentGroup.members * 0.3)} online
                    </p>
                  </div>
                  <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] hidden sm:flex backdrop-blur-sm">
                    <Users className="w-3 h-3 mr-1" />
                    {currentGroup.members}
                  </Badge>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-4 p-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${msg.isMe ? "ml-auto flex-row-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                          <AvatarFallback className={`text-xs font-semibold ${msg.color}`}>
                            {msg.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${msg.isMe ? "items-end" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${msg.isMe ? "text-primary" : "text-foreground/70"}`}>
                              {msg.sender}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50">{msg.time}</span>
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.isMe
                                ? "bg-primary/20 text-foreground border border-emerald-500/15 rounded-tr-md backdrop-blur-sm"
                                : msg.isSaleListing
                                  ? "bg-amber-500/[0.06] border border-amber-500/10 text-foreground rounded-tl-md backdrop-blur-sm"
                                  : "bg-white/[0.04] text-foreground/90 border border-white/[0.06] rounded-tl-md backdrop-blur-sm"
                              }`}
                          >
                            {msg.isSaleListing && (
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-[10px] px-1.5 py-0 h-4">
                                  For Sale
                                </Badge>
                              </div>
                            )}
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input area */}
                <div className="border-t border-white/[0.06] p-3 bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.04] shrink-0"
                      aria-label="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      className="flex-1 glass-input h-10 rounded-xl"
                    />
                    <Button
                      size="icon"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 h-10 w-10 rounded-xl glow-green-sm"
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      aria-label="Send message"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground/60 text-sm">
                Select a group to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
