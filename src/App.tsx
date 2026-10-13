import { useState, useEffect, useMemo } from "react"
import { MOCK_CAFES } from "@/data/mockdata"
import type { Cafe } from "@/types/cafe"
import { CafeCard } from "@/components/ui/cafecard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Tag, Search } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { supabase } from './utils/supabase'


export default function App() {

  const [cafes, setCafes] = useState<Cafe[]>([])
  const [searchName, setSearchName] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)

      //database area
  useEffect(() => {
    async function getCafes() {
      const { data, error } = await supabase.from('cafes').select()

      if (error) {
        console.error("Error fetching cafes:", error)
      } 

      if (data && data.length > 0) {
        // Map Postgres snake_case columns to TypeScript Cafe properties
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
    getCafes()
  }, [])


  // Extract all unique tags across all cafes for the quick filter pills
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    cafes.forEach((c) => c.tags.forEach((t) => tags.add(t)))
    return Array.from(tags)
  }, [cafes])

  // Filter: Search matches cafe name, pill matches selected tag
  const filteredCafes = useMemo(() => {
    const query = searchName.trim().toLowerCase()

    return cafes.filter((cafe) => {
      // 1. Text input searches only the cafe name
      const matchesName = query
        ? cafe.name.toLowerCase().includes(query)
        : true

      // 2. Active pill filter matches tags
      const matchesTag = activeTag
        ? cafe.tags.includes(activeTag)
        : true

      return matchesName && matchesTag
    })
  }, [cafes, searchName, activeTag])
  

  return (
    
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      {/* db area */}
      {/* <ul>
      {cafes.map((cafe) => (
        <li key={cafe.name}>{cafe.name}</li>
      ))}
      </ul> */}


      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
      {/* Search Bar & Quick Tag Filters */}
      <div className="space-y-3">
        <div className="relative flex items-center max-w-md">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
          <Input
            type="searchbar"
            placeholder="Search cafe by name..."
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

        {/* Quick Tag Pills */}
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
      </div>

      {/* Cards Grid */}
      {filteredCafes.length === 0 ? (
        <div className="text-center py-16 border rounded-xl border-dashed">
          <p className="text-sm text-muted-foreground">
            No cafes found
            {searchName ? ` matching "${searchName}"` : ""}
            {activeTag ? ` with tag "${activeTag}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => (
            <CafeCard
              key={cafe.name}
              cafe={cafe}
              onTagClick={(tag) => {
                setActiveTag((prev) => (prev === tag ? null : tag))
              }}
            />
          ))}
        </div>
      )}
    </main>
  )
}