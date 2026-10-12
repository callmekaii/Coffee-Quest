import type { Cafe } from "@/types/cafe"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Zap, Volume2, Star } from "lucide-react"

interface CafeCardProps {
  cafe: Cafe
  onTagClick?: (tag: string) => void
}

export function CafeCard({ cafe, onTagClick }: CafeCardProps) {
  // Enforce limit of up to three tags
  const visibleTags = cafe.tags.slice(0, 3)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between border-border/80 h-full">
      <div>
        {/* Image Container with Absolute Overlays */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <img
            src={cafe.imageUrl}
            alt={cafe.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          
          {/* Tag Overlay - Top Left (Up to 3) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
            {visibleTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] py-0.5 px-2 bg-black/60 text-white hover:bg-black/85 border-none backdrop-blur-sm transition-colors cursor-pointer font-normal"
                onClick={() => onTagClick?.(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Star Rating - Top Right */}
          <div className="absolute top-3 right-3 bg-black/60 text-white backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 border-none">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 border-none" />
            <span>{cafe.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title & Location Header */}
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-base font-bold leading-tight line-clamp-1">
            {cafe.name}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground line-clamp-1">
            {cafe.neighborhood} • {cafe.address}
          </CardDescription>
        </CardHeader>

        {/* Workspace Specs Grid */}
        <CardContent className="px-5 pb-3">
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-border/60 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" title="WiFi Speed">
              <Wifi className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span className="truncate">{cafe.wifiSpeedMbps} Mbps</span>
            </div>

            <div className="flex items-center gap-1.5" title="Power Plugs">
              <Zap
                className={`w-3.5 h-3.5 shrink-0 ${
                  cafe.hasOutlets ? "text-amber-500" : "text-muted-foreground/30"
                }`}
              />
              <span className="truncate">{cafe.hasOutlets ? "Outlets" : "No plugs"}</span>
            </div>

            <div className="flex items-center gap-1.5" title="Noise Level">
              <Volume2 className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span className="truncate">{cafe.noiseLevel}</span>
            </div>
                <p className="text-sm col-span-3">
                    {cafe.notes}
                </p>

          </div>
        </CardContent>
      </div>

      {/* Optional Footnote / Review */}
      {/* {cafe.notes && (
        <CardFooter className="px-5 pt-0 pb-4 text-xs p-3 text-muted-foreground italic line-clamp-2">
          "{cafe.notes}"
        </CardFooter>
      )} */}
    </Card>
  )
}