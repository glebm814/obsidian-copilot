import type { AgentHomeShelfSection } from "@/agentMode/ui/AgentHomeShelf";
import { AgentHomeSidebar } from "@/agentMode/ui/AgentHomeSidebar";
import type { Meta, StoryObj } from "@/lib/story";
import { FileSearch, Folder, MessageSquare } from "lucide-react";
import React, { useState } from "react";

type AgentHomeSidebarProps = React.ComponentProps<typeof AgentHomeSidebar>;

const placeholder = (label: string) => () => (
  <div className="tw-flex tw-flex-col tw-gap-2 tw-p-3 tw-text-ui-small tw-text-muted">
    <span>{label} 1</span>
    <span>{label} 2</span>
    <span>{label} 3</span>
  </div>
);

const sections: AgentHomeShelfSection[] = [
  {
    id: "chats",
    icon: <MessageSquare className="tw-size-4" />,
    title: "Recent Chats",
    renderBody: placeholder("Chat"),
  },
  {
    id: "relevant-notes",
    icon: <FileSearch className="tw-size-4" />,
    title: "Relevant Notes",
    renderBody: placeholder("Note"),
  },
  {
    id: "projects",
    icon: <Folder className="tw-size-4" />,
    title: "Projects",
    count: 3,
    renderBody: placeholder("Project"),
  },
];

function SidebarCanvas(props: Partial<AgentHomeSidebarProps>): React.ReactElement {
  const [activeId, setActiveId] = useState(props.activeSectionId ?? null);
  return (
    <div className="tw-flex tw-h-96">
      <AgentHomeSidebar
        sections={props.sections ?? sections}
        className="tw-w-72"
        activeSectionId={activeId}
        onSectionSelect={setActiveId}
      />
    </div>
  );
}

const meta = {
  title: "Agent Mode/Agent Home Sidebar",
  component: AgentHomeSidebar,
  args: { sections, activeSectionId: null, onSectionSelect: () => {} },
  parameters: { gallery: { host: "leaf", layout: "padded" } },
} satisfies Meta<AgentHomeSidebarProps>;
export default meta;

/** Opens on Recent Chats; the arrows cycle through the sections. */
export const Default: StoryObj<AgentHomeSidebarProps> = { render: SidebarCanvas };

/** Projects selected, showing its count next to the title. */
export const ProjectsSelected: StoryObj<AgentHomeSidebarProps> = {
  args: { activeSectionId: "projects" },
  render: SidebarCanvas,
};
