export type Mode = "preview" | "edit";

export type Sections = "home" | "list" | "settings" | "saved";

export type Option = {
  value: string;
  label: string;
};

export interface SavedAgreement {
  _id: string;
  title: string;
  description: string;
  content: string; // HTML format
  metadata: {
    formData: any;
    generatedAt: string;
    sessionId?: string;
  };
  version: number;
  status: string;
  createdAt: string;
}