import { Camera, FileText, MapPin, User, X } from "lucide-react";
import { useRoleContext } from "../../context/RoleContext";

interface MediaOption {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  key: string;
}

interface Props {
  onClose: () => void;
  onSelect: (type: string) => void;
}

export function MediaShareSheet({ onClose, onSelect }: Props) {
  const { location } = useRoleContext();

  const options: MediaOption[] = [
    {
      icon: <Camera className="h-6 w-6" />,
      label: "Photo / Video",
      sublabel: "Camera or gallery",
      key: "photo",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: "Document",
      sublabel: "PDF, Word, Excel",
      key: "document",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: "Location",
      sublabel: `${location.village}, ${location.district}`,
      key: "location",
    },
    {
      icon: <User className="h-6 w-6" />,
      label: "Contact",
      sublabel: "Share contact details",
      key: "contact",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-foreground/40 z-40"
        onClick={onClose}
        aria-label="Close media sheet"
        data-ocid="media_sheet.backdrop"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border shadow-elevated pb-safe"
        data-ocid="media_sheet.panel"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Share</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close"
            data-ocid="media_sheet.close_button"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.key}
              onClick={() => {
                onSelect(opt.key);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/40 active:scale-95 transition-all"
              data-ocid={`media_sheet.option_${opt.key}`}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {opt.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground leading-tight">
                  {opt.label}
                </p>
                {opt.sublabel && (
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                    {opt.sublabel}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
