import type { AgentHomeShelfSection } from "@/agentMode/ui/AgentHomeShelf";
import { AgentHomeSidebar, AgentHomeSidebarToggle } from "@/agentMode/ui/AgentHomeSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// The tooltip portal targets Obsidian's `activeDocument` global (popout-safe);
// jsdom has no such global, so point it at the test document.
beforeAll(() => {
  (window as unknown as { activeDocument: Document }).activeDocument = window.document;
});

function section(id: string, title: string, extra?: Partial<AgentHomeShelfSection>) {
  return {
    id,
    icon: <span />,
    title,
    renderBody: () => <div>{`${title} BODY`}</div>,
    ...extra,
  } satisfies AgentHomeShelfSection;
}

const chats = section("chats", "Recent Chats");
const notes = section("relevant-notes", "Relevant Notes");
const projects = section("projects", "Projects", { count: 4 });

function renderSidebar(activeSectionId: string | null, sections = [chats, notes, projects]) {
  const onSectionSelect = jest.fn();
  render(
    <AgentHomeSidebar
      sections={sections}
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    />
  );
  return onSectionSelect;
}

describe("AgentHomeSidebar", () => {
  describe("AgentHomeSidebar()", () => {
    it("shows the first section when nothing is selected", () => {
      renderSidebar(null);
      expect(screen.queryByText("Recent Chats BODY")).not.toBeNull();
      expect(screen.queryByText("Projects BODY")).toBeNull();
    });

    it("shows the selected section with its count", () => {
      renderSidebar("projects");
      expect(screen.queryByText("Projects BODY")).not.toBeNull();
      expect(screen.getByRole("complementary").textContent).toContain("4");
    });

    it("falls back to the first section when the selected one is missing", () => {
      renderSidebar("relevant-notes", [chats, projects]);
      expect(screen.queryByText("Recent Chats BODY")).not.toBeNull();
    });

    it("steps to the next and previous sections, wrapping at both ends", () => {
      const onSelect = renderSidebar("chats");
      fireEvent.click(screen.getByRole("button", { name: "Next section" }));
      expect(onSelect).toHaveBeenLastCalledWith("relevant-notes");
      fireEvent.click(screen.getByRole("button", { name: "Previous section" }));
      expect(onSelect).toHaveBeenLastCalledWith("projects");
    });

    it("skips disabled sections when stepping", () => {
      const onSelect = renderSidebar("chats", [
        chats,
        section("relevant-notes", "Relevant Notes", { disabled: true }),
        projects,
      ]);
      fireEvent.click(screen.getByRole("button", { name: "Next section" }));
      expect(onSelect).toHaveBeenLastCalledWith("projects");
    });

    it("disables the arrows when only one section is available", () => {
      renderSidebar(null, [chats]);
      expect(screen.getByRole("button", { name: "Next section" })).toHaveProperty("disabled", true);
    });
  });

  describe("AgentHomeSidebarToggle()", () => {
    it("reports toggles and reflects the open state in its label", () => {
      const onToggle = jest.fn();
      const { rerender } = render(
        <TooltipProvider>
          <AgentHomeSidebarToggle open={false} onToggle={onToggle} />
        </TooltipProvider>
      );
      fireEvent.click(screen.getByRole("button", { name: "Show sidebar" }));
      expect(onToggle).toHaveBeenCalledTimes(1);

      rerender(
        <TooltipProvider>
          <AgentHomeSidebarToggle open onToggle={onToggle} />
        </TooltipProvider>
      );
      expect(
        screen.getByRole("button", { name: "Hide sidebar" }).getAttribute("aria-expanded")
      ).toBe("true");
    });
  });
});
