import React, { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ImageUploadProps {
  bannerUrl?: string;
  galleryImages?: string;
  onBannerChange: (url: string) => void;
  onGalleryChange: (images: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bannerUrl = "",
  galleryImages = "",
  onBannerChange,
  onGalleryChange,
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Parse gallery images string into array
  const galleryImageArray = galleryImages
    ? galleryImages.split(",").filter(Boolean)
    : [];

  const handleBannerUrlChange = (url: string) => {
    onBannerChange(url);
  };

  const handleGalleryUrlAdd = (url: string) => {
    if (url.trim()) {
      const newImages = [...galleryImageArray, url.trim()];
      onGalleryChange(newImages.join(","));
    }
  };

  const handleGalleryUrlRemove = (index: number) => {
    const newImages = galleryImageArray.filter((_, i) => i !== index);
    onGalleryChange(newImages.join(","));
  };

  // For now, we'll use URL input since file upload requires backend implementation
  // In the future, this can be enhanced with actual file upload functionality

  return (
    <div className="space-y-6">
      {/* Banner Image */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Banner Image</Label>

        <div className="space-y-2">
          <Label htmlFor="bannerUrl" className="text-sm">
            Banner Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => handleBannerUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {
              // TODO: Implement file upload when backend endpoint is ready
              console.log("File upload not implemented yet");
            }}
          />
        </div>

        {/* Banner Preview */}
        {bannerUrl && (
          <div className="relative w-full max-w-md">
            <img
              src={bannerUrl}
              alt="Banner preview"
              className="w-full h-32 object-cover rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleBannerUrlChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Gallery Images</Label>

        <div className="space-y-2">
          <Label htmlFor="galleryUrl" className="text-sm">
            Add Gallery Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="galleryUrl"
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleGalleryUrlAdd(input.value);
                  input.value = "";
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const input = document.getElementById(
                  "galleryUrl"
                ) as HTMLInputElement;
                if (input) {
                  handleGalleryUrlAdd(input.value);
                  input.value = "";
                }
              }}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={() => {
              // TODO: Implement file upload when backend endpoint is ready
              console.log("File upload not implemented yet");
            }}
          />
          <p className="text-xs text-gray-500">
            Press Enter or click Add to add the URL to gallery
          </p>
        </div>

        {/* Gallery Preview */}
        {galleryImageArray.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">
              Gallery Preview ({galleryImageArray.length} images)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {galleryImageArray.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "";
                      target.alt = "Failed to load";
                      target.className = cn(
                        target.className,
                        "bg-gray-100 flex items-center justify-center"
                      );
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => handleGalleryUrlRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {galleryImageArray.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No gallery images added yet</p>
          </div>
        )}
      </div>

      {/* File Upload Note */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> File upload functionality will be available
          when the backend endpoint is implemented. For now, you can use image
          URLs from external sources.
        </p>
      </div>
    </div>
  );
};
