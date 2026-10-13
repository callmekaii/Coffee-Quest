import { useState } from "react"
import { supabase } from "@/utils/supabase"
import type { Cafe } from "@/types/cafe"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface AddCafeDialogProps {
  onCafeAdded: (newCafe: Cafe) => void
}

export function AddCafeDialog({ onCafeAdded }: AddCafeDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [address, setAddress] = useState("")
  const [rating, setRating] = useState("4.5")
  const [wifiSpeedMbps, setWifiSpeedMbps] = useState("50")
  const [hasOutlets, setHasOutlets] = useState(true)
  const [noiseLevel, setNoiseLevel] = useState<"Quiet" | "Moderate" | "Lively">("Quiet")
  const [tagsInput, setTagsInput] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const fallbackImage =
      imageUrl.trim() ||
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"

    const payload = {
      name: name.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      rating: parseFloat(rating) || 5.0,
      wifi_speed_mbps: parseInt(wifiSpeedMbps) || 0,
      has_outlets: hasOutlets,
      noise_level: noiseLevel,
      tags: tagsArray,
      image_url: fallbackImage,
      notes: notes.trim(),
    }

    const { data, error } = await supabase
      .from("cafes")
      .insert([payload])
      .select()
      .single()

    if (error) {
      alert("Error adding cafe: " + error.message)
      setLoading(false)
      return
    }

    if (data) {
      const addedCafe: Cafe = {
        name: data.name,
        neighborhood: data.neighborhood,
        address: data.address,
        rating: Number(data.rating),
        wifiSpeedMbps: data.wifi_speed_mbps,
        hasOutlets: data.has_outlets,
        noiseLevel: data.noise_level,
        tags: data.tags || [],
        imageUrl: data.image_url,
        notes: data.notes,
      }

      onCafeAdded(addedCafe)
      setOpen(false)
      // Reset form
      setName("")
      setNeighborhood("")
      setAddress("")
      setTagsInput("")
      setImageUrl("")
      setNotes("")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm" className="gap-1.5 h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4" /> Add Cafe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">List a New Cafe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
          <div className="space-y-1">
            <label className="font-semibold">Cafe Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Brew & Chill"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold">Neighborhood *</label>
              <Input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Downtown"
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
              placeholder="123 Coffee Ave."
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
                onChange={(e) => setNoiseLevel(e.target.value as "Quiet" | "Moderate" | "Lively")}
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
              placeholder="Natural Light, Good Matcha, Fast WiFi"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Image URL (optional)</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold">Personal Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Good tables by the window, AC can get chilly"
            />
          </div>

          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Saving to your list..." : "Save Cafe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}