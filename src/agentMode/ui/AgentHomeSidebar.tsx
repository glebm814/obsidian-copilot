import type { AgentHomeShelfSection } from "@/agentMode/ui/AgentHomeShelf";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React, { useId } from "react";

interface AgentHomeSidebarProps {
  sections: AgentHomeShelfSection[];
  /**
   * Requested section id. An unknown or disabled id (e.g. a section hidden
   * while its dedicated pane is open) resolves to the first selectable section.
   */
  activeSectionId: string | null;
  onSectionSelect: (id: string) => void;
  className?: string;
}

/**
 * Collapsible left sidebar of Agent Home. Shows one section at a time; the
 * header's arrows step through the selectable sections (wrapping at both ends),
 * and the body fills the remaining height with its own scroll. Open/closed
 * state and the selected section are owned by the parent.
 */
export function AgentHomeSidebar({
  sections,
  activeSectionId,
  onSectionSelect,
  className,
}: AgentHomeSidebarProps): React.ReactElement | null {
  const titleId = useId();
  const selectable = sections.filter((s) => !s.disabled);
  const activeIndex = Math.max(
    0,
    selectable.findIndex((s) => s.id === activeSectionId)
  );
  const active = selectable[activeIndex];
  if (!active) return null;

  const step = (delta: number) => {
    const next = selectable[(activeIndex + delta + selectable.length) % selectable.length];
    onSectionSelect(next.id);
  };
  const canStep = selectable.length > 1;

  return (
    <aside
      aria-labelledby={titleId}
      className={cn(
        "tw-flex tw-min-h-0 tw-flex-col tw-overflow-hidden tw-border-0 tw-border-r tw-border-solid tw-border-border tw-bg-primary",
        className
      )}
    >
      <div className="tw-flex tw-shrink-0 tw-items-center tw-gap-1 tw-bg-secondary tw-p-1">
        <Button
          variant="ghost2"
          size="icon"
          onClick={() => step(-1)}
          disabled={!canStep}
          aria-label="Previous section"
          className="tw-shrink-0"
        >
          <ChevronLeft className="tw-size-4" />
        </Button>
        <div
          id={titleId}
          aria-live="polite"
          className="tw-flex tw-min-w-0 tw-flex-1 tw-items-center tw-justify-center tw-gap-2 tw-text-ui-small tw-font-medium tw-text-normal"
        >
          <span className="tw-flex tw-shrink-0 tw-items-center tw-text-muted">{active.icon}</span>
          <span className="tw-truncate">{active.title}</span>
          {typeof active.count === "number" && active.count > 0 && (
            <span className="tw-shrink-0 tw-text-ui-smaller tw-text-muted">{active.count}</span>
          )}
        </div>
        <Button
          variant="ghost2"
          size="icon"
          onClick={() => step(1)}
          disabled={!canStep}
          aria-label="Next section"
          className="tw-shrink-0"
        >
          <ChevronRight className="tw-size-4" />
        </Button>
      </div>
      <div className="tw-min-h-0 tw-flex-1 tw-overflow-y-auto tw-px-1">
        <div className="tw-flex tw-min-h-full tw-flex-col tw-pb-1">{active.renderBody()}</div>
      </div>
    </aside>
  );
}

interface AgentHomeSidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

/** Icon button that shows or hides {@link AgentHomeSidebar}. */
export function AgentHomeSidebarToggle({
  open,
  onToggle,
}: AgentHomeSidebarToggleProps): React.ReactElement {
  const label = open ? "Hide sidebar" : "Show sidebar";
  const Icon = open ? PanelLeftClose : PanelLeftOpen;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost2"
          size="icon"
          onClick={onToggle}
          aria-label={label}
          aria-expanded={open}
          className="tw-size-8 tw-shrink-0"
        >
          <Icon className="tw-size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
