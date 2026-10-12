export type NoiseLevel = "Quiet" | "Moderate" | "Lively"

export interface Cafe {
  name: string
  neighborhood: string
  address: string
  rating: number
  wifiSpeedMbps: number
  hasOutlets: boolean
  noiseLevel: NoiseLevel
  tags: string[]
  imageUrl: string
  notes?: string
}