import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase"
import type { Cafe } from "@/types/cafe"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditCafeDialogProps {
  cafe: Cafe | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCafeUpdated: (updatedCafe: Cafe) => void
}

export function EditCafeDialog({
  cafe,
  open,
  onOpenChange,
  onCafeUpdated,
}: EditCafeDialogProps) {
  const [loading, setLoading] = useState(false)

  // Form states initialized from current cafe
  const [name, setName] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [address, setAddress] = useState("")
  const [rating, setRating] = useState("5.0")
  const [wifiSpeedMbps, setWifiSpeedMbps] = useState("0")
  const [hasOutlets, setHasOutlets] = useState(true)
  const [noiseLevel, setNoiseLevel] = useState<"Quiet" | "Moderate" | "Lively">("Quiet")
  const [tagsInput, setTagsInput] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [notes, setNotes] = useState("")

  // Pre-fill fields whenever a cafe is selected
  useEffect(() => {
    if (cafe) {
      setName(cafe.name)
      setNeighborhood(cafe.neighborhood)
      setAddress(cafe.address)
      setRating(String(cafe.rating))
      setWifiSpeedMbps(String(cafe.wifiSpeedMbps))
      setHasOutlets(cafe.hasOutlets)
      setNoiseLevel(cafe.noiseLevel)
      setTagsInput(cafe.tags.join(", "))
      setImageUrl(cafe.imageUrl || "")
      setNotes(cafe.notes || "")
    }
  }, [cafe])

  if (!cafe) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const updatedData = {
      name: name.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      rating: parseFloat(rating) || 5.0,
      wifi_speed_mbps: parseInt(wifiSpeedMbps, 10) || 0,
      has_outlets: hasOutlets,
      noise_level: noiseLevel,
      tags: tagsArray,
      image_url: imageUrl.trim() || cafe.imageUrl,
      notes: notes.trim(),
    }

    // Match by existing primary key or cafe name
    const { error } = await supabase
      .from("cafes")
      .update(updatedData)
      .eq("name", cafe.name)

    if (error) {
      alert("Error updating cafe: " + error.message)
      setLoading(false)
      return
    }

    const updatedCafe: Cafe = {
      name: updatedData.name,
      neighborhood: updatedData.neighborhood,
      address: updatedData.address,
      rating: updatedData.rating,
      wifiSpeedMbps: updatedData.wifi_speed_mbps,
      hasOutlets: updatedData.has_outlets,
      noiseLevel: updatedData.noise_level,
      tags: updatedData.tags,
      imageUrl: updatedData.image_url,
      notes: updatedData.notes,
    }

    onCafeUpdated(updatedCafe)
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Cafe Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-3 pt-2 text-xs">
          <div className="space-y-1">
            <label className="font-semibold">Cafe Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold">Neighborhood *</label>
              <Input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">Rating (1-5)</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Address *</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="font-semibold">WiFi Speed (Mbps)</label>
              <Input
                type="number"
                value={wifiSpeedMbps}
                onChange={(e) => setWifiSpeedMbps(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Outlets</label>
              <select
                value={hasOutlets ? "yes" : "no"}
                onChange={(e) => setHasOutlets(e.target.value === "yes")}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="yes">Available</option>
                <option value="no">None</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Noise Level</label>
              <select
                value={noiseLevel}
                onChange={(e) =>
                  setNoiseLevel(e.target.value as "Quiet" | "Moderate" | "Lively")
                }
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="Quiet">Quiet</option>
                <option value="Moderate">Moderate</option>
                <option value="Lively">Lively</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Tags (comma-separated)</label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Personal Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}