export type Mode = "preview" | "edit";

export type Sections = "home" | "list" | "settings" | "saved";

export type Option = {
  value: string;
  label: string;
};

export interface PageSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
  showBorder: boolean;
  borderWidth: number;
  borderStyle: "solid" | "double" | "dashed" | "dotted";
}

export interface SavedAgreement {
  _id: string;
  title: string;
  description: string;
  content: string; // HTML format
  metadata: {
    formData: any;
    settings: PageSettings;
    generatedAt: string;
    sessionId?: string;
  };
  version: number;
  status: string;
  createdAt: string;
}