"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TONES, LANGUAGES, BUSINESS_CATEGORIES } from "@/lib/constants";
import type { AIGenerationInput } from "@/types/ai-generate";

const INITIAL_FORM: AIGenerationInput = {
  businessName: "",
  businessCategory: "restaurant",
  targetAudience: "",
  promotionText: "",
  tone: "professional",
  language: "en",
};

interface AIGenerationFormProps {
  onGenerate: (input: AIGenerationInput, images: File[]) => void;
  isStreaming: boolean;
}

export function AIGenerationForm({ onGenerate, isStreaming }: AIGenerationFormProps) {
  const [form, setForm] = useState<AIGenerationInput>(INITIAL_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof AIGenerationInput>(key: K, value: AIGenerationInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 5 - images.length);

    if (!accepted.length) return;

    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    onGenerate(form, images);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
        <CardDescription>
          Fill in your business info and we&apos;ll generate a full content package.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="e.g. Fresh Bites Café"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                required
                disabled={isStreaming}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">Category *</Label>
              <Select
                value={form.businessCategory}
                onValueChange={(v) => set("businessCategory", v as AIGenerationInput["businessCategory"])}
                disabled={isStreaming}
              >
                <SelectTrigger id="businessCategory">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target audience */}
          <div className="space-y-2">
            <Label htmlFor="targetAudience">
              Target Audience{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="targetAudience"
              placeholder="e.g. young professionals, families, fitness enthusiasts"
              value={form.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              disabled={isStreaming}
            />
          </div>

          {/* Promotion text */}
          <div className="space-y-2">
            <Label htmlFor="promotionText">
              Promotion / Offer{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="promotionText"
              placeholder="e.g. 20% off all meals this weekend, grand opening, new menu launch…"
              value={form.promotionText}
              onChange={(e) => set("promotionText", e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isStreaming}
            />
          </div>

          {/* Row 2: Tone + Language */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone of Voice</Label>
              <Select
                value={form.tone}
                onValueChange={(v) => set("tone", v as AIGenerationInput["tone"])}
                disabled={isStreaming}
              >
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={form.language}
                onValueChange={(v) => set("language", v)}
                disabled={isStreaming}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>
              Images{" "}
              <span className="text-muted-foreground text-xs">(up to 5, optional)</span>
            </Label>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={isStreaming}
                      className="absolute top-0.5 right-0.5 rounded-full bg-background/80 p-0.5 hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <div
                className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop images or{" "}
                  <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP — max 5 images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                  disabled={isStreaming}
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isStreaming || !form.businessName.trim()}>
            {isStreaming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content Package
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
