import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createNote } from "@/lib/api";
import type { CreateNoteData } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const CreateNote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateNoteData>({
    title: "",
    caption: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<CreateNoteData>>({});

  const validateForm = () => {
    const newErrors: Partial<CreateNoteData> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateNoteData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createNote(formData);
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      navigate("/"); // Redirect to home page or notes list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create note",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mainContainer">
      <form onSubmit={handleSubmit} className="w-[70%] h-auto mx-auto flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className={`border w-[500px] mt-4 py-2 rounded-sm px-2 ${
              errors.title ? "border-red-500" : "border-blue-900"
            }`}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          
          <input
            name="caption"
            type="text"
            placeholder="Caption"
            value={formData.caption}
            onChange={handleChange}
            className="border w-[500px] mt-2 py-2 border-blue-900 rounded-sm px-2"
          />
          
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            className={`border w-[500px] mt-2 py-2 rounded-sm px-2 ${
              errors.content ? "border-red-500" : "border-blue-900"
            }`}
          />
          {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
          
          <Button
            type="submit"
            variant="outline"
            className="hover:text-green-400 cursor-pointer w-20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};