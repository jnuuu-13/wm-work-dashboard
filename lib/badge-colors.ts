// Pastel block palette per DESIGN-figma.md — one color per category to keep
// type/category badges visually distinct across Task/Event/Meeting/Playbook.
export const taskTypeColor: Record<string, string> = {
  Client: "bg-block-lime text-black",
  Product: "bg-block-mint text-black",
  Market: "bg-block-coral text-black",
  "Follow-up": "bg-block-lilac text-black",
  Internal: "bg-block-cream text-black",
};

export const priorityColor: Record<string, string> = {
  High: "bg-destructive text-white",
  Medium: "bg-secondary text-secondary-foreground",
  Low: "bg-muted text-muted-foreground",
};

export const statusColor: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-block-lilac text-black",
  Done: "bg-block-mint text-black",
};

export const eventTypeColor: Record<string, string> = {
  고객상담: "bg-block-lime text-black",
  "고객Follow-up": "bg-block-lilac text-black",
  내부미팅: "bg-block-cream text-black",
  상품교육: "bg-block-mint text-black",
  세미나: "bg-block-pink text-black",
  기타: "bg-muted text-muted-foreground",
};

export const meetingTypeColor: Record<string, string> = {
  고객상담: "bg-block-lime text-black",
  내부미팅: "bg-block-cream text-black",
  상품교육: "bg-block-mint text-black",
  세미나: "bg-block-pink text-black",
};

export const playbookCategoryColor: Record<string, string> = {
  금융상품: "bg-block-lime text-black",
  "계좌·세금": "bg-block-lilac text-black",
  시장: "bg-block-coral text-black",
  상담: "bg-block-mint text-black",
  업무프로세스: "bg-block-cream text-black",
};
