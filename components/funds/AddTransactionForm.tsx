"use client";
import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddTransactionFormProps {
  onAdd: (data: {
    type: "INCOME" | "EXPENSE";
    amount: number;
    reason: string;
    evidenceImages: string[];
  }) => Promise<void>;
  adding: boolean;
}

export const AddTransactionForm = ({
  onAdd,
  adding,
}: AddTransactionFormProps) => {
  const [txType, setTxType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [txAmount, setTxAmount] = useState("");
  const [txReason, setTxReason] = useState("");
  const [evidenceImages, setEvidenceImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const removeImage = (index: number) => {
    setEvidenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Cloudinary আপলোড লজিক উইথ প্রগ্রেস
  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const filePercent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1),
              );
              // মোট ফাইলের সাপেক্ষে গড় প্রগ্রেস ক্যালকুলেশন
              const overallPercent = Math.round(
                (i * 100 + filePercent) / totalFiles,
              );
              setUploadProgress(overallPercent);
            },
          },
        );
        if (res.data.secure_url) urls.push(res.data.secure_url);
      } catch (error) {
        console.error("Cloudinary Error:", error);
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
    setIsUploading(false);
    return urls;
  };

  const handleSubmit = async () => {
    if (!txAmount || !txReason) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    try {
      const imageUrls =
        evidenceImages.length > 0
          ? await uploadToCloudinary(evidenceImages)
          : [];

      await onAdd({
        type: txType,
        amount: Number(txAmount),
        reason: txReason,
        evidenceImages: imageUrls,
      });

      toast.success("Transaction added successfully!");

      // Reset Form
      setTxAmount("");
      setTxReason("");
      setTxType("INCOME");
      setEvidenceImages([]);
      setUploadProgress(0);
    } catch (error) {
      toast.error("Failed to add transaction. Try again.");
    }
  };

  return (
    <>
      <Card className="border-2 border-emerald-100 shadow-md">
        <CardHeader className="bg-emerald-50/50">
          <CardTitle className="text-lg text-emerald-700">
            Add Fund Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* ইমেজ সেকশন */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <ImageIcon className="w-4 h-4" />
                <span>Evidence Images (Optional)</span>
              </div>
              {isUploading && (
                <span className="text-xs font-bold text-emerald-600 animate-pulse">
                  Uploading: {uploadProgress}%
                </span>
              )}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading || adding}
              onChange={(e) => {
                if (e.target.files) {
                  setEvidenceImages((prev) => [
                    ...prev,
                    ...Array.from(e.target.files!),
                  ]);
                  e.target.value = "";
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
            />

            {/* আপলোড প্রগ্রেস বার */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* প্রিভিউ থাম্বনেইল */}
            {evidenceImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {evidenceImages.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border rounded-lg overflow-hidden bg-white shadow-sm group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ইনপুট গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={txType}
              disabled={isUploading || adding}
              onChange={(e) => setTxType(e.target.value as any)}
              className="border rounded-md px-3 h-10 bg-white disabled:bg-gray-100"
            >
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>

            <Input
              type="number"
              placeholder="Amount"
              value={txAmount}
              disabled={isUploading || adding}
              onChange={(e) => setTxAmount(e.target.value)}
            />

            <Input
              placeholder="Reason"
              value={txReason}
              disabled={isUploading || adding}
              onChange={(e) => setTxReason(e.target.value)}
            />

            <Button
              onClick={handleSubmit}
              disabled={adding || isUploading}
              className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold h-10"
            >
              {adding || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* টোস্ট কন্টেইনার (এটি ড্যাশবোর্ডের একদম নিচে থাকবে) */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};
