import { useState, useEffect, useMemo } from "react"
import type { Cafe } from "@/types/cafe"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./utils/supabase"

import { CafeCard } from "@/components/ui/cafecard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoginForm } from "@/components/login-form"
import { AddCafeDialog } from "@/components/addcafedialog"
import { EditCafeDialog } from "@/components/editcafedialog"
import { X, Tag, Search, LogOut, Coffee } from "lucide-react"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [cafes, setCafes] = useState<Cafe[]>([])
  const [searchName, setSearchName] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Track modal visibility & selected item for editing
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Sync auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load cafes for the authenticated user
  useEffect(() => {
    if (!user) {
      setCafes([])
      return
    }

    async function getUserCafes() {
      const { data, error } = await supabase
        .from("cafes")
        .select()
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching cafes:", error.message)
        return
      }

      if (data) {
        const formattedCafes: Cafe[] = data.map((item) => ({
          name: item.name,
          neighborhood: item.neighborhood,
          address: item.address,
          rating: Number(item.rating),
          wifiSpeedMbps: item.wifi_speed_mbps,
          hasOutlets: item.has_outlets,
          noiseLevel: item.noise_level,
          tags: item.tags || [],
          imageUrl: item.image_url,
          notes: item.notes,
        }))

        setCafes(formattedCafes)
      }
    }

    getUserCafes()
  }, [user])

  // Extract unique tags for filter pills
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    cafes.forEach((cafe) => cafe.tags?.forEach((tag) => tags.add(tag)))
    return Array.from(tags)
  }, [cafes])

  // Filter cafes by name search and active tag
  const filteredCafes = useMemo(() => {
    const query = searchName.trim().toLowerCase()

    return cafes.filter((cafe) => {
      const matchesName = query
        ? cafe.name.toLowerCase().includes(query)
        : true

      const matchesTag = activeTag
        ? cafe.tags?.includes(activeTag)
        : true

      return matchesName && matchesTag
    })
  }, [cafes, searchName, activeTag])

  const handleEditClick = (cafe: Cafe) => {
    setEditingCafe(cafe)
    setIsEditDialogOpen(true)
  }

  const handleCafeUpdated = (updatedCafe: Cafe) => {
    setCafes((prev) =>
      prev.map((c) => (c.name === editingCafe?.name ? updatedCafe : c))
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading CoffeeQuest...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4 md:p-10">
        <div className="w-full max-w-4xl">
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top bar */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-base tracking-tight">CoffeeQuest</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>

            <AddCafeDialog
              onCafeAdded={(newCafe: Cafe) =>
                setCafes((prev) => [newCafe, ...prev])
              }
            />

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Edit modal */}
      <EditCafeDialog
        cafe={editingCafe}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onCafeUpdated={handleCafeUpdated}
      />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search & tag filters */}
        <div className="space-y-3">
          <div className="relative flex items-center max-w-md">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search your cafes..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchName && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchName("")}
                className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" /> Quick filter:
              </span>

              {allTags.map((tag) => {
                const isSelected = activeTag === tag
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-xs transition-colors"
                    onClick={() => setActiveTag(isSelected ? null : tag)}
                  >
                    {tag}
                  </Badge>
                )
              })}

              {activeTag && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto p-0 text-muted-foreground"
                  onClick={() => setActiveTag(null)}
                >
                  Reset tag filter
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Card grid or empty placeholder */}
        {filteredCafes.length === 0 ? (
          <div className="text-center py-16 border rounded-xl border-dashed space-y-2">
            <p className="text-sm font-medium text-foreground">No cafes found</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {searchName || activeTag
                ? "Try clearing your search query or tag filter."
                : 'Start curating your spots by clicking the "Add Cafe" button above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => (
              <CafeCard
                key={cafe.name}
                cafe={cafe}
                onTagClick={(tag) =>
                  setActiveTag((prev) => (prev === tag ? null : tag))
                }
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}