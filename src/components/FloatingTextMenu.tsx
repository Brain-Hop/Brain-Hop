
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { createPortal } from "react-dom";

interface FloatingTextMenuProps {
  position: { x: number; y: number } | null;
  onAsk: () => void;
  onClose: () => void;
  visible: boolean;
}

export function FloatingTextMenu({ position, onAsk, onClose, visible }: FloatingTextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible || !position) return null;

  // Use createPortal to render outside the overflow hidden containers
  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position.y - 40, // Position above the cursor
        left: position.x,
        transform: "translateX(-50%)",
        zIndex: 50,
      }}
      className="bg-card border border-border rounded-md shadow-lg p-1 animate-in fade-in zoom-in-95 duration-100"
    >
      <Button 
        onClick={(e) => {
            e.stopPropagation();
            onAsk();
        }} 
        size="sm" 
        variant="secondary" 
        className="h-8 gap-2"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Ask AI
      </Button>
    </div>,
    document.body
  );
}
