"use client"

import { useState } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  Share2,
  Search,
  Plus,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Flag,
} from "lucide-react"

interface Post {
  id: string
  author: {
    name: string
    avatar?: string
    role: "member" | "moderator" | "expert"
  }
  title: string
  content: string
  category: string
  tags: string[]
  timestamp: string
  likes: number
  replies: number
  views: number
  isBookmarked: boolean
  hasAudio?: boolean
  hasImages?: boolean
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: { name: "Sarah Chen", role: "expert" },
    title: "Best Screen Reader Settings for Web Development",
    content:
      "I've been using screen readers for web development for over 5 years. Here are my recommended settings for NVDA and JAWS when coding...",
    category: "Technology",
    tags: ["screen-reader", "development", "tips"],
    timestamp: "2 hours ago",
    likes: 24,
    replies: 8,
    views: 156,
    isBookmarked: false,
    hasAudio: true,
  },
  {
    id: "2",
    author: { name: "Marcus Johnson", role: "moderator" },
    title: "Weekly Check-in: How are you doing?",
    content:
      "It's time for our weekly community check-in! Share how you're doing, any challenges you're facing, or victories you'd like to celebrate...",
    category: "Community",
    tags: ["check-in", "support", "community"],
    timestamp: "4 hours ago",
    likes: 18,
    replies: 23,
    views: 89,
    isBookmarked: true,
  },
  {
    id: "3",
    author: { name: "Elena Rodriguez", role: "member" },
    title: "Braille Display Recommendations for Students",
    content:
      "I'm starting university next month and need advice on choosing a Braille display. Budget is around $2000. What would you recommend?",
    category: "Equipment",
    tags: ["braille", "education", "recommendations"],
    timestamp: "1 day ago",
    likes: 12,
    replies: 15,
    views: 203,
    isBookmarked: false,
    hasImages: true,
  },
]

const categories = ["All", "Technology", "Community", "Equipment", "Tips & Tricks", "Support", "Events"]

export function CommunityHub() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Community", tags: "" })
  const { announce } = useAccessibility()

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
    announce("Post liked")
  }

  const handleBookmark = (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))
    const post = posts.find((p) => p.id === postId)
    announce(post?.isBookmarked ? "Post unbookmarked" : "Post bookmarked")
  }

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      announce("Please fill in both title and content")
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      author: { name: "You", role: "member" },
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      timestamp: "Just now",
      likes: 0,
      replies: 0,
      views: 1,
      isBookmarked: false,
    }

    setPosts((prev) => [post, ...prev])
    setNewPost({ title: "", content: "", category: "Community", tags: "" })
    setShowNewPostForm(false)
    announce("Post created successfully")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-balance">Community Hub</h1>
          <p className="text-muted-foreground text-pretty">
            Connect, share, and learn with the accessibility community
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search community posts"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category)
                announce(`Filtering by ${category}`)
              }}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="flex items-center gap-2"
          aria-expanded={showNewPostForm}
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your thoughts, questions, or experiences with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="post-title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="post-title"
                placeholder="What's your post about?"
                value={newPost.title}
                onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="post-content" className="block text-sm font-medium mb-2">
                Content
              </label>
              <Textarea
                id="post-content"
                placeholder="Share your thoughts..."
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="post-category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="post-category"
                  value={newPost.category}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="post-tags" className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  id="post-tags"
                  placeholder="accessibility, tips, help"
                  value={newPost.tags}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitPost}>Post</Button>
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters, or create the first post!</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{post.author.name}</h3>
                      <Badge
                        variant={
                          post.author.role === "expert"
                            ? "default"
                            : post.author.role === "moderator"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {post.author.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.timestamp}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 text-balance">{post.title}</h2>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Media Indicators */}
                <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                  {post.hasAudio && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Audio available
                    </span>
                  )}
                  {post.hasImages && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Images included
                    </span>
                  )}
                </div>

                <Separator className="mb-4" />

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.replies} replies
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1"
                      aria-label={`Like post. Currently ${post.likes} likes`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center gap-1 ${post.isBookmarked ? "text-primary" : ""}`}
                      aria-label={post.isBookmarked ? "Remove bookmark" : "Bookmark post"}
                    >
                      <Bookmark className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Community Guidelines */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Community Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-pretty">
            <li>• Be respectful and inclusive in all interactions</li>
            <li>• Share knowledge and experiences to help others</li>
            <li>• Use descriptive titles and appropriate tags</li>
            <li>• Provide alt text for images and transcripts for audio</li>
            <li>• Report inappropriate content using the flag button</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
